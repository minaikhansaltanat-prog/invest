import { z } from 'zod'

import { userRoles } from '@/access/roles'
import { locales } from '@/i18n/config'
import { passwordProblems } from '@/lib/portal/password'

// Тіркелу мен кіру схемалары (ТТ 9): сервер де, браузер де қолданады. Қате «код» ретінде қайтады, мәтінді интерфейс көрсетеді.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'required' }).min(2, { error: 'tooShort' }).max(120, { error: 'tooLong' }),
    email: z.string().trim().toLowerCase().min(1, { error: 'required' }).max(160, { error: 'tooLong' }).regex(emailPattern, { error: 'email' }),
    password: z.string().min(1, { error: 'required' }).max(128, { error: 'tooLong' }),
    passwordConfirm: z.string().min(1, { error: 'required' }),
    roles: z.array(z.enum(userRoles)).min(1, { error: 'required' }),
    organization: z.string().trim().max(200, { error: 'tooLong' }).optional(),
    country: z.string().trim().max(80, { error: 'tooLong' }).optional(),
    phone: z.string().trim().max(40, { error: 'tooLong' }).optional(),
    locale: z.enum(locales),
    consent: z.literal(true, { error: 'required' }),
    altcha: z.string().min(1, { error: 'required' }),
    hp: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password && passwordProblems(data.password, data.email).length > 0) {
      ctx.addIssue({ code: 'custom', path: ['password'], message: 'weak' })
    }
    if (data.passwordConfirm && data.password !== data.passwordConfirm) {
      ctx.addIssue({ code: 'custom', path: ['passwordConfirm'], message: 'mismatch' })
    }
  })

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, { error: 'required' }).regex(emailPattern, { error: 'email' }),
  password: z.string().min(1, { error: 'required' }),
  totp: z.string().trim().optional(),
})

export type AuthErrorCode = 'required' | 'email' | 'tooShort' | 'tooLong' | 'weak' | 'mismatch' | 'invalid'

/**
 * Тіркелу қателері: Zod қателері + өрістер арасындағы тексерулер (әлсіз құпия сөз, құпия сөздердің сәйкессіздігі).
 * Zod жалпы объектінің басқа қатесі болғанда `superRefine` орындамайды, сондықтан бұл тексерулер осы жерде бөлек жүреді,
 * пайдаланушы барлық қатені бірден көреді. Бос объект: қате жоқ.
 */
export function registerErrors(input: unknown): Record<string, AuthErrorCode> {
  const parsed = registerSchema.safeParse(input)
  const fields = parsed.success ? {} : authFieldErrors(parsed.error)
  const raw = (input ?? {}) as Record<string, unknown>
  const password = typeof raw.password === 'string' ? raw.password : ''
  const email = typeof raw.email === 'string' ? raw.email : ''
  if (password && !fields.password && passwordProblems(password, email).length > 0) fields.password = 'weak'
  if (raw.passwordConfirm && password !== raw.passwordConfirm && !fields.passwordConfirm) fields.passwordConfirm = 'mismatch'
  return fields
}

export function authFieldErrors(error: z.ZodError): Record<string, AuthErrorCode> {
  const known: AuthErrorCode[] = ['required', 'email', 'tooShort', 'tooLong', 'weak', 'mismatch']
  const out: Record<string, AuthErrorCode> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    if (!(key in out)) out[key] = known.includes(issue.message as AuthErrorCode) ? (issue.message as AuthErrorCode) : 'invalid'
  }
  return out
}
