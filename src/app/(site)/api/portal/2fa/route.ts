import { adminTwoFactorRequired, isSecureEnv, twoFactorEncryptionSecret, twoFactorIssuer } from '@/lib/portal/env'
import { json, sessionOf } from '@/lib/portal/http'
import { clearTwoFactorCookieHeader, hasValidTwoFactor, signTwoFactor, twoFactorCookieHeader } from '@/lib/portal/twofactor'
import { rateLimit } from '@/lib/security/rateLimit'
import { decryptSecret, encryptSecret } from '@/lib/security/secretBox'
import { generateTotpSecret, otpauthUri, verifyTotp } from '@/lib/security/totp'

type Action = 'status' | 'enroll' | 'confirm' | 'verify' | 'disable'
const actions: Action[] = ['status', 'enroll', 'confirm', 'verify', 'disable']

/**
 * TOTP 2FA басқаруы (ТТ 9, 14.1). Пайдаланушы мен әкімші үшін ортақ: сессия міндетті.
 * enroll: жаңа кілт жасайды (расталғанша «күтуде»), confirm: бірінші кодпен қосады, verify: кодты растап, 12 сағатқа cookie береді,
 * disable: кодпен өшіреді. Кілт базада шифрланған, жауапта тек enroll кезінде бір рет қайтады.
 */
export async function POST(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user) return json({ error: 'unauthorized' }, 401)

  let body: { action?: string; code?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'bad-request' }, 400)
  }
  const action = body.action as Action
  if (!actions.includes(action)) return json({ error: 'bad-request' }, 400)

  const collection = user.collection
  const record = (await payload.findByID({ collection, id: user.id, overrideAccess: true, depth: 0 })) as unknown as {
    totpEnabled?: boolean | null
    totpSecret?: string | null
    totpPending?: string | null
  }
  const key = twoFactorEncryptionSecret()
  const secure = isSecureEnv()
  const verified = hasValidTwoFactor(request.headers, { id: user.id, collection })
  const update = (data: Record<string, unknown>) =>
    payload.update({ collection, id: user.id, data: data as never, overrideAccess: true, depth: 0 })

  if (action === 'status') {
    return json({ enabled: Boolean(record.totpEnabled), verified, collection, required: collection === 'admins' ? adminTwoFactorRequired() : false })
  }

  if (action === 'enroll') {
    if (record.totpEnabled) return json({ error: 'already-enabled' }, 409)
    const secret = generateTotpSecret()
    await update({ totpPending: encryptSecret(secret, key) })
    return json({ secret, uri: otpauthUri({ issuer: twoFactorIssuer, account: user.email, secret }) })
  }

  const code = String(body.code ?? '')
  if (!rateLimit(`2fa:${collection}:${user.id}`, { limit: 6, windowMs: 10 * 60_000 }).ok) return json({ error: 'rate-limited' }, 429)

  if (action === 'confirm') {
    if (!record.totpPending) return json({ error: 'no-pending' }, 409)
    if (!verifyTotp(decryptSecret(record.totpPending, key), code)) return json({ error: 'invalid-code' }, 401)
    await update({ totpSecret: record.totpPending, totpPending: null, totpEnabled: true })
    return json({ ok: true }, 200, { 'set-cookie': twoFactorCookieHeader(signTwoFactor(user.id, collection), secure) })
  }

  if (!record.totpEnabled || !record.totpSecret) return json({ error: 'not-enabled' }, 409)
  if (!verifyTotp(decryptSecret(record.totpSecret, key), code)) return json({ error: 'invalid-code' }, 401)

  if (action === 'verify') {
    return json({ ok: true }, 200, { 'set-cookie': twoFactorCookieHeader(signTwoFactor(user.id, collection), secure) })
  }

  // disable
  await update({ totpSecret: null, totpPending: null, totpEnabled: false })
  return json({ ok: true }, 200, { 'set-cookie': clearTwoFactorCookieHeader(secure) })
}
