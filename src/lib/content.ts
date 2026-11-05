import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import { isVisibleInLocale, type TranslationPolicy, type TranslationStatusMap } from '@/fields/translationStatus'
import type {
  Album,
  Document as DocumentDoc,
  Event as EventDoc,
  Home,
  KpiTarget,
  News,
  Page,
  Partner,
  Person,
  Project,
  ScoringConfig,
  Service,
  Setting,
  Video,
} from '@/payload-types'

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


/** Іздеу нәтижесі: жазба бар ма (doc) және осы тілде көрсетілуі тиіс пе (visible). doc бар, visible жоқ болса, аударма жоқ деген сөз. */
export type Lookup<T> = { doc: T | null; visible: boolean }

async function toLookup<T extends { translationStatus?: unknown }>(
  doc: T | undefined,
  locale: Locale,
  hasText: (doc: T) => boolean,
): Promise<Lookup<T>> {
  if (!doc) return { doc: null, visible: false }
  const policy = await getTranslationPolicy(locale)
  const visibleDoc = isVisibleInLocale(doc.translationStatus as TranslationStatusMap, locale, policy) && hasText(doc)
  return { doc, visible: visibleDoc }
}

export const lookupPage = cache(async (locale: Locale, path: string): Promise<Lookup<Page>> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'pages', where: { path: { equals: path } }, limit: 1, depth: 0, ...common(locale) })
  return toLookup(docs[0], locale, (page) => Boolean(page.title))
})

export const lookupService = cache(async (locale: Locale, slug: string): Promise<Lookup<Service>> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1, depth: 0, ...common(locale) })
  return toLookup(docs[0], locale, (service) => Boolean(service.title))
})

export const lookupProject = cache(async (locale: Locale, slug: string): Promise<Lookup<Project>> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...common(locale) })
  return toLookup(docs[0], locale, (project) => Boolean(project.title))
})

export const lookupNews = cache(async (locale: Locale, slug: string): Promise<Lookup<News>> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'news', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...common(locale) })
  return toLookup(docs[0], locale, (item) => Boolean(item.title))
})

export const lookupAlbum = cache(async (locale: Locale, slug: string): Promise<Lookup<Album>> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'albums', where: { slug: { equals: slug } }, limit: 1, depth: 1, ...common(locale) })
  return toLookup(docs[0], locale, (album) => Boolean(album.title))
})

/** Тізімдер: тек осы тілде көрінетін және атауы бар жазбалар */
export const getAllCatalogProjects = cache(async (locale: Locale): Promise<Project[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'projects', sort: 'createdAt', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((project) => project.title)
})

export const getNewsList = cache(async (locale: Locale): Promise<News[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'news', sort: '-publishedAt', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export const getEvents = cache(async (locale: Locale): Promise<EventDoc[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'events', sort: 'startsAt', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export const getVideos = cache(async (locale: Locale): Promise<Video[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'videos', sort: '-publishedAt', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export const getAlbums = cache(async (locale: Locale): Promise<Album[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'albums', sort: '-publishedAt', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export const getPartners = cache(async (locale: Locale): Promise<Partner[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'partners', sort: 'order', limit: 200, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.name)
})

export const getDocuments = cache(async (locale: Locale): Promise<DocumentDoc[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'documents', sort: '-publishedAt', limit: 200, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.title)
})

export const getPeople = cache(async (locale: Locale): Promise<Person[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'people', sort: 'order', limit: 100, depth: 1, ...common(locale) })
  return (await visible(docs, locale)).filter((item) => item.name)
})

export type { Person }
