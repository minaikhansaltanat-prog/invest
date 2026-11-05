import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { FormRenderer } from '@/components/forms/FormRenderer'
import { Blocks, tocItems } from '@/components/page/Blocks'
import { CtaBand } from '@/components/page/CtaBand'
import { breadcrumbSchema, JsonLd } from '@/components/page/JsonLd'
import { AlbumBody, NewsBody, ProjectBody } from '@/components/page/details'
import {
  AlbumsList,
  DocumentsList,
  EventsList,
  NewsList,
  PartnersList,
  PeopleList,
  ProjectsCatalog,
  ServicesList,
  VideosList,
} from '@/components/page/lists'
import { type Crumb, PageHero } from '@/components/page/PageHero'
import { PageToc } from '@/components/page/PageToc'
import { formatDate } from '@/lib/format'
import type { Locale } from '@/i18n/config'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { lookupAlbum, lookupNews, lookupPage, lookupProject, lookupService } from '@/lib/content'
import { contactForm, type FormSpec, investorForm, membershipForm, projectForm } from '@/lib/forms/definitions'
import { isPathVisible } from '@/lib/mode'
import { accessStateFor } from '@/lib/portal/dataroom'
import { alternatesFor } from '@/lib/seo'
import { redirectMissingTranslation } from '@/lib/translation-redirect'
import type { Album, News, Page, Project, Service } from '@/payload-types'

