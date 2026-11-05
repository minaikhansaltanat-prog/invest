import config from '@payload-config'
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { isVisibleInLocale, type TranslationStatusMap } from '@/fields/translationStatus'
import { type Locale, localeMeta, locales } from '@/i18n/config'
import { getTranslationPolicy } from '@/lib/content'
import { isCorporate, isPathVisible } from '@/lib/mode'
import { localizedPath } from '@/lib/seo'

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

// Іздеу жүйелеріне арналған карта (ТТ 15): барлық ашық бет пен жазба, әр тіл бөлек URL және hreflang баламалары.
// Тек осы тілде көрінетін (аудармасы бекітілген немесе саясат бойынша жобалама) нұсқалар кіреді; жарияланбаған және тексерілмеген жоба кірмейді.
export const dynamic = 'force-dynamic'

type Item = { path: string; updatedAt?: string; status?: unknown }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const policy = await getTranslationPolicy('kk')
  const base = siteUrl()
  const find = async (collection: 'pages' | 'services' | 'news' | 'projects', prefix: string, field: 'path' | 'slug'): Promise<Item[]> => {
    const { docs } = await payload.find({ collection, limit: 2000, depth: 0, overrideAccess: false, pagination: false })
    return docs.map((doc) => {
      const raw = (doc as unknown as Record<string, unknown>)[field] as string
      return { path: field === 'path' ? raw : `${prefix}/${raw}`, updatedAt: doc.updatedAt, status: (doc as { translationStatus?: unknown }).translationStatus }
    })
  }

  const items: Item[] = [
    { path: '/', status: { kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' } },
    ...(await find('pages', '', 'path')),
    ...(await find('services', '/services', 'slug')),
    ...(await find('news', '/media/news', 'slug')),
    // Corporate режимінде жобалар каталогы жоқ: жобалар да, инвестор беттері де картаға кірмейді
    ...(isCorporate() ? [] : await find('projects', '/projects', 'slug')),
  ].filter((item) => isPathVisible(item.path))

  return items.flatMap((item) => {
    const visible = locales.filter((locale) => isVisibleInLocale(item.status as TranslationStatusMap, locale, policy))
    const languages = Object.fromEntries(visible.map((locale) => [localeMeta[locale].hreflang, `${base}${localizedPath(locale, item.path)}`]))
    return visible.map((locale: Locale) => ({
      url: `${base}${localizedPath(locale, item.path)}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: item.path === '/' ? 1 : 0.7,
      alternates: { languages },
    }))
  })
}
