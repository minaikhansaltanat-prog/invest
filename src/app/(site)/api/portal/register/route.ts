import { userRoles } from '@/access/roles'
import { clientIp } from '@/hooks/auth'
import { registerErrors, registerSchema } from '@/lib/forms/auth'
import { altchaKey } from '@/lib/portal/env'
import { json, payloadClient } from '@/lib/portal/http'
import { CONSENT_VERSION } from '@/lib/portal/submissions'
import { verifySolution } from '@/lib/security/altcha'
import { rateLimit } from '@/lib/security/rateLimit'

/**
 * Пайдаланушы тіркелуі (ТТ 9, 14): шектеу, Zod, құпия сөз саясаты, келісім, ALTCHA.
 * Рөл тек инвестор, жоба иесі, мүше болуы мүмкін (қызметкер рөлін осы жолмен алуға болмайды), мәртебесі «белсенді».
 */
export async function POST(request: Request) {
  const limited = rateLimit(`register:${clientIp(request.headers)}`, { limit: 5, windowMs: 10 * 60_000 })
  if (!limited.ok) return json({ error: 'rate-limited' }, 429, { 'retry-after': String(Math.ceil(limited.retryAfterMs / 1000)) })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad-request' }, 400)
  }

  const found = registerErrors(body)
  if (Object.keys(found).length > 0) return json({ error: 'validation', fields: found }, 400)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return json({ error: 'validation', fields: {} }, 400)

  const captcha = verifySolution(altchaKey(), parsed.data.altcha)
  if (!captcha.ok) return json({ error: 'captcha', reason: captcha.reason }, 403)

  const payload = await payloadClient()
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: parsed.data.email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return json({ error: 'exists' }, 409)

  const { name, email, password, roles, organization, country, phone, locale } = parsed.data
  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      name,
      email,
      password,
      roles: roles.filter((role) => (userRoles as readonly string[]).includes(role)),
      status: 'active',
      locale,
      organization,
      country,
      phone,
      consents: { privacyAt: new Date().toISOString(), privacyVersion: CONSENT_VERSION },
    },
  })
  return json({ ok: true }, 201)
}
