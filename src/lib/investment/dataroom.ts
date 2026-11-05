// NDA және деректер бөлмесі (ТТ 8.6, 14.1).
//
// Қатынас шарттары: NDA осы жобаға әрі осы инвесторға қол қойылған, мерзімі өтпеген (әдепкі 90 күн),
// кері алынбаған; инвестор деңгейі A немесе B және вето жоқ; деректер бөлмесін ашу үшін 2FA міндетті.
//
// Болжам: бас тарту себептерінің реті: veto-active, grade-too-low, nda-missing, nda-revoked,
//   nda-expired, two-factor-required. Инвестордың өз жағдайы алдымен тексеріледі, ал 2FA ең
//   соңында: қалған барлық шарт орындалғанда ғана қосымша қадам сұралады. Сыртқы API инвесторға
//   жалпы «қатынас жоқ» деп жауап беруі тиіс, нақты себеп (мысалы veto-active) тек журналға жазылады.
// Болжам: NDA инвесторға тиесілі (`nda.investorId === investor.id`); басқа инвестордың NDA-сы
//   қатынас бермейді ('nda-missing').
// Болжам: кері алу = `revokedAt` белгіленген (уақытына қарамай). Мерзім шекарасы: `now` мерзімге
//   тең немесе одан кейін болса, NDA мерзімі өтті. `expiresAt` берілсе, соны қолданады, әйтпесе
//   қол қойылған күн + `accessDays` (әдепкі 90).
// Болжам: су белгісі пішімі `Аты | YYYY-MM-DD` (UTC). Аты бос немесе күні жарамсыз болса, қате
//   лақтырылады: белгісіз су белгісімен құжат берілмейді. Дәл осылай `describeAccessLog`
//   пайдаланушысыз немесе уақытсыз жазбаны қабылдамайды (журнал толық болуы тиіс).

import type { GradeKey } from '@/lib/scoring/config'
import { addDaysUtc, type DateInput, toTimestamp } from '@/lib/scoring/dates'
import { type ComplianceVeto, isMatchableGrade, isVetoActive } from '@/lib/scoring/status'

export const defaultNdaDays = 90

export type NdaRecord = {
  projectId: string
  investorId: string
  signedAt: DateInput
  /** Сақталған аяқталу күні (ТТ 13.3 `мерзімі`); жоқ болса, signedAt + accessDays есептеледі */
  expiresAt?: DateInput | null
  accessDays?: number | null
  /** Кері алынған уақыты; белгіленсе, NDA күшін жойды */
  revokedAt?: DateInput | null
}

export type DataroomInvestor = {
  id: string
  grade?: GradeKey | null
  veto?: ComplianceVeto | null
}

export type DataroomDenyReason =
  | 'nda-missing'
  | 'nda-expired'
  | 'nda-revoked'
  | 'grade-too-low'
  | 'veto-active'
  | 'two-factor-required'

export type DataroomAccess = {
  allowed: boolean
  /** Рұқсат берілсе null */
  reason: DataroomDenyReason | null
}

/** NDA қатынасының аяқталу сәті: қол қойылған күн + `days` (әдепкі 90). */
export function ndaExpiry(signedAt: DateInput, days = defaultNdaDays): Date {
  return addDaysUtc(new Date(toTimestamp(signedAt)), days)
}

const isSet = (value: DateInput | null | undefined): boolean =>
  value !== null && value !== undefined && value !== ''

const deny = (reason: DataroomDenyReason): DataroomAccess => ({ allowed: false, reason })

/** Инвестор осы жобаның деректер бөлмесін аша ала ма (ТТ 8.6, 14.1) */
export function canAccessDataroom(input: {
  nda: NdaRecord | null | undefined
  investor: DataroomInvestor
  project: { id: string }
  now: DateInput
  twoFactorVerified: boolean
}): DataroomAccess {
  const { nda, investor, project, now, twoFactorVerified } = input

  if (isVetoActive(investor.veto)) return deny('veto-active')
  if (!isMatchableGrade(investor.grade)) return deny('grade-too-low')

  const signedMs = nda ? toTimestamp(nda.signedAt) : Number.NaN
  if (
    !nda ||
    nda.projectId !== project.id ||
    nda.investorId !== investor.id ||
    Number.isNaN(signedMs)
  ) {
    return deny('nda-missing')
  }
  if (isSet(nda.revokedAt)) return deny('nda-revoked')

  const expiryMs = isSet(nda.expiresAt)
    ? toTimestamp(nda.expiresAt)
    : ndaExpiry(nda.signedAt, nda.accessDays ?? defaultNdaDays).getTime()
  if (!(toTimestamp(now) < expiryMs)) return deny('nda-expired')

  if (twoFactorVerified !== true) return deny('two-factor-required')
  return { allowed: true, reason: null }
}

/** Жеке су белгісінің мәтіні (ТТ 8.6): аты мен күні. Мысалы: `Li Wei | 2026-11-05`. */
export function watermarkText(name: string, date: DateInput): string {
  const cleanName = typeof name === 'string' ? name.replace(/\s+/g, ' ').trim() : ''
  if (cleanName === '') throw new Error('watermarkText: аты бос болмауы тиіс')
  const time = toTimestamp(date)
  if (Number.isNaN(time)) throw new Error('watermarkText: күн жарамсыз')
  return `${cleanName} | ${new Date(time).toISOString().slice(0, 10)}`
}

/** Деректер бөлмесіндегі әрекет: ашу, қарау, жүктеу немесе қатынастан бас тарту */
export type DataroomAction = 'open' | 'view' | 'download' | 'denied'

export type AccessLogInput = {
  userId: string
  action: DataroomAction
  projectId: string
  fileId?: string | null
  ip?: string | null
  at: DateInput
  /** 'denied' әрекеті үшін `canAccessDataroom` қайтарған себеп */
  reason?: DataroomDenyReason | null
}

export type AccessLogEntry = {
  /** Кім */
  userId: string
  /** Не істеді */
  action: DataroomAction
  projectId: string
  fileId: string | null
  /** Қашан: ISO 8601, UTC */
  at: string
  ip: string | null
  reason: DataroomDenyReason | null
  /** Тілге тәуелсіз бір жол: `dataroom.download user=... project=... file=... ip=... at=...` */
  message: string
}

/** Аудит журналына жазылатын жазбаны жасайды (ТТ 8.6: әр ашу мен жүктеу). Таза функция. */
export function describeAccessLog(input: AccessLogInput): AccessLogEntry {
  const userId = input.userId?.trim()
  const projectId = input.projectId?.trim()
  if (!userId) throw new Error('describeAccessLog: userId бос болмауы тиіс')
  if (!projectId) throw new Error('describeAccessLog: projectId бос болмауы тиіс')
  const time = toTimestamp(input.at)
  if (Number.isNaN(time)) throw new Error('describeAccessLog: күн жарамсыз')

  const at = new Date(time).toISOString()
  const fileId = input.fileId?.trim() || null
  const ip = input.ip?.trim() || null
  const reason = input.reason ?? null

  const parts = [`dataroom.${input.action}`, `user=${userId}`, `project=${projectId}`]
  if (fileId) parts.push(`file=${fileId}`)
  parts.push(`ip=${ip ?? '-'}`)
  if (reason) parts.push(`reason=${reason}`)
  parts.push(`at=${at}`)

  return { userId, action: input.action, projectId, fileId, at, ip, reason, message: parts.join(' ') }
}
