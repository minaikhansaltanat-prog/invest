'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Checkbox, Field, Input } from '@/components/ui/Field'
import { Icon } from '@/components/ui/icons'
import { useRouter } from '@/i18n/navigation'

/** NDA электрондық акцепті (ТТ 8.6): чекбокс + 2FA коды (OTP). Сәтті болса, бетті жаңартады да, деректер бөлмесі ашылады */
export function NdaSignForm({ projectId }: { projectId: number | string }) {
  const t = useTranslations('dataroom')
  const ta = useTranslations('account')
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const sign = async () => {
    setError('')
    if (!accepted) return setError(t('accept'))
    setBusy(true)
    const response = await fetch('/api/portal/nda', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId, accept: true, code }),
    }).catch(() => null)
    setBusy(false)
    if (response?.ok) {
      router.refresh()
      return
    }
    setError(response?.status === 401 ? t('invalidCode') : t('denied'))
  }

  return (
    <div className="grid gap-4">
      <h3 className="t-h3 text-white">{t('signTitle')}</h3>
      <p className="text-base leading-[1.65] text-white/70">{t('signText')}</p>
      <div className="rounded-card bg-paper px-4 py-3 text-ink">
        <Checkbox label={t('accept')} checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
      </div>
      <Field label={ta('totpCode')} required>
        {(ids) => <Input {...ids} name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(event) => setCode(event.target.value)} />}
      </Field>
      {error ? (
        <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-white">
          <Icon name="alert" size={16} className="mt-px shrink-0 text-gold-300" />
          {error}
        </p>
      ) : null}
      <Button onClick={sign} loading={busy} full>
        {t('sign')}
      </Button>
    </div>
  )
}

type FileItem = { id: number; title: string; category: string; mimeType?: string }

/**
 * Деректер бөлмесінің көрсеткіші (ТТ 8.6): тек қарау. Файл `/api/portal/dataroom/file/<id>` арқылы келеді (су белгісі суретке басылады),
 * PDF үстінде де жеке су белгісі қабаты (аты | күні) қайталанып тұрады; баспаға шығару CSS-пен жасырылады.
 */
export function DataroomViewer({ files, watermark }: { files: FileItem[]; watermark: string }) {
  const t = useTranslations('dataroom')
  const [current, setCurrent] = useState<FileItem | null>(files[0] ?? null)

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] print:hidden">
      <ul className="grid content-start gap-2" aria-label={t('filesTitle')}>
        {files.map((file) => (
          <li key={file.id}>
            <button
              type="button"
              onClick={() => setCurrent(file)}
              aria-pressed={current?.id === file.id}
              className={
                'flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-card border px-4 py-3 text-left text-base font-semibold transition-[background-color,border-color,transform] duration-200 active:scale-[0.99] ' +
                (current?.id === file.id ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-paper text-navy-900 hover:border-navy-700')
              }
            >
              <Icon name="document" size={18} className={current?.id === file.id ? 'text-gold-300' : 'text-gold-700'} />
              {file.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-h-[480px] overflow-hidden rounded-block border border-line bg-paper shadow-card">
        {current ? (
          <>
            {current.mimeType?.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/portal/dataroom/file/${current.id}`} alt={current.title} className="block w-full select-none" draggable={false} />
            ) : (
              <iframe title={current.title} src={`/api/portal/dataroom/file/${current.id}#toolbar=0&navpanes=0`} className="block h-[70vh] w-full" />
            )}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid select-none grid-cols-2 content-around gap-y-16 overflow-hidden opacity-30 lg:grid-cols-3">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index} className="-rotate-[24deg] whitespace-nowrap text-center text-lg font-bold text-navy-900">
                  {watermark}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="grid h-full min-h-[480px] place-items-center p-8 text-muted">{t('selectFile')}</p>
        )}
      </div>
    </div>
  )
}
