import type { GroupField, SelectField } from 'payload'

import { defaultLocale, type Locale, locales } from '@/i18n/config'
import { type L4, l } from '@/lib/labels'

// Әр контент бірлігінің тіл бойынша мәртебесі (ТТ 11.2): жоқ / жобалама / тексеруде / бекітілді.
export const translationStatuses = ['none', 'draft', 'review', 'approved'] as const
export type TranslationStatus = (typeof translationStatuses)[number]

const statusLabels: Record<TranslationStatus, L4> = {
  none: l('Аударма жоқ', 'Перевода нет', 'No translation', '暂无翻译'),
  draft: l('Жобалама', 'Черновик', 'Draft', '草稿'),
  review: l('Тексеруде', 'На проверке', 'In review', '审核中'),
  approved: l('Бекітілді', 'Утверждён', 'Approved', '已批准'),
}

export type TranslationStatusMap = Partial<Record<Locale, TranslationStatus | null>>

/** Бет/жазба бойынша 4 тілдің мәртебесін сақтайтын топ өрісі (бүйір панельде) */
export const translationStatusField = (
  initial: Partial<Record<Locale, TranslationStatus>> = {},
): GroupField => ({
  name: 'translationStatus',
  type: 'group',
  label: l('Аударма мәртебесі', 'Статус перевода', 'Translation status', '翻译状态'),
  admin: {
    position: 'sidebar',
    description: l(
      'Мәртебесі «бекітілді» (немесе саясатқа сай «жобалама») емес тілде жазба көрсетілмейді. Қазақша мәтін басқа тілде fallback болмайды.',
      'Запись не показывается на языке, где статус не «утверждён» (или «черновик» по политике). Казахский текст не подставляется на другие языки.',
      'A record is hidden in a language unless its status is approved (or draft, per policy). Kazakh text is never used as a fallback.',
      '该语言的状态不是“已批准”（或按策略为“草稿”）时，记录将被隐藏。哈萨克语文本不会作为其他语言的备用内容。',
    ),
  },
  fields: locales.map(
    (code): SelectField => ({
      name: code,
      type: 'select',
      label: code.toUpperCase(),
      defaultValue: initial[code] ?? (code === defaultLocale ? 'draft' : 'none'),
      options: translationStatuses.map((value) => ({ value, label: statusLabels[value] })),
    }),
  ),
})

export type TranslationPolicy = 'allow-draft' | 'approved-only'

/**
 * Жазба көрсетілген тілде жария көрінуі тиіс пе?
 * - none және бос мәртебе: ешқашан көрінбейді
 * - draft: тек саясат `allow-draft` болғанда (іске қосуға дейін)
 * - review: тек саясат `allow-draft` болғанда
 * - approved: әрқашан
 */
export function isVisibleInLocale(
  status: TranslationStatusMap | null | undefined,
  locale: Locale,
  policy: TranslationPolicy = 'allow-draft',
): boolean {
  const value = status?.[locale]
  if (!value || value === 'none') return false
  if (value === 'approved') return true
  return policy === 'allow-draft'
}
