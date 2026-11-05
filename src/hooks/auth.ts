import { APIError, type CollectionAfterLoginHook, type CollectionBeforeValidateHook, ValidationError } from 'payload'

import { writeAudit } from '@/hooks/audit'
import { twoFactorEncryptionSecret } from '@/lib/portal/env'
import { clientIp } from '@/lib/portal/ip'
import { passwordProblems } from '@/lib/portal/password'
import { rateLimit } from '@/lib/security/rateLimit'
import { decryptSecret } from '@/lib/security/secretBox'
import { verifyTotp } from '@/lib/security/totp'

export { clientIp }

/** Құпия сөз саясаты (ТТ 14.1): әкімші мен пайдаланушы жинақтарында құпия сөз берілген кезде тексеріледі */
export const enforcePasswordPolicy: CollectionBeforeValidateHook = ({ data, collection }) => {
  const record = data as { password?: unknown; email?: unknown } | undefined
  if (typeof record?.password === 'string' && record.password !== '') {
    const problems = passwordProblems(record.password, typeof record.email === 'string' ? record.email : '')
    if (problems.length > 0) {
      throw new ValidationError({
        collection: collection.slug,
        errors: [
          {
            path: 'password',
            message: 'Password must be 12 to 128 characters long, contain a letter and a digit, and not be common or based on the email.',
          },
        ],
      })
    }
  }
  return data
}

/**
 * Пайдаланушы 2FA қосқан болса, кіру кезінде TOTP коды (`totp` өрісі) міндетті. Құпия сөз расталғаннан кейін ғана тексеріледі
 * (құпия сөзсіз 2FA бар-жоғы жария болмайды). Қате код 10 минутта 5 реттен артық мүмкін емес.
 * Әкімші панелінің кіру формасы `totp` жібере алмайды, сондықтан әкімшілерде 2FA кіруден кейін cookie қақпасымен тексеріледі.
 */
export const requireTotpAfterLogin: CollectionAfterLoginHook = async ({ req, user, collection }) => {
  // Өрістік access құпияны жасырады: толық жазбаны Local API арқылы overrideAccess-пен аламыз
  const doc = (await req.payload.findByID({
    collection: collection.slug as 'users',
    id: (user as { id: string | number }).id,
    overrideAccess: true,
    depth: 0,
    req, // кіру транзакциясында жұмыс істейді (бөлек қосылым болса, жазба құлпы кіруді бұғаттайды)
  })) as { id: string | number; totpEnabled?: boolean | null; totpSecret?: string | null }
  if (!doc.totpEnabled || !doc.totpSecret) return user
  const code = String((req.data as { totp?: unknown } | undefined)?.totp ?? '').trim()
  if (!code) throw new APIError('totp-required', 401, undefined, true)
  if (!rateLimit(`totp:${doc.id}`, { limit: 5, windowMs: 10 * 60 * 1000 }).ok) throw new APIError('totp-rate-limited', 429, undefined, true)
  if (!verifyTotp(decryptSecret(doc.totpSecret, twoFactorEncryptionSecret()), code)) throw new APIError('totp-invalid', 401, undefined, true)
  return user
}

/** Кіру тарихы (ТТ 9): соңғы 10 кіру, уақыт, IP, браузер */
export const recordLogin: CollectionAfterLoginHook = async ({ req, user, collection }) => {
  const doc = user as { id: string | number; loginHistory?: { at: string; ip?: string; agent?: string }[] | null }
  const entry = {
    at: new Date().toISOString(),
    ip: clientIp(req.headers),
    agent: (req.headers?.get('user-agent') ?? '').slice(0, 200),
  }
  try {
    await req.payload.update({
      collection: collection.slug as 'users' | 'admins',
      id: doc.id,
      data: { loginHistory: [entry, ...(doc.loginHistory ?? [])].slice(0, 10) },
      overrideAccess: true,
      depth: 0,
      // req МІНДЕТТІ: кіру операциясы осы жолды транзакцияда ұстап тұр, бөлек қосылым өзін-өзі бұғаттап (deadlock) тастайды
      req,
      context: { skipAudit: true },
    })
  } catch (error) {
    req.payload.logger.warn({ err: error }, 'login history not recorded')
  }
  await writeAudit(req, { action: 'login', collection: collection.slug, docId: doc.id, note: entry.agent, actor: { collection: collection.slug, id: doc.id, email: (user as { email?: string }).email } })
  return user
}
