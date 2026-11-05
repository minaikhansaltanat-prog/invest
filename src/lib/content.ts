import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import { isVisibleInLocale, type TranslationPolicy, type TranslationStatusMap } from '@/fields/translationStatus'
import type { Home, KpiTarget, News, Person, Project, ScoringConfig, Service, Setting } from '@/payload-types'

/**
 * Сайттың деректер қабаты (серверлік). Барлық сұрау:
 *  - `overrideAccess: false`: жария API-мен бірдей рұқсат ережесі (жарияланбаған, тексерілмеген жоба шықпайды);
 *  - `fallbackLocale: false`: аударма жоқ жерде қазақша мәтін көрінбейді (ТТ 11.2);
 *  - аудармасы көрінбейтін жазба тізімнен алынып тасталады (isVisibleInLocale).
 */

const common = (locale: Locale) => ({ locale, fallbackLocale: false as const, overrideAccess: false })

const payloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async (locale: Locale): Promise<Setting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 1, ...common(locale) })
})

export async function getTranslationPolicy(locale: Locale): Promise<TranslationPolicy> {
  const settings = await getSettings(locale)
  return settings.policy?.translationPolicy ?? 'allow-draft'
}

export const getHome = cache(async (locale: Locale): Promise<Home | null> => {
  const payload = await payloadClient()
  const [home, policy] = await Promise.all([
    payload.findGlobal({ slug: 'home', depth: 2, ...common(locale) }),
    getTranslationPolicy(locale),
  ])
  return isVisibleInLocale(home.translationStatus as TranslationStatusMap, locale, policy) ? home : null
})

export const getKpiTargets = cache(async (locale: Locale): Promise<KpiTarget> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'kpiTargets', depth: 0, ...common(locale) })
})

export const getScoringConfig = cache(async (locale: Locale): Promise<ScoringConfig> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'scoringConfig', depth: 0, ...common(locale) })
})

const visible = async <T extends { translationStatus?: unknown }>(docs: T[], locale: Locale) => {
  const policy = await getTranslationPolicy(locale)
  return docs.filter((doc) => isVisibleInLocale(doc.translationStatus as TranslationStatusMap, locale, policy))
}

export const getServices = cache(async (locale: Locale): Promise<Service[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    sort: 'number',
    limit: 50,
    depth: 0,
    pagination: false,
    ...common(locale),
  })
  return (await visible(docs, locale)).filter((service) => service.title && service.summary)
})

/** Ашық каталог жобалары: рұқсат функциясы өзі тек 2-3 деңгейлі және жариялауға рұқсат берілгенін береді */
export const getCatalogProjects = cache(async (locale: Locale, limit = 3): Promise<Project[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    sort: 'createdAt',
    limit,
    depth: 1,
    ...common(locale),
  })
  return (await visible(docs, locale)).filter((project) => project.title)
})

export const getLatestNews = cache(async (locale: Locale, limit = 4): Promise<News[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    limit,
    depth: 1,
    ...common(locale),
  })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export type { Person }
