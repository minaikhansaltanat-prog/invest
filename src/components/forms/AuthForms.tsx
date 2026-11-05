'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type FormEvent, useState } from 'react'

import { userRoleLabels, userRoles } from '@/access/roles'
import { Button } from '@/components/ui/Button'
import { Checkbox, Field, Input } from '@/components/ui/Field'
import { Icon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { Link, useRouter } from '@/i18n/navigation'
import { type AuthErrorCode, authFieldErrors, loginSchema, registerErrors, registerSchema } from '@/lib/forms/auth'

import { useAltcha } from './useAltcha'

const Alert = ({ children }: { children: string }) => (
  <div role="alert" className="flex items-start gap-2.5 rounded-card border border-danger/40 bg-danger-bg px-4 py-3 text-sm font-medium text-danger">
    <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
    {children}
  </div>
)

/** Кіру: пошта + құпия сөз; пайдаланушыда 2FA қосулы болса, сервер `totp-required` қайтарады да, код өрісі пайда болады */
export function LoginForm({ next }: { next?: string }) {
  const t = useTranslations('account')
  const tf = useTranslations('forms')
  const router = useRouter()
  const [values, setValues] = useState({ email: '', password: '', totp: '' })
  const [errors, setErrors] = useState<Record<string, AuthErrorCode>>({})
  const [needTotp, setNeedTotp] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (name: keyof typeof values, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      const { [name]: _removed, ...rest } = previous
      return rest
    })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) return setErrors(authFieldErrors(parsed.error))
    setBusy(true)
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email, password: values.password, ...(values.totp ? { totp: values.totp } : {}) }),
      })
      if (response.ok) {
        // 2FA белгісі (cookie) деректер бөлмесі үшін: код енгізілген болса, дереу растаймыз
        if (values.totp) {
          await fetch('/api/portal/2fa', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ action: 'verify', code: values.totp }),
          })
        }
        router.push(next && next.startsWith('/') ? next : '/account')
        router.refresh()
        return
      }
      const body = (await response.json().catch(() => ({}))) as { errors?: { message?: string }[] }
      const text = body.errors?.[0]?.message ?? ''
      if (text === 'totp-required') {
        setNeedTotp(true)
        setMessage(t('totpNeeded'))
      } else if (text === 'totp-invalid') {
        setNeedTotp(true)
        setMessage(t('totpInvalid'))
      } else if (response.status === 429 || text === 'totp-rate-limited') setMessage(tf('server.rateLimited'))
      else if (/locked/i.test(text)) setMessage(t('locked'))
      else if (response.status === 401 || response.status === 400) setMessage(t('loginFailed'))
      else setMessage(tf('server.error'))
    } catch {
      setMessage(tf('server.network'))
    }
    setBusy(false)
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-5">
      {message ? <Alert>{message}</Alert> : null}
      <Field label={t('email')} required error={errors.email ? tf(`err.${errors.email}`) : undefined}>
        {(ids) => (
          <Input {...ids} type="email" name="email" autoComplete="email" value={values.email} onChange={(event) => set('email', event.target.value)} />
        )}
      </Field>
      <Field label={t('password')} required error={errors.password ? tf(`err.${errors.password}`) : undefined}>
        {(ids) => (
          <Input {...ids} type="password" name="password" autoComplete="current-password" value={values.password} onChange={(event) => set('password', event.target.value)} />
        )}
      </Field>
      {needTotp ? (
        <Field label={t('totpCode')} required>
          {(ids) => (
            <Input
              {...ids}
              name="totp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              autoFocus
              value={values.totp}
              onChange={(event) => set('totp', event.target.value)}
            />
          )}
        </Field>
      ) : null}
      <Button type="submit" loading={busy} arrow full>
        {t('login')}
      </Button>
      <p className="text-center text-sm text-muted">
        {t('noAccount')}{' '}
        <Link href="/account/register" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
          {t('register')}
        </Link>
      </p>
    </form>
  )
}

