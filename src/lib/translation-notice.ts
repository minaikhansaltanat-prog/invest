import type { Locale } from '@/i18n/config'
import { localizedPath } from '@/lib/seo'

// Тіл ауыстырғанда бетте аударма болмаса: қолданушы бөлімнің басты бетіне бағытталады және хабарлама көрсетіледі.
// Таза функциялар (сервер де, клиент те қолданады). Бағыттау өзі translation-redirect.ts ішінде.

export const NOTICE_PARAM = 'notice'
export const NOTICE_NO_TRANSLATION = 'no-translation'

/** '/news/abc' → '/news', '/investors/projects/abc' → '/investors/projects', '/news' немесе '/' → '/' */
export function sectionPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  parts.pop()
  return parts.length ? `/${parts.join('/')}` : '/'
}

/** Аудармасы жоқ бет үшін бағыттау URL-ы: тіл префиксі + бөлім + ?notice=no-translation */
export function missingTranslationUrl(locale: Locale, pathname: string): string {
  return `${localizedPath(locale, sectionPath(pathname))}?${NOTICE_PARAM}=${NOTICE_NO_TRANSLATION}`
}