type Props = {
  params: Promise<{ locale: string; slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type Resolved =
  | { kind: 'page'; path: string; doc: Page }
  | { kind: 'service'; path: string; doc: Service }
  | { kind: 'project'; path: string; doc: Project }
  | { kind: 'news'; path: string; doc: News }
  | { kind: 'album'; path: string; doc: Album }

/**
 * Жолды анықтайды: алдымен статикалық бет (Payload `pages`), содан кейін егжей-тегжейлі беттер
 * (қызмет, жоба, жаңалық, альбом). Жазба бар, бірақ осы тілде көрінбесе, бөлім бетіне хабарламамен бағытталады.
 */
async function resolve(locale: Locale, segments: string[]): Promise<Resolved> {
  const path = `/${segments.join('/')}`
  // Corporate режимі: инвесторлар, жобалар каталогы, нәтижелер, мүшелік өтініші мен тізілімі жоқ (404, src/lib/mode.ts)
  if (!isPathVisible(path)) notFound()
  const page = await lookupPage(locale, path)
  if (page.doc) {
    if (!page.visible) redirectMissingTranslation(locale, path)
    return { kind: 'page', path, doc: page.doc }
  }

  const [a, b] = segments
  const found = async <T,>(
    kind: Resolved['kind'],
    lookup: Promise<{ doc: T | null; visible: boolean }>,
  ): Promise<Resolved> => {
    const { doc, visible } = await lookup
    if (!doc) notFound()
    if (!visible) redirectMissingTranslation(locale, path)
    return { kind, path, doc } as unknown as Resolved
  }

  if (segments.length === 2 && a === 'services') return found('service', lookupService(locale, b))
  if (segments.length === 2 && a === 'projects') return found('project', lookupProject(locale, b))
  if (segments.length === 3 && a === 'media' && b === 'news') return found('news', lookupNews(locale, segments[2]))
  if (segments.length === 3 && a === 'media' && b === 'photo') return found('album', lookupAlbum(locale, segments[2]))
  notFound()
}

const titleOf = (resolved: Resolved) =>
  'title' in resolved.doc && resolved.doc.title ? resolved.doc.title : ''

const descriptionOf = (resolved: Resolved): string | undefined => {
  const doc = resolved.doc
  if ('description' in doc && doc.description) return doc.description
  if ('summary' in doc && doc.summary) return doc.summary
  if ('excerpt' in doc && doc.excerpt) return doc.excerpt
  return undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const resolved = await resolve(locale, slug)
  return {
    title: titleOf(resolved),
    description: descriptionOf(resolved),
    alternates: alternatesFor(locale, resolved.path),
  }
}

/** Динамикалық тізімі бар беттер (статикалық блоктардан кейін көрсетіледі) */
const extraPaths = new Set([
  '/services',
  '/projects',
  '/media/news',
  '/media/events',
  '/media/video',
  '/media/photo',
  '/partners',
  '/about/people',
  '/about/documents',
  '/about/reports',
])

/** Формасы бар беттер (ТТ 8.1, 9): өтініш формасы статикалық блоктардан кейін көрсетіледі */
const formByPath: Record<string, FormSpec> = {
  '/contacts': contactForm,
  '/investors/apply': investorForm,
  '/projects/submit': projectForm,
  '/membership/apply': membershipForm,
}

function Extras({ path, locale, sector }: { path: string; locale: Locale; sector?: string }) {
  switch (path) {
    case '/services':
      return <ServicesList locale={locale} />
    case '/projects':
      return <ProjectsCatalog locale={locale} sector={sector} />
    case '/media/news':
      return <NewsList locale={locale} />
    case '/media/events':
      return <EventsList locale={locale} />
    case '/media/video':
      return <VideosList locale={locale} />
    case '/media/photo':
      return <AlbumsList locale={locale} />
    case '/partners':
      return <PartnersList locale={locale} />
    case '/about/people':
      return <PeopleList locale={locale} />
    case '/about/documents':
      return <DocumentsList locale={locale} mode="documents" />
    case '/about/reports':
      return <DocumentsList locale={locale} mode="reports" />
    default:
      return null
  }
}

/** Бөлім түбір беті бар (аралық жол көрсеткіш сілтеме болады); legal бөлімінің түбір беті жоқ */
const sectionRoots = new Set(['about', 'services', 'investors', 'projects', 'membership', 'media'])

export default async function InnerPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [resolved, query, t] = await Promise.all([
    resolve(locale, slug),
    searchParams,
    getTranslations({ locale }),
  ])

  const home = { label: t('page.home'), href: '/' }
  const sector = typeof query.sector === 'string' ? query.sector : undefined
  let crumbs: Crumb[]
  let eyebrow: string | undefined
  let meta: string | undefined

  switch (resolved.kind) {
    case 'page': {
      const first = slug[0]
      eyebrow = t(`page.section.${resolved.doc.section}`)
      crumbs =
        slug.length === 1
          ? [home, { label: titleOf(resolved) }]
          : [
              home,
              { label: t(`page.section.${first as Page['section']}`), href: sectionRoots.has(first) ? `/${first}` : undefined },
              { label: titleOf(resolved) },
            ]
      break
    }
    case 'service':
      eyebrow = t('page.section.services')
      crumbs = [home, { label: t('nav.services'), href: '/services' }, { label: titleOf(resolved) }]
      break
    case 'project':
      eyebrow = t('page.section.projects')
      crumbs = [home, { label: t('nav.projects'), href: '/projects' }, { label: titleOf(resolved) }]
      break
    case 'news':
      eyebrow = t('nav.sub.media.news')
      meta = `${formatDate(resolved.doc.publishedAt, locale)} · ${t(`news.categories.${resolved.doc.category}`)}`
      crumbs = [
        home,
        { label: t('nav.media'), href: '/media' },
        { label: t('nav.sub.media.news'), href: '/media/news' },
        { label: titleOf(resolved) },
      ]
      break
    case 'album':
      eyebrow = t('nav.sub.media.photo')
      meta = resolved.doc.publishedAt ? formatDate(resolved.doc.publishedAt, locale) : undefined
      crumbs = [
        home,
        { label: t('nav.media'), href: '/media' },
        { label: t('nav.sub.media.photo'), href: '/media/photo' },
        { label: titleOf(resolved) },
      ]
      break
  }

  const blocks = resolved.kind === 'page' || resolved.kind === 'service' ? (resolved.doc.blocks ?? []) : []
  const cta = resolved.kind === 'page' || resolved.kind === 'service' ? resolved.doc.cta : null
  const hasExtras = resolved.kind === 'page' && extraPaths.has(resolved.path)
  const form = resolved.kind === 'page' ? formByPath[resolved.path] : undefined
  const toc = hasExtras ? [] : tocItems(blocks)
  const showToc = toc.length >= 3

  return (
    <main id="main">
      <JsonLd data={breadcrumbSchema(locale, crumbs.map((crumb) => ({ name: crumb.label, path: crumb.href })).map((crumb, index, all) => (index === all.length - 1 ? { name: crumb.name, path: resolved.path } : crumb)))} />
      <PageHero
        eyebrow={eyebrow}
        title={titleOf(resolved)}
        description={descriptionOf(resolved)}
        crumbs={crumbs}
        crumbLabel={t('a11y.breadcrumbs')}
        meta={meta}
      />

      {resolved.kind === 'project' ? <ProjectBody locale={locale} project={resolved.doc} access={await accessStateFor(await headers(), resolved.doc.id)} /> : null}
      {resolved.kind === 'news' ? <NewsBody locale={locale} item={resolved.doc} /> : null}
      {resolved.kind === 'album' ? <AlbumBody locale={locale} album={resolved.doc} /> : null}

      {resolved.kind === 'page' || resolved.kind === 'service' ? (
        <div className={cn('wrap grid pt-12 lg:pt-16', showToc && 'lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-14')}>
          {showToc ? <PageToc title={t('page.onThisPage')} items={toc} /> : null}
          <div className="min-w-0">
            <Blocks blocks={blocks} />
            {hasExtras ? (
              <div className={cn(blocks.length > 0 && 'mt-12 border-t border-line pt-12 lg:mt-14 lg:pt-14')}>
                <Extras path={resolved.path} locale={locale} sector={sector} />
              </div>
            ) : null}
            {form ? (
              <div id="apply-form" className={cn('scroll-mt-28', blocks.length > 0 && 'mt-12 border-t border-line pt-12 lg:mt-14 lg:pt-14')}>
                <h2 className="t-h2 mb-8 text-navy-900">{form.title[locale]}</h2>
                <FormRenderer spec={form} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <CtaBand cta={cta} />
    </main>
  )
}
