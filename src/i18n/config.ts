// Тілдер конфигурациясы. Жаңа локаль (kk-Latn, ar) осы жерге қосылады, басқа код өзгермейді (ТТ 11.1).

export const locales = ['kk', 'ru', 'en', 'zh'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'kk'

export type LocaleMeta = {
  /** Ауыстырғышта көрсетілетін қысқа белгі */
  short: string
  /** Толық атауы (өз тілінде) */
  label: string
  /** <html lang> */
  htmlLang: string
  /** hreflang мәні */
  hreflang: string
  /** Open Graph locale */
  ogLocale: string
  dir: 'ltr' | 'rtl'
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  kk: { short: 'ҚАЗ', label: 'Қазақша', htmlLang: 'kk', hreflang: 'kk', ogLocale: 'kk_KZ', dir: 'ltr' },
  ru: { short: 'РУС', label: 'Русский', htmlLang: 'ru', hreflang: 'ru', ogLocale: 'ru_RU', dir: 'ltr' },
  en: { short: 'ENG', label: 'English', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', dir: 'ltr' },
  zh: { short: '中文', label: '中文', htmlLang: 'zh-CN', hreflang: 'zh-CN', ogLocale: 'zh_CN', dir: 'ltr' },
}

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value)
