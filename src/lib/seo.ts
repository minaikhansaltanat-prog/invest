import type { Metadata } from 'next'

import { defaultLocale, type Locale, localeMeta, locales } from '@/i18n/config'

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** Тіл префиксімен толық жол: /kk/investors */
export const localizedPath = (locale: Locale, pathname: string) =>
  `/${locale}${pathname === '/' ? '' : pathname}`

/**
 * canonical және hreflang (kk, ru, en, zh-CN, x-default) әр бетке (ТТ 15).
 * pathname: тіл префиксісіз жол, мысалы '/investors'. x-default әдепкі тілге (kk) бағытталады.
 */
export function alternatesFor(locale: Locale, pathname: string): NonNullable<Metadata['alternates']> {
  const languages: Record<string, string> = {}
  for (const code of locales) languages[localeMeta[code].hreflang] = `${siteUrl()}${localizedPath(code, pathname)}`
  languages['x-default'] = `${siteUrl()}${localizedPath(defaultLocale, pathname)}`
  return { canonical: `${siteUrl()}${localizedPath(locale, pathname)}`, languages }
}
