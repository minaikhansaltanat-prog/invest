import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AudienceCards, ResultsSection } from '@/components/home/AudienceResults'
import { Hero } from '@/components/home/Hero'
import { MediaSection, MembershipSection } from '@/components/home/MediaMembership'
import { CorridorsSection, ProjectsSection } from '@/components/home/ProjectsCorridors'
import { LeadershipSection, ScoringSection } from '@/components/home/ScoringLeadership'
import { LifecycleSection, ServicesSection } from '@/components/home/ServicesLifecycle'
import { MissingTranslation } from '@/components/layout/MissingTranslation'
import { JsonLd, organizationSchema } from '@/components/page/JsonLd'
import { routing } from '@/i18n/routing'
import {
  getCatalogProjects,
  getHome,
  getKpiTargets,
  getLatestNews,
  getScoringConfig,
  getServices,
  getSettings,
} from '@/lib/content'
import { alternatesFor } from '@/lib/seo'

// Мазмұн Payload дерекқорынан: құрастыру кезінде (next build) дерекқорға тәуелді статикалық бет жасалмайды, әр сұраныста оқылады
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const [home, t] = await Promise.all([getHome(locale), getTranslations({ locale, namespace: 'meta' })])
  return {
    title: { absolute: `${t('siteName')} | ${t('tagline')}` },
    description: home?.hero?.subtitle ?? t('tagline'),
    alternates: alternatesFor(locale, '/'),
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const [home, settings] = await Promise.all([getHome(locale), getSettings(locale)])
  if (!home) return <MissingTranslation locale={locale} />

  const [kpi, scoring, services, projects, news, zh] = await Promise.all([
    getKpiTargets(locale),
    getScoringConfig(locale),
    getServices(locale),
    getCatalogProjects(locale, 3),
    getLatestNews(locale, 4),
    getTranslations({ locale: 'zh', namespace: 'meta' }),
  ])

  const showExample = settings.policy?.showExampleBadges ?? true
  const levelTitles = (home.lifecycle?.levels ?? []).map((level) => level.title ?? '')

  return (
    <main id="main">
      <JsonLd data={organizationSchema({ name: (settings.brandName ?? '').split('\n').join(' '), phone: settings.phone, address: settings.legalAddress, locale })} />
      {home.hero ? <Hero data={home.hero} zhName={zh('siteName')} /> : null}
      {home.audience ? <AudienceCards data={home.audience} /> : null}
      {home.results ? <ResultsSection data={home.results} kpi={kpi} /> : null}
      {home.services ? <ServicesSection data={home.services} services={services} /> : null}
      {home.lifecycle ? <LifecycleSection data={home.lifecycle} /> : null}
      {home.projects ? (
        <ProjectsSection
          data={home.projects}
          projects={projects}
          levelTitles={levelTitles}
          locale={locale}
          showExampleBadge={showExample}
        />
      ) : null}
      {home.corridors ? <CorridorsSection data={home.corridors} locale={locale} /> : null}
      {home.scoring ? <ScoringSection data={home.scoring} config={scoring} locale={locale} /> : null}
      {home.leadership ? <LeadershipSection data={home.leadership} /> : null}
      {home.media ? <MediaSection data={home.media} news={news} locale={locale} showExampleBadge={showExample} /> : null}
      {home.membership ? <MembershipSection data={home.membership} /> : null}
    </main>
  )
}
