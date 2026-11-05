import { getTranslations } from 'next-intl/server'

import { MissingTranslation } from '@/components/layout/MissingTranslation'
import { JsonLd, organizationSchema } from '@/components/page/JsonLd'
import type { Locale } from '@/i18n/config'
import { getHome, getLatestNews, getPartners, getServices, getSettings, lookupPage } from '@/lib/content'
import { visibleHref } from '@/lib/mode'

import { CorporateAbout, CorporateContact, CorporatePartners, type Principle } from './CorporateSections'
import { Hero, type HeroCta } from './Hero'
import { MediaSection } from './MediaMembership'
import { LeadershipSection } from './ScoringLeadership'
import { ServicesSection } from './ServicesLifecycle'

/** CMS-тегі батырма көрінетін бетке апарса, сол қолданылады; әйтпесе әдепкі corporate батырмасы */
function heroCta(label: string | null | undefined, href: string | null | undefined, fallback: HeroCta): HeroCta {
  const visible = visibleHref(href)
  return label && visible ? { label, href: visible } : fallback
}

/**
 * Corporate басты бет (PORTAL_MODE=corporate): hero, қауымдастық туралы, қызметтер, жаңалықтар, серіктестер, басшылық, байланыс.
 * Инвестициялық блоктар (аудитория, нәтиже, цикл, жобалар, дәліздер, бағалау, мүшелік) бұл жерде жоқ және олардың деректері оқылмайды.
 */
export async function CorporateHome({ locale }: { locale: Locale }) {
  const [home, settings] = await Promise.all([getHome(locale), getSettings(locale)])
  if (!home) return <MissingTranslation locale={locale} />

  const [services, news, partners, about, mission, c, zh] = await Promise.all([
    getServices(locale),
    getLatestNews(locale, 4),
    getPartners(locale),
    lookupPage(locale, '/about'),
    lookupPage(locale, '/about/mission'),
    getTranslations({ locale, namespace: 'corporate' }),
    getTranslations({ locale: 'zh', namespace: 'meta' }),
  ])

  const showExample = settings.policy?.showExampleBadges ?? true
  const lead = about.visible ? about.doc?.description : null
  // Қағидаттар: «Миссия мен қағидаттар» бетінің бірінші карточкалар блогы (CMS-те өзгертіледі)
  const cards = mission.visible ? mission.doc?.blocks?.find((block) => block.blockType === 'cards') : undefined
  const principles: Principle[] =
    cards && cards.blockType === 'cards'
      ? (cards.items ?? []).filter((item) => item.title).map((item) => ({ id: item.id, title: item.title, text: item.text }))
      : []

  return (
    <main id="main">
      <JsonLd data={organizationSchema({ name: (settings.brandName ?? '').split('\n').join(' '), phone: settings.phone, address: settings.legalAddress, locale })} />
      {home.hero ? (
        <Hero
          data={home.hero}
          zhName={zh('siteName')}
          compact
          ctas={{
            primary: heroCta(home.hero.primaryCtaLabel, home.hero.primaryCtaHref, { label: c('hero.primary'), href: '/services' }),
            secondary: heroCta(home.hero.secondaryCtaLabel, home.hero.secondaryCtaHref, { label: c('hero.secondary'), href: '/contacts' }),
          }}
        />
      ) : null}
      <CorporateAbout locale={locale} lead={lead} principles={principles} />
      {home.services ? <ServicesSection data={home.services} services={services} /> : null}
      {home.media ? <MediaSection data={home.media} news={news} locale={locale} showExampleBadge={showExample} spaced /> : null}
      <CorporatePartners locale={locale} partners={partners} />
      {home.leadership ? <LeadershipSection data={home.leadership} /> : null}
      <CorporateContact locale={locale} settings={settings} />
    </main>
  )
}
