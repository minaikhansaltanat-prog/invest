import type { Payload } from 'payload'

import { clientIp } from '@/hooks/auth'
import { canAccessDataroom, type DataroomAccess, describeAccessLog, type DataroomAction } from '@/lib/investment/dataroom'
import { type InvestorDoc, toNdaRecord } from '@/lib/investment/records'
import { isMatchableGrade, isVetoActive } from '@/lib/scoring/status'

import { sessionOf } from './http'
import { hasValidTwoFactor } from './twofactor'

// Деректер бөлмесіне қатынас шешімі (ТТ 8.6, 14.1): сессия + инвестор жазбасы + NDA + деңгей/вето + 2FA. Ереже `canAccessDataroom` ішінде.
// Сыртқа тек жалпы «қатынас жоқ» шығады, нақты себеп журналға ғана жазылады.

/** NDA шаблонының нұсқасы: мәтін өзгерсе, жаңартылады (қол қойылған жазбада сақталады) */
export const NDA_TEMPLATE_VERSION = 'nda-v1-2026-11'

type Session = Awaited<ReturnType<typeof sessionOf>>
type InvestorRecord = InvestorDoc & { id: number | string; displayName?: string | null }

export type DataroomDecision =
  | { kind: 'unauthorized' }
  | { kind: 'denied'; reason: NonNullable<DataroomAccess['reason']> | 'investor-missing'; session: Session }
  | { kind: 'allowed'; session: Session; investor: InvestorRecord; ndaId: number | string }

export async function findInvestorOf(payload: Payload, userId: string | number): Promise<InvestorRecord | null> {
  const { docs } = await payload.find({ collection: 'investors', where: { user: { equals: userId } }, limit: 1, depth: 0, overrideAccess: true })
  return (docs[0] as unknown as InvestorRecord) ?? null
}

/** Ең соңғы NDA (осы жоба + осы инвестор) */
export async function latestNda(payload: Payload, projectId: string | number, investorId: string | number) {
  const { docs } = await payload.find({
    collection: 'ndas',
    where: { and: [{ project: { equals: projectId } }, { investor: { equals: investorId } }] },
    sort: '-signedAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

export async function dataroomDecision(headers: Headers, projectId: string | number, now: Date = new Date()): Promise<DataroomDecision> {
  const session = await sessionOf(headers)
  const { payload, user } = session
  if (!user || user.collection !== 'users') return { kind: 'unauthorized' }

  const investor = await findInvestorOf(payload, user.id)
  if (!investor) return { kind: 'denied', reason: 'investor-missing', session }

  const nda = await latestNda(payload, projectId, investor.id)
  const twoFactorVerified = Boolean(user.totpEnabled) && hasValidTwoFactor(headers, { id: user.id, collection: 'users' })
  const decision = canAccessDataroom({
    nda: toNdaRecord(nda as never),
    investor: { id: String(investor.id), grade: (investor.grade as 'A' | 'B' | 'C' | 'D' | null) ?? null, veto: { active: Boolean(investor.veto?.active), reason: investor.veto?.reason ?? null } },
    project: { id: String(projectId) },
    now,
    twoFactorVerified,
  })
  if (!decision.allowed || !nda) return { kind: 'denied', reason: decision.reason ?? 'nda-missing', session }
  return { kind: 'allowed', session, investor, ndaId: nda.id }
}

/** Журналға жазу (ТТ 8.6): әр ашу, қарау және бас тарту. Сәтсіздік қатынасты тоқтатпайды, бірақ logger-ға түседі. */
export async function logDataroom(
  payload: Payload,
  input: { userId: string | number; action: DataroomAction; projectId: string | number; fileId?: string | number | null; request: { headers: Headers }; reason?: string | null },
) {
  try {
    const entry = describeAccessLog({
      userId: String(input.userId),
      action: input.action,
      projectId: String(input.projectId),
      fileId: input.fileId === null || input.fileId === undefined ? null : String(input.fileId),
      ip: clientIp(input.request.headers),
      at: new Date(),
      reason: (input.reason as never) ?? null,
    })
    await payload.create({
      collection: 'dataroomLog',
      overrideAccess: true,
      data: {
        at: entry.at,
        action: entry.action,
        user: Number(input.userId),
        project: Number(input.projectId),
        ...(entry.fileId ? { file: Number(entry.fileId) } : {}),
        ip: entry.ip ?? undefined,
        reason: entry.reason ?? undefined,
        message: entry.message,
      },
    })
  } catch (error) {
    payload.logger.error({ err: error }, 'data room access log failed')
  }
}

export type AccessState = 'anonymous' | 'not-investor' | 'not-eligible' | 'two-factor-setup' | 'sign-nda' | 'two-factor-verify' | 'ready'

/** Жоба бетінде инвесторға көрсетілетін қадам: кіру, өтініш, 2FA қосу, NDA қол қою, 2FA растау немесе деректер бөлмесі */
export async function accessStateFor(headers: Headers, projectId: string | number): Promise<AccessState> {
  const { payload, user } = await sessionOf(headers)
  if (!user || user.collection !== 'users') return 'anonymous'
  const investor = await findInvestorOf(payload, user.id)
  if (!investor) return 'not-investor'
  if (!eligibleToSign(investor)) return 'not-eligible'
  if (!user.totpEnabled) return 'two-factor-setup'
  const nda = await latestNda(payload, projectId, investor.id)
  const valid = Boolean(nda) && !nda!.revokedAt && new Date(nda!.expiresAt).getTime() > Date.now()
  if (!valid) return 'sign-nda'
  return hasValidTwoFactor(headers, { id: user.id, collection: 'users' }) ? 'ready' : 'two-factor-verify'
}

/** NDA-ға қол қоюға инвестор жарай ма: A/B деңгей және вето жоқ */
export const eligibleToSign = (investor: InvestorRecord): boolean =>
  isMatchableGrade((investor.grade as 'A' | 'B' | 'C' | 'D' | null) ?? null) && !isVetoActive({ active: Boolean(investor.veto?.active) })
