/**
 * Дерекқордағы контентте бос тіл өрісін іздейді: `npm run audit:content`.
 * Payload-та fallback өшірулі (fallback: false), сондықтан аудармасы жоқ өріс басқа тілде бос көрінеді.
 * Әр құжат пен global төрт тілде оқылады (fallbackLocale: false), қазақшада толтырылған, бірақ басқа тілде бос өріс тізімге шығады.
 * Тек оқиды, дерекқорды өзгертпейді. Шығу коды: бос өріс бар болса 1.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { defaultLocale, locales } from '@/i18n/config'

const collections = ['pages', 'news', 'events', 'services', 'partners', 'people', 'documents', 'albums', 'videos'] as const
const globals = ['home', 'settings'] as const

type Gap = { where: string; path: string; locale: string }

const filled = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim() !== ''
  return true
}

/** Қазақша жағындағы толтырылған жапырақ өрістерді басқа тілдегі сол жолмен салыстырады */
function compare(base: unknown, other: unknown, trail: string, where: string, locale: string, out: Gap[]) {
  if (Array.isArray(base)) {
    base.forEach((item, index) => compare(item, Array.isArray(other) ? other[index] : undefined, `${trail}[${index}]`, where, locale, out))
  } else if (base && typeof base === 'object') {
    for (const [key, child] of Object.entries(base as Record<string, unknown>)) {
      // Қызметтік өрістер салыстырылмайды
      if (['id', 'createdAt', 'updatedAt', 'blockType', 'blockName', '_status', 'slug', 'translationStatus'].includes(key)) continue
      compare(child, (other as Record<string, unknown> | null | undefined)?.[key], trail ? `${trail}.${key}` : key, where, locale, out)
    }
  } else if (typeof base === 'string' && filled(base) && !filled(other)) {
    out.push({ where, path: trail, locale })
  }
}

try {
  const payload = await getPayload({ config })
  const gaps: Gap[] = []
  let documents = 0

  for (const slug of collections) {
    const base = await payload.find({ collection: slug, locale: defaultLocale, fallbackLocale: false, depth: 0, limit: 500, overrideAccess: true, pagination: false })
    for (const locale of locales.filter((code) => code !== defaultLocale)) {
      const other = await payload.find({ collection: slug, locale, fallbackLocale: false, depth: 0, limit: 500, overrideAccess: true, pagination: false })
      const byId = new Map(other.docs.map((doc) => [doc.id, doc]))
      for (const doc of base.docs) {
        const label = `${slug}/${(doc as { slug?: string; id: number | string }).slug ?? doc.id}`
        compare(doc, byId.get(doc.id), '', label, locale, gaps)
      }
    }
    documents += base.docs.length
  }
  for (const slug of globals) {
    const base = await payload.findGlobal({ slug, locale: defaultLocale, fallbackLocale: false, depth: 0, overrideAccess: true })
    for (const locale of locales.filter((code) => code !== defaultLocale)) {
      const other = await payload.findGlobal({ slug, locale, fallbackLocale: false, depth: 0, overrideAccess: true })
      compare(base, other, '', `global/${slug}`, locale, gaps)
    }
    documents += 1
  }

  console.log(`[audit:content] ${documents} құжат/global тексерілді, ${locales.length - 1} тілде (kk-мен салыстырылды).`)
  if (gaps.length === 0) {
    console.log('[audit:content] бос не жетіспейтін тіл өрісі жоқ.')
  } else {
    for (const gap of gaps) console.log(`  ${gap.locale} | ${gap.where} | ${gap.path}`)
    console.log(`[audit:content] бос өріс: ${gaps.length}`)
    process.exitCode = 1
  }
} catch (error) {
  console.error('[audit:content] қате:', error instanceof Error ? error.message : String(error))
  process.exit(1)
}
