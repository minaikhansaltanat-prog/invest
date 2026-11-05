'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { Icon } from '@/components/ui/icons'
import { useRouter } from '@/i18n/navigation'

const post = (url: string, body?: unknown) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })

/** Шығу: Payload сессиясы мен 2FA белгісі (cookie) екеуі де тазаланады */
export function LogoutButton({ collection }: { collection: 'users' | 'admins' }) {
  const t = useTranslations('account.dashboard')
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return (
    <Button
      variant="line"
      loading={busy}
      onClick={async () => {
        setBusy(true)
        await post(`/api/${collection}/logout`).catch(() => undefined)
        await post('/api/portal/logout').catch(() => undefined)
        router.push('/account/login')
        router.refresh()
      }}
    >
      {t('logout')}
    </Button>
  )
}

/** Дербес деректер (ТТ 9, 14.2): JSON жүктеп алу және аккаунтты жоюға сұраныс */
export function DataActions({ deletionRequested }: { deletionRequested: boolean }) {
  const t = useTranslations('account.dashboard')
  const [sent, setSent] = useState(deletionRequested)
  const [busy, setBusy] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="line"
        onClick={async () => {
          const response = await fetch('/api/portal/account', { cache: 'no-store' }).catch(() => null)
          if (!response?.ok) return
          const url = URL.createObjectURL(await response.blob())
          const link = document.createElement('a')
          link.href = url
          link.download = 'kfca-my-data.json'
          link.click()
          URL.revokeObjectURL(url)
        }}
      >
        {t('export')}
      </Button>
      {sent ? (
        <p role="status" className="inline-flex items-center gap-2 text-sm font-medium text-success">
          <Icon name="check" size={16} />
          {t('deleteSent')}
        </p>
      ) : (
        <Button
          variant="line"
          loading={busy}
          onClick={async () => {
            if (!window.confirm(t('deleteConfirm'))) return
            setBusy(true)
            const response = await fetch('/api/portal/account', { method: 'DELETE' }).catch(() => null)
            setBusy(false)
            if (response?.ok) setSent(true)
          }}
        >
          {t('deleteRequest')}
        </Button>
      )}
    </div>
  )
}

type Status = { enabled: boolean; verified: boolean; collection: 'users' | 'admins'; required: boolean }

/**
 * 2FA басқару панелі (ТТ 9, 14.1): қосу (кілт көрсету + бірінші кодты растау), сессияда растау, өшіру.
 * `next` бар және код расталса, пайдаланушы сол бетке (мысалы, /admin) өтеді.
 */
export function TwoFactorPanel({ initial, next }: { initial: Status; next?: string }) {
  const t = useTranslations('account.twofa')
  const router = useRouter()
  const [status, setStatus] = useState(initial)
  const [secret, setSecret] = useState<{ secret: string; uri: string } | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const call = async (action: string, extra: Record<string, unknown> = {}) => {
    setBusy(true)
    setError('')
    const response = await post('/api/portal/2fa', { action, ...extra }).catch(() => null)
    setBusy(false)
    return response
  }

  const finish = () => {
    setCode('')
    setSecret(null)
    if (next && (next.startsWith('/admin') || next.startsWith('/account'))) window.location.assign(next)
    else router.refresh()
  }

  const enable = async () => {
    const response = await call('enroll')
    if (response?.ok) setSecret((await response.json()) as { secret: string; uri: string })
    else setError(t('invalid'))
  }
  const confirm = async () => {
    const response = await call('confirm', { code })
    if (response?.ok) {
      setStatus({ ...status, enabled: true, verified: true })
      finish()
    } else setError(t('invalid'))
  }
  const verify = async () => {
    const response = await call('verify', { code })
    if (response?.ok) {
      setStatus({ ...status, verified: true })
      finish()
    } else setError(t('invalid'))
  }
  const disable = async () => {
    const response = await call('disable', { code })
    if (response?.ok) {
      setStatus({ ...status, enabled: false, verified: false })
      setCode('')
      router.refresh()
    } else setError(t('invalid'))
  }

  return (
    <section aria-labelledby="twofa-title" className="grid gap-5 rounded-block border border-line bg-paper p-6 shadow-card lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="twofa-title" className="t-h3 text-navy-900">
          {t('title')}
        </h2>
        <span
          data-testid="twofa-state"
          className={status.enabled ? 'inline-flex items-center gap-2 rounded-full bg-success-bg px-3.5 py-1.5 text-sm font-semibold text-success' : 'inline-flex items-center gap-2 rounded-full bg-sand px-3.5 py-1.5 text-sm font-semibold text-gold-700'}
        >
          <Icon name={status.enabled ? 'check' : 'lock'} size={15} />
          {status.enabled ? (status.verified ? `${t('enabled')} · ${t('verified')}` : `${t('enabled')} · ${t('notVerified')}`) : t('disabled')}
        </span>
      </div>
      <p className="t-body max-w-[640px] text-muted">{t('intro')}</p>
      {status.required ? <p className="text-sm font-semibold text-gold-700">{t('requiredAdmin')}</p> : <p className="text-sm text-muted">{t('requiredDataroom')}</p>}

      {error ? (
        <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-danger">
          <Icon name="alert" size={16} className="mt-px shrink-0" />
          {error}
        </p>
      ) : null}

      {!status.enabled && !secret ? (
        <div>
          <Button onClick={enable} loading={busy}>
            {t('enable')}
          </Button>
        </div>
      ) : null}

      {secret ? (
        <div className="grid max-w-[560px] gap-4">
          <div className="grid gap-1.5 rounded-card border border-line bg-ivory p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold-700">{t('secretLabel')}</span>
            <code data-testid="twofa-secret" className="lining break-all font-mono text-lg font-semibold tracking-wider text-navy-900">
              {secret.secret}
            </code>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gold-700">{t('uriLabel')}</span>
            <code className="break-all font-mono text-xs text-muted">{secret.uri}</code>
            <Button
              variant="line"
              className="mt-1 w-fit"
              onClick={async () => {
                await navigator.clipboard.writeText(secret.secret).catch(() => undefined)
                setCopied(true)
              }}
            >
              {copied ? t('copied') : t('copy')}
            </Button>
          </div>
          <Field label={t('confirmCode')} required>
            {(ids) => <Input {...ids} name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} />}
          </Field>
          <div>
            <Button onClick={confirm} loading={busy}>
              {t('confirm')}
            </Button>
          </div>
        </div>
      ) : null}

      {status.enabled && !status.verified ? (
        <div className="grid max-w-[420px] gap-4">
          <Field label={t('verifyTitle')} required>
            {(ids) => <Input {...ids} name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} />}
          </Field>
          <div>
            <Button onClick={verify} loading={busy}>
              {t('verify')}
            </Button>
          </div>
        </div>
      ) : null}

      {status.enabled && status.verified && !secret ? (
        <div className="grid max-w-[420px] gap-3 border-t border-line pt-5">
          <p className="text-sm text-muted">{t('disableHelp')}</p>
          <Input name="code" aria-label={t('verifyTitle')} inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} />
          <div>
            <Button variant="line" onClick={disable} loading={busy}>
              {t('disable')}
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
