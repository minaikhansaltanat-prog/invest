'use client'

import { useField, useLocale, useTranslation } from '@payloadcms/ui'

const labels: Record<string, string> = {
  kk: 'Аударма жоқ',
  ru: 'Перевода нет',
  en: 'No translation',
  zh: '暂无翻译',
}

/**
 * Әкімшілік панелінде тілге бөлінген өріс осы тілде бос болса, «аударма жоқ» белгісін көрсетеді (NIGHT_TASK 3.4).
 * Қазақша мәтін fallback болмайды: бос өріс бос күйінде көрінеді және осы белгімен ерекшеленеді.
 * Әдепкі тілде (kk) белгі көрсетілмейді.
 */
export function TranslationMissing({ path }: { path?: string }) {
  const locale = useLocale()
  const { i18n } = useTranslation()
  const { value } = useField<unknown>({ path: path ?? '' })

  if (!path || !locale || locale.code === 'kk') return null
  const empty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
  if (!empty) return null

  return (
    <span
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        padding: '2px 10px',
        borderRadius: 999,
        background: '#FBF6EA',
        border: '1px solid #EADBB5',
        color: '#6B5320',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, background: '#C49A3C' }} />
      {labels[i18n.language] ?? labels.en} ({locale.code.toUpperCase()})
    </span>
  )
}
