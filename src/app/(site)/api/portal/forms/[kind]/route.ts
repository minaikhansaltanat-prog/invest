import { clientIp } from '@/hooks/auth'
import { acknowledgement, sendMail, staffNotice, staffRecipients } from '@/lib/email'
import { fieldErrors, formSpecs, isFormKind, submissionSchema } from '@/lib/forms/definitions'
import { altchaKey, appSecret } from '@/lib/portal/env'
import { json, sessionOf } from '@/lib/portal/http'
import { buildReference, CONSENT_VERSION, hashIp } from '@/lib/portal/submissions'
import { verifySolution } from '@/lib/security/altcha'
import { rateLimit } from '@/lib/security/rateLimit'

/**
 * Форма өтініші (ТТ 8.1, 9, 14.2): шектеу, Zod, келісім, honeypot, ALTCHA. Сәтті болса, `submissions` жинағына жазылады,
 * өтініш берушіге растау хаты, қызметкерлерге хабар кетеді. Құпия деректер жауапқа түспейді.
 */
export async function POST(request: Request, context: { params: Promise<{ kind: string }> }) {
  const { kind } = await context.params
  if (!isFormKind(kind)) return json({ error: 'not-found' }, 404)

  const ip = clientIp(request.headers)
  const limited = rateLimit(`form:${ip}`, { limit: 6, windowMs: 10 * 60_000 })
  if (!limited.ok) return json({ error: 'rate-limited' }, 429, { 'retry-after': String(Math.ceil(limited.retryAfterMs / 1000)) })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad-request' }, 400)
  }

  const parsed = submissionSchema(formSpecs[kind]).safeParse(body)
  if (!parsed.success) return json({ error: 'validation', fields: fieldErrors(parsed.error) }, 400)

  const captcha = verifySolution(altchaKey(), parsed.data.altcha)
  if (!captcha.ok) return json({ error: 'captcha', reason: captcha.reason }, 403)

  const { payload, user } = await sessionOf(request.headers)
  const data = parsed.data.data as Record<string, unknown>
  const reference = buildReference(kind)

  await payload.create({
    collection: 'submissions',
    overrideAccess: true,
    data: {
      reference,
      kind,
      status: 'new',
      contactName: typeof data.contactName === 'string' ? data.contactName : undefined,
      email: typeof data.email === 'string' ? data.email : undefined,
      locale: parsed.data.locale,
      data: data as never,
      consent: { at: new Date().toISOString(), version: CONSENT_VERSION, ipHash: hashIp(ip, appSecret()) },
      ...(user?.collection === 'users' ? { user: Number(user.id) } : {}),
    },
  })

  const email = typeof data.email === 'string' ? data.email : ''
  if (email) await sendMail(payload, { to: email, ...acknowledgement(kind, parsed.data.locale, reference) })
  const staff = staffRecipients()
  if (staff.length > 0) await sendMail(payload, { to: staff, ...staffNotice(kind, reference) })

  return json({ ok: true, reference }, 201)
}
