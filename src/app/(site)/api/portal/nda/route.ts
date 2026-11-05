import { clientIp } from '@/hooks/auth'
import { defaultNdaDays, ndaExpiry } from '@/lib/investment/dataroom'
import { isSecureEnv, twoFactorEncryptionSecret } from '@/lib/portal/env'
import { eligibleToSign, findInvestorOf, latestNda, NDA_TEMPLATE_VERSION } from '@/lib/portal/dataroom'
import { json, sessionOf } from '@/lib/portal/http'
import { signTwoFactor, twoFactorCookieHeader } from '@/lib/portal/twofactor'
import { rateLimit } from '@/lib/security/rateLimit'
import { decryptSecret } from '@/lib/security/secretBox'
import { verifyTotp } from '@/lib/security/totp'

/**
 * NDA-ға электрондық акцепт (ТТ 8.6, 1-кезең): чекбокс + OTP (TOTP коды). Шарттар: инвестор аккаунты, 2FA қосулы, код дұрыс,
 * инвестор A/B деңгейлі және ветосыз. Жазбаға шаблон нұсқасы, уақыт, IP, браузер жазылады; қатынас 90 күнге беріледі.
 */
export async function POST(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'users') return json({ error: 'unauthorized' }, 401)
  if (!rateLimit(`nda:${user.id}`, { limit: 6, windowMs: 10 * 60_000 }).ok) return json({ error: 'rate-limited' }, 429)

  let body: { projectId?: number | string; accept?: boolean; code?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'bad-request' }, 400)
  }
  if (body.accept !== true || !body.projectId) return json({ error: 'bad-request' }, 400)

  const record = (await payload.findByID({ collection: 'users', id: user.id, overrideAccess: true, depth: 0 })) as unknown as { totpEnabled?: boolean | null; totpSecret?: string | null }
  if (!record.totpEnabled || !record.totpSecret) return json({ error: 'two-factor-required' }, 403)
  if (!verifyTotp(decryptSecret(record.totpSecret, twoFactorEncryptionSecret()), String(body.code ?? ''))) return json({ error: 'invalid-code' }, 401)

  const investor = await findInvestorOf(payload, user.id)
  if (!investor || !eligibleToSign(investor)) return json({ error: 'no-access' }, 403)

  const project = await payload.findByID({ collection: 'projects', id: body.projectId, overrideAccess: true, depth: 0 }).catch(() => null)
  if (!project || !['2', '3', '4'].includes(String(project.level))) return json({ error: 'not-found' }, 404)

  const existing = await latestNda(payload, project.id, investor.id)
  const now = new Date()
  const stillValid = existing && !existing.revokedAt && new Date(existing.expiresAt).getTime() > now.getTime()
  const cookie = { 'set-cookie': twoFactorCookieHeader(signTwoFactor(user.id, 'users'), isSecureEnv()) }
  if (stillValid) return json({ ok: true, already: true, nda: existing.id }, 200, cookie)

  const nda = await payload.create({
    collection: 'ndas',
    overrideAccess: true,
    data: {
      project: project.id,
      investor: investor.id as number,
      user: Number(user.id),
      templateVersion: NDA_TEMPLATE_VERSION,
      method: 'otp-accept',
      signedAt: now.toISOString(),
      expiresAt: ndaExpiry(now, defaultNdaDays).toISOString(),
      ip: clientIp(request.headers),
      userAgent: (request.headers.get('user-agent') ?? '').slice(0, 300),
    },
  })
  return json({ ok: true, nda: nda.id, expiresAt: nda.expiresAt }, 201, cookie)
}