/** Тіркелу: рөл(дер), құпия сөз саясаты, келісім (алдын ала қойылмайды), ALTCHA, honeypot */
export function RegisterForm() {
  const locale = useLocale() as Locale
  const t = useTranslations('account')
  const tf = useTranslations('forms')
  const tc = useTranslations('common')
  const captcha = useAltcha()
  const [values, setValues] = useState({ name: '', email: '', password: '', passwordConfirm: '', organization: '', country: '', phone: '' })
  const [roles, setRoles] = useState<string[]>([])
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [hp, setHp] = useState('')
  const [errors, setErrors] = useState<Record<string, AuthErrorCode>>({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = (name: keyof typeof values, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      const { [name]: _removed, ...rest } = previous
      return rest
    })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')
    const altcha = (await captcha.start().catch(() => '')) || 'pending'
    const payload = { ...values, roles, locale, consent, altcha, hp }
    const found = registerErrors(payload)
    if (!consent) setConsentError(true)
    setErrors(found)
    if (Object.keys(found).length > 0 || !consent) return
    setBusy(true)
    try {
      const response = await fetch('/api/portal/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(registerSchema.parse(payload)) })
      const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, AuthErrorCode> }
      if (response.status === 201) {
        setDone(true)
        return
      }
      captcha.reset()
      if (response.status === 400 && body.fields) setErrors(body.fields)
      else if (response.status === 409) setMessage(t('exists'))
      else if (response.status === 429) setMessage(tf('server.rateLimited'))
      else if (response.status === 403) setMessage(tf('captcha.failed'))
      else setMessage(tf('server.error'))
    } catch {
      captcha.reset()
      setMessage(tf('server.network'))
    }
    setBusy(false)
  }

  if (done) {
    return (
      <div role="status" className="grid justify-items-start gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-success-bg text-success">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <p className="t-body text-ink">{t('registered')}</p>
        <Button href="/account/login" arrow>
          {t('login')}
        </Button>
      </div>
    )
  }

  const err = (name: string) => (errors[name] ? tf(`err.${errors[name]}`) : undefined)

  return (
    <form noValidate onSubmit={submit} onFocusCapture={() => void captcha.start().catch(() => undefined)} className="grid gap-5">
      {message ? <Alert>{message}</Alert> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={t('name')} required error={err('name')} className="md:col-span-2">
          {(ids) => <Input {...ids} name="name" autoComplete="name" value={values.name} onChange={(event) => set('name', event.target.value)} />}
        </Field>
        <Field label={t('email')} required error={err('email')} className="md:col-span-2">
          {(ids) => <Input {...ids} type="email" name="email" autoComplete="email" value={values.email} onChange={(event) => set('email', event.target.value)} />}
        </Field>
        <Field label={t('password')} required hint={t('passwordHint')} error={err('password')}>
          {(ids) => <Input {...ids} type="password" name="password" autoComplete="new-password" value={values.password} onChange={(event) => set('password', event.target.value)} />}
        </Field>
        <Field label={t('passwordConfirm')} required error={err('passwordConfirm')}>
          {(ids) => (
            <Input {...ids} type="password" name="passwordConfirm" autoComplete="new-password" value={values.passwordConfirm} onChange={(event) => set('passwordConfirm', event.target.value)} />
          )}
        </Field>
        <fieldset className="md:col-span-2 grid gap-1">
          <legend className="mb-1 text-sm font-semibold text-navy-900">
            {t('rolesLabel')}
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
          </legend>
          <div className="grid md:grid-cols-3">
            {userRoles.map((role) => (
              <Checkbox
                key={role}
                label={userRoleLabels[role][locale]}
                checked={roles.includes(role)}
                aria-invalid={errors.roles ? true : undefined}
                onChange={(event) => {
                  setRoles((previous) => (event.target.checked ? [...previous, role] : previous.filter((value) => value !== role)))
                  setErrors((previous) => {
                    const { roles: _removed, ...rest } = previous
                    return rest
                  })
                }}
              />
            ))}
          </div>
          {errors.roles ? (
            <p role="alert" className="flex items-start gap-1.5 text-[13px] font-medium text-danger">
              <Icon name="alert" size={15} className="mt-px shrink-0" />
              {tf('err.required')}
            </p>
          ) : null}
        </fieldset>
        <Field label={t('organization')} optionalLabel={tc('optional')} error={err('organization')}>
          {(ids) => <Input {...ids} name="organization" autoComplete="organization" value={values.organization} onChange={(event) => set('organization', event.target.value)} />}
        </Field>
        <Field label={t('country')} optionalLabel={tc('optional')} error={err('country')}>
          {(ids) => <Input {...ids} name="country" autoComplete="country-name" value={values.country} onChange={(event) => set('country', event.target.value)} />}
        </Field>
        <Field label={t('phone')} optionalLabel={tc('optional')} error={err('phone')}>
          {(ids) => <Input {...ids} type="tel" name="phone" autoComplete="tel" value={values.phone} onChange={(event) => set('phone', event.target.value)} />}
        </Field>
      </div>
      <Checkbox
        label={
          <span>
            {tf('consent')}{' '}
            <Link href="/legal/consent" target="_blank" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
              {tf('consentLink')}
            </Link>
          </span>
        }
        checked={consent}
        error={consentError ? tf('err.required') : undefined}
        onChange={(event) => {
          setConsent(event.target.checked)
          if (event.target.checked) setConsentError(false)
        }}
      />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {tf('honeypot')}
          <input tabIndex={-1} autoComplete="off" name="company_website" value={hp} onChange={(event) => setHp(event.target.value)} />
        </label>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted" aria-live="polite">
        <Icon name={captcha.state === 'ready' ? 'check' : 'shield'} size={16} className={captcha.state === 'ready' ? 'text-success' : 'text-gold-700'} />
        {captcha.state === 'solving' ? tf('captcha.checking') : captcha.state === 'ready' ? tf('captcha.ok') : captcha.state === 'error' ? tf('captcha.failed') : ''}
      </p>
      <Button type="submit" loading={busy} arrow full>
        {t('register')}
      </Button>
      <p className="text-center text-sm text-muted">
        {t('haveAccount')}{' '}
        <Link href="/account/login" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
          {t('login')}
        </Link>
      </p>
    </form>
  )
}
