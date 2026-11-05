import type { Locale } from '@/i18n/config'

const intlLocale: Record<Locale, string> = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-GB', zh: 'zh-CN' }
const timeZone = 'Asia/Almaty'

/**
 * Күн форматы тілге сай (ТТ 11.3): «28 қазан 2026», «28 октября 2026», «28 October 2026», «2026年10月28日».
 * Қазақ тілінің Intl форматы жылдан басталатындықтан («2026 ж. 28 қазан»), бөліктер қолмен күн-ай-жыл ретімен құрылады.
 */
export function formatDate(value: string | Date, locale: Locale): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (locale === 'zh') {
    return new Intl.DateTimeFormat(intlLocale.zh, { year: 'numeric', month: 'long', day: 'numeric', timeZone }).format(date)
  }
  const parts = new Intl.DateTimeFormat(intlLocale[locale], {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('day')} ${part('month')} ${part('year')}`
}

/** Бос мәнді қауіпсіз жолға айналдырады */
export const str = (value: string | null | undefined): string => value ?? ''
