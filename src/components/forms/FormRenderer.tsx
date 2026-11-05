'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type FormEvent, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field'
import { FormSteps } from '@/components/ui/FormSteps'
import { Icon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { type FieldErrorCode, type FieldSpec, type FormSpec, dataSchema, fieldErrors } from '@/lib/forms/definitions'

import { useAltcha } from './useAltcha'

type Value = string | string[] | boolean
type Values = Record<string, Value>

const initialValue = (field: FieldSpec): Value =>
  field.type === 'multiselect' ? [] : field.type === 'checkbox' ? false : ''

const inputMode = (field: FieldSpec) => (field.type === 'number' ? ('decimal' as const) : field.type === 'tel' ? ('tel' as const) : undefined)
const htmlType = (field: FieldSpec) => (field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.type === 'url' ? 'url' : 'text')

/**
 * Көп қадамды форма (ТТ 8.1, 9): сипаттамадан өрістер салынады, Zod-пен клиентте де тексеріледі (сервер қайта тексереді),
 * келісім чекбоксы алдын ала қойылмайды, ALTCHA фонда шешіледі, honeypot бар. Қате: өріс астында + жалпы жиынтық (role=alert).
 */
export function FormRenderer({ spec }: { spec: FormSpec }) {
  const locale = useLocale() as Locale
  const t = useTranslations('forms')
  const tc = useTranslations('common')
  const captcha = useAltcha()
  const formRef = useRef<HTMLFormElement>(null)

  const allFields = spec.steps.flatMap((step) => step.fields)
  const [values, setValues] = useState<Values>(() => Object.fromEntries(allFields.map((field) => [field.name, initialValue(field)])))
  const [errors, setErrors] = useState<Record<string, FieldErrorCode>>({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [hp, setHp] = useState('')
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [reference, setReference] = useState('')
  const [serverError, setServerError] = useState('')

  const current = spec.steps[step]
  const last = step === spec.steps.length - 1
  const errorText = (code: FieldErrorCode) => t(`err.${code}`)

  const set = (name: string, value: Value) => {
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => {
      if (!(name in previous)) return previous
      const { [name]: _removed, ...rest } = previous
      return rest
    })
  }

  const validate = (names: string[]) => {
    const parsed = dataSchema(spec).safeParse(values)
    const all = parsed.success ? {} : fieldErrors(parsed.error)
    const relevant = Object.fromEntries(Object.entries(all).filter(([key]) => names.includes(key)))
    setErrors(relevant)
    if (Object.keys(relevant).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    }
    return Object.keys(relevant).length === 0
  }

  const goNext = () => {
    if (validate(current.fields.map((field) => field.name))) {
      setStep((value) => value + 1)
      requestAnimationFrame(() => formRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!last) return goNext()
    setServerError('')
    const valid = validate(allFields.map((field) => field.name))
    if (!consent) setConsentError(true)
    if (!valid || !consent) return
    setConsentError(false)
    setPhase('submitting')
    try {
      const altcha = await captcha.start()
      const response = await fetch(`/api/portal/forms/${spec.kind}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: values, consent: true, altcha, locale, hp }),
      })
      const body = (await response.json().catch(() => ({}))) as { reference?: string; error?: string; fields?: Record<string, FieldErrorCode> }
      if (response.status === 201 && body.reference) {
        setReference(body.reference)
        setPhase('success')
        return
      }
      captcha.reset()
      if (response.status === 400 && body.fields) {
        setErrors(body.fields)
        const firstStep = spec.steps.findIndex((item) => item.fields.some((field) => field.name in body.fields!))
        if (firstStep >= 0) setStep(firstStep)
      } else if (response.status === 429) setServerError(t('server.rateLimited'))
      else if (response.status === 403) setServerError(t('captcha.failed'))
      else setServerError(t('server.error'))
    } catch {
      captcha.reset()
      setServerError(t('server.network'))
    }
    setPhase('idle')
  }

  if (phase === 'success') {
    return (
      <div role="status" className="grid justify-items-start gap-4 rounded-block border border-gold-500/40 bg-paper p-7 shadow-card lg:p-9">
        <span className="grid size-14 place-items-center rounded-full bg-success-bg text-success">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <h3 className="t-h3 text-navy-900">{t('success.title')}</h3>
        <p className="t-body max-w-[560px] text-muted">{t('success.text')}</p>
        <p className="grid gap-1 rounded-card border border-line bg-ivory px-5 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold-700">{t('success.reference')}</span>
          <span data-testid="submission-reference" className="lining font-mono text-lg font-semibold text-navy-900">
            {reference}
          </span>
        </p>
        <Button
          variant="line"
          onClick={() => {
            setValues(Object.fromEntries(allFields.map((field) => [field.name, initialValue(field)])))
            setErrors({})
            setConsent(false)
            setStep(0)
            setPhase('idle')
          }}
        >
          {t('success.another')}
        </Button>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      onFocusCapture={() => void captcha.start().catch(() => undefined)}
      aria-label={spec.title[locale]}
      className="grid scroll-mt-28 gap-7 rounded-block border border-line bg-paper p-6 shadow-card lg:p-9"
    >
      {spec.steps.length > 1 ? (
        <div className="grid gap-3">
          <FormSteps steps={spec.steps.map((item) => item.title[locale])} current={step} label={t('stepsLabel')} />
          <p className="text-sm text-muted">{t('stepOf', { current: step + 1, total: spec.steps.length })}</p>
        </div>
      ) : null}

      {errorCount > 0 ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-card border border-danger/40 bg-danger-bg px-4 py-3 text-sm font-medium text-danger">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
          {t('errorSummary', { count: errorCount })}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {current.fields.map((field) => {
          const label = field.label[locale]
          const hint = field.hint?.[locale]
          const error = errors[field.name] ? errorText(errors[field.name]) : undefined
          const wide = field.type === 'textarea' || field.type === 'multiselect' || field.type === 'checkbox'

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className="md:col-span-2">
                <Checkbox
                  label={label}
                  error={error}
                  checked={Boolean(values[field.name])}
                  onChange={(event) => set(field.name, event.target.checked)}
                />
              </div>
            )
          }

          if (field.type === 'multiselect') {
            const selected = (values[field.name] as string[]) ?? []
            return (
              <fieldset key={field.name} className="md:col-span-2 grid gap-2.5" aria-describedby={error ? `${field.name}-error` : undefined}>
                <legend className="mb-1 text-sm font-semibold text-navy-900">
                  {label}
                  {field.required ? (
                    <span aria-hidden="true" className="ml-1 text-danger">
                      *
                    </span>
                  ) : (
                    <span className="ml-2 text-xs font-normal text-muted">{tc('optional')}</span>
                  )}
                </legend>
                <div className="grid gap-x-6 md:grid-cols-2">
                  {(field.options ?? []).map((option) => (
                    <Checkbox
                      key={option.value}
                      label={option.label[locale]}
                      checked={selected.includes(option.value)}
                      aria-invalid={error ? true : undefined}
                      onChange={(event) =>
                        set(field.name, event.target.checked ? [...selected, option.value] : selected.filter((value) => value !== option.value))
                      }
                    />
                  ))}
                </div>
                {error ? (
                  <p id={`${field.name}-error`} role="alert" className="flex items-start gap-1.5 text-[13px] font-medium text-danger">
                    <Icon name="alert" size={15} className="mt-px shrink-0" />
                    {error}
                  </p>
                ) : null}
              </fieldset>
            )
          }

          return (
            <Field
              key={field.name}
              className={wide ? 'md:col-span-2' : undefined}
              label={label}
              hint={hint}
              error={error}
              required={field.required}
              optionalLabel={tc('optional')}
            >
              {(ids) =>
                field.type === 'textarea' ? (
                  <Textarea
                    {...ids}
                    name={field.name}
                    value={(values[field.name] as string) ?? ''}
                    maxLength={field.maxLength}
                    onChange={(event) => set(field.name, event.target.value)}
                  />
                ) : field.type === 'select' ? (
                  <Select {...ids} name={field.name} value={(values[field.name] as string) ?? ''} onChange={(event) => set(field.name, event.target.value)}>
                    <option value="">{t('select')}</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label[locale]}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    {...ids}
                    name={field.name}
                    type={htmlType(field)}
                    inputMode={inputMode(field)}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    value={(values[field.name] as string) ?? ''}
                    onChange={(event) => set(field.name, event.target.value)}
                  />
                )
              }
            </Field>
          )
        })}
      </div>

      {last ? (
        <div className="grid gap-3 border-t border-line pt-6">
          <Checkbox
            label={
              <span>
                {t('consent')}{' '}
                <Link href="/legal/consent" target="_blank" className="font-semibold text-navy-700 underline underline-offset-4 hover:text-navy-900">
                  {t('consentLink')}
                </Link>
              </span>
            }
            checked={consent}
            error={consentError ? t('err.required') : undefined}
            onChange={(event) => {
              setConsent(event.target.checked)
              if (event.target.checked) setConsentError(false)
            }}
          />
          {/* honeypot: адам көрмейді және толтырмайды, бот толтырады */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              {t('honeypot')}
              <input tabIndex={-1} autoComplete="off" name="company_website" value={hp} onChange={(event) => setHp(event.target.value)} />
            </label>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted" aria-live="polite">
            <Icon name={captcha.state === 'ready' ? 'check' : 'shield'} size={16} className={captcha.state === 'ready' ? 'text-success' : 'text-gold-700'} />
            {captcha.state === 'solving'
              ? t('captcha.checking')
              : captcha.state === 'ready'
                ? t('captcha.ok')
                : captcha.state === 'error'
                  ? t('captcha.failed')
                  : ''}
          </p>
        </div>
      ) : null}

      {serverError ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-card border border-danger/40 bg-danger-bg px-4 py-3 text-sm font-medium text-danger">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <Button variant="line" onClick={() => setStep((value) => value - 1)} className="max-md:w-full">
            {t('back')}
          </Button>
        ) : null}
        <Button type="submit" loading={phase === 'submitting'} arrow className="max-md:w-full">
          {phase === 'submitting' ? t('submitting') : last ? t('submit') : t('next')}
        </Button>
      </div>
    </form>
  )
}
