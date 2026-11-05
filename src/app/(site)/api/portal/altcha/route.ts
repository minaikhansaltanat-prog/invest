import { clientIp } from '@/hooks/auth'
import { altchaKey } from '@/lib/portal/env'
import { json } from '@/lib/portal/http'
import { rateLimit } from '@/lib/security/rateLimit'
import { createChallenge } from '@/lib/security/altcha'

/** ALTCHA challenge (proof-of-work): Google reCAPTCHA жоқ. IP бойынша минутына 30 сұрау. */
export async function GET(request: Request) {
  const limited = rateLimit(`altcha:${clientIp(request.headers)}`, { limit: 30, windowMs: 60_000 })
  if (!limited.ok) return json({ error: 'rate-limited' }, 429, { 'retry-after': String(Math.ceil(limited.retryAfterMs / 1000)) })
  return json(createChallenge(altchaKey()))
}
