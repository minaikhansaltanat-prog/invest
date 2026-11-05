import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { homeSeed } from '@content/seed/home'
import { newsSeed, projectsSeed, scoringSeed, servicesSeed } from '@content/seed/data'
import { pick, type SeedLocale } from '@content/seed/lib'

import { AudienceCard } from '@/components/ui/AudienceCard'
import { LevelBadge, Tag } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/Table'
import { GradeCards } from '@/components/ui/GradeCards'
import { Icon, type IconName } from '@/components/ui/icons'
import { Ledger } from '@/components/ui/Ledger'
import { NewsFeatured, NewsItem } from '@/components/ui/NewsCard'
import { PersonCard } from '@/components/ui/PersonCard'
import { ProjectCardBig, ProjectCardSmall } from '@/components/ui/ProjectCard'
import { ScoreBars } from '@/components/ui/ScoreBars'
import { SectionHead } from '@/components/ui/SectionHead'
import { ServiceCell } from '@/components/ui/ServiceCell'
import { Stepper } from '@/components/ui/Stepper'
import { AccentText, Eyebrow, Ornament } from '@/components/ui/typography'
import { routing } from '@/i18n/routing'
import { isCorporate } from '@/lib/mode'
import { tokenContrast, tokens, type TokenName } from '@/lib/contrast'

import baiterek from '@/assets/images/news_baiterek.jpg'
import industry from '@/assets/images/industry_web.jpg'

import { InteractiveDemos } from './StyleguideDemos'

export const metadata = { title: 'Styleguide', robots: { index: false, follow: false } }

const uiIcons: IconName[] = [
  'arrow-right', 'arrow-up-right', 'lock', 'menu', 'close', 'chevron-down', 'check', 'plus', 'search', 'phone', 'mail', 'pin',
  'download', 'external', 'user', 'globe', 'video', 'image', 'calendar', 'alert', 'info', 'shield', 'document', 'wechat', 'eye', 'sparkle',
]

function Block({ id, title, children, dark = false }: { id: string; title: string; children: ReactNode; dark?: boolean }) {
  return (
    <section
      id={id}
      data-surface={dark ? 'dark' : undefined}
      className={dark ? 'on-dark grain bg-navy-950 py-14 text-white' : 'py-14'}
    >
      <div className="wrap relative z-10 grid gap-8">
        <h2 className={`t-small font-semibold uppercase tracking-[0.2em] ${dark ? 'text-gold-300' : 'text-gold-700'}`}>{title}</h2>
        {children}
      </div>
    </section>
  )
}

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  // Дизайн анықтамасы ішкі бет: corporate өндірісінде жария сайтта жоқ (әзірлеуде және full режимінде ашық)
  if (isCorporate() && process.env.NODE_ENV === 'production') notFound()
  setRequestLocale(locale)
  const t = await getTranslations()
  const lang = locale as SeedLocale

  const home = pick(homeSeed, lang)
  const services = pick(servicesSeed, lang)
  const projects = pick(projectsSeed, lang)
  const news = pick(newsSeed, lang)
  const scoring = pick(scoringSeed, lang)

  const swatches = Object.entries(tokens) as Array<[TokenName, string]>
  const levelTitle = (n: string) => home.lifecycle.levels[Number(n) - 1]?.title ?? ''
  const levelLabel = (n: string) => t('project.levelFormat', { n, title: levelTitle(n) })

  return (
    <main id="main">
      <header className="grain relative overflow-hidden bg-navy-900 py-16 text-white">
        <div className="wrap relative z-10 grid gap-5">
          <Eyebrow onDark>Design system</Eyebrow>
          <h1 className="t-display">
            <AccentText text={`Styleguide *${locale.toUpperCase()}*`} />
          </h1>
          <p className="t-lead max-w-[640px] text-white/70">{t('meta.siteName')}</p>
        </div>
      </header>

      <Block id="colors" title="Color tokens">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          {swatches.map(([name, hex]) => (
            <li key={name} className="overflow-hidden rounded-card border border-line bg-paper shadow-card">
              <span className="block h-16 border-b border-line" style={{ background: hex }} />
              <div className="grid gap-0.5 p-3">
                <b className="text-sm text-navy-900">{name}</b>
                <code className="text-xs text-muted">{hex}</code>
                <span className="text-xs text-muted">
                  {tokenContrast(name, 'paper').toFixed(1)}:1 / {tokenContrast(name, 'navy-950').toFixed(1)}:1
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="type" title="Typography">
        <div className="grid gap-6">
          <h2 className="t-display text-navy-900">
            <AccentText text={home.hero.title} accentClassName="text-gold-600" />
          </h2>
          <h3 className="t-h2 text-navy-900">{home.results.title}</h3>
          <h4 className="t-h3 text-navy-900">{home.audience.cards[0]?.title}</h4>
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>
          <p className="t-lead max-w-[680px] text-muted">{home.hero.subtitle}</p>
          <p className="lining font-serif text-6xl font-semibold text-navy-900">0123456789</p>
        </div>
      </Block>

      <Block id="buttons" title="Button">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/investors" arrow>{home.hero.primaryCtaLabel}</Button>
          <Button href="/investors" variant="navy">{home.hero.secondaryCtaLabel}</Button>
          <Button href="/investors" variant="line">{t('common.readMore')}</Button>
          <Button variant="gold" loading>{t('common.submit')}</Button>
          <Button variant="gold" disabled>{t('common.submit')}</Button>
        </div>
        <div data-surface="dark" className="on-dark flex flex-wrap items-center gap-4 rounded-block bg-navy-900 p-6">
          <Button href="/investors" arrow>{home.hero.primaryCtaLabel}</Button>
          <Button href="/investors" variant="ghost">{home.hero.secondaryCtaLabel}</Button>
        </div>
      </Block>

      <Block id="badges" title="Tag / LevelBadge / Ornament">
        <div className="flex flex-wrap items-center gap-4">
          <Tag>{t('common.example')}</Tag>
          <LevelBadge level="2">{levelLabel('2')}</LevelBadge>
          <LevelBadge level="3">{levelLabel('3')}</LevelBadge>
          <span className="rounded-full bg-navy-900 p-2"><LevelBadge level="3" variant="overlay">{levelLabel('3')}</LevelBadge></span>
        </div>
        <Ornament />
      </Block>

      <Block id="cards" title="Card: base, elevated, floating, interactive">
        <div className="grid gap-5 md:grid-cols-3">
          <Card level="base" className="p-6"><b className="text-navy-900">base</b><p className="t-small mt-1 text-muted">{home.audience.cards[0]?.text}</p></Card>
          <Card level="elevated" className="p-6"><b className="text-navy-900">elevated</b><p className="t-small mt-1 text-muted">{home.audience.cards[1]?.text}</p></Card>
          <Card level="floating" interactive tabIndex={0} className="p-6"><b className="text-navy-900">floating + interactive</b><p className="t-small mt-1 text-muted">{home.audience.cards[2]?.text}</p></Card>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {home.audience.cards.map((card, i) => (
            <AudienceCard key={card.id} index={i + 1} title={card.title} text={card.text} cta={card.ctaLabel} href={card.href} />
          ))}
        </div>
      </Block>

      <Block id="services" title="ServiceCell">
        <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCell
              key={service.slug}
              number={service.number}
              icon={service.icon as never}
              title={service.title}
              text={service.summary}
              href={`/services/${service.slug}`}
              highlight={service.highlight}
            />
          ))}
        </div>
      </Block>

      <Block id="ledger" title="Ledger (4 reports)">
        <Ledger
          cells={home.results.cells.map((cell, i) => ({ label: cell.label, description: cell.description, value: [30, 10, 5, 1][i] ?? 0 }))}
          note="2026-IV: target figures"
        />
      </Block>

      <Block id="scoring" title="ScoreBars / GradeCards">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScoreBars items={scoring.dimensions.map((d) => ({ label: d.shortLabel, points: d.weight }))} />
          <GradeCards grades={scoring.grades.map((g) => ({ key: g.key, range: g.rangeLabel, title: g.title }))} />
        </div>
      </Block>

      <Block id="stepper" title="Stepper (lifecycle)" dark>
        <Stepper steps={home.lifecycle.steps} />
      </Block>

      <Block id="projects" title="ProjectCard (big / small)">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <ProjectCardBig
            href="/projects/mining-deep-processing-karaganda"
            title={projects[0]?.title ?? ''}
            sector={`${projects[0]?.subSector ?? ''}`}
            level="3"
            levelLabel={levelLabel('3')}
            image={{ src: industry.src, alt: '' }}
            lockLabel={t('project.ndaLock')}
            actionLabel={t('project.passport')}
            facts={[
              { label: t('project.region'), value: projects[0]?.region ?? '' },
              { label: t('project.volume'), value: t('project.volumeMusd', { amount: projects[0]?.amountMusd ?? 0 }) },
              { label: t('project.model'), value: projects[0]?.model ?? '' },
            ]}
          />
          <div className="grid gap-5">
            <ProjectCardSmall
              href="/projects/solar-power-plant-turkistan"
              title={projects[1]?.title ?? ''}
              level="2"
              levelLabel={levelLabel('2')}
              glyph="solar"
              facts={[
                { label: t('project.region'), value: projects[1]?.region ?? '' },
                { label: t('project.volumeModel'), value: `${projects[1]?.amountMusd} · ${projects[1]?.model}` },
              ]}
            />
            <ProjectCardSmall
              href="/projects/dry-port-logistics-hub-almaty"
              title={projects[2]?.title ?? ''}
              level="3"
              levelLabel={levelLabel('3')}
              glyph="port"
              facts={[
                { label: t('project.region'), value: projects[2]?.region ?? '' },
                { label: t('project.volumeModel'), value: `${projects[2]?.amountMusd} · ${projects[2]?.model}` },
              ]}
            />
          </div>
        </div>
      </Block>

      <Block id="news" title="NewsFeatured / NewsItem / PersonCard">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <NewsFeatured href="/media/news/strategy" meta={news[0]?.publishedAt ?? ''} title={news[0]?.title ?? ''} image={{ src: baiterek.src, alt: '' }} />
          <div className="grid content-start gap-5">
            <div className="rounded-block border border-line bg-paper px-8 py-2 shadow-card">
              {news.slice(1).map((item) => (
                <NewsItem key={item.slug} href={`/media/news/${item.slug}`} meta={item.publishedAt} title={item.title} />
              ))}
            </div>
            <PersonCard
              name="Galym Zhanar"
              position={home.leadership.quoteSource}
              linkLabel={home.leadership.personLinkLabel}
              href="/about/governance"
              monogram="ҒЖ"
            />
          </div>
        </div>
      </Block>

      <Block id="interactive" title="Interactive">
        <InteractiveDemos
          chips={home.projects.chips.map((chip) => chip.label)}
          steps={home.lifecycle.steps.slice(0, 4).map((step) => step.title)}
          accordion={services.slice(0, 3).map((service) => ({ id: service.slug, title: service.title, text: service.summary }))}
        />
      </Block>

      <Block id="table" title="DataTable">
        <DataTable
          caption={t('styleguide.tableCaption')}
          rowKey={(row) => row.slug}
          rows={projects}
          columns={[
            { key: 'title', header: t('styleguide.colName'), render: (row) => <b className="text-navy-900">{row.title}</b> },
            { key: 'level', header: t('styleguide.colStatus'), render: (row) => <LevelBadge level={row.level as '2' | '3'}>{levelLabel(row.level)}</LevelBadge> },
            { key: 'amount', header: t('styleguide.colAmount'), numeric: true, render: (row) => t('project.volumeMusd', { amount: row.amountMusd }) },
          ]}
        />
      </Block>

      <Block id="icons" title="Icons">
        <ul className="grid grid-cols-4 gap-3 md:grid-cols-8 xl:grid-cols-13">
          {uiIcons.map((name) => (
            <li key={name} className="grid place-items-center gap-2 rounded-card border border-line bg-paper p-4 text-navy-700 shadow-card">
              <Icon name={name} size={24} />
              <span className="text-[11px] text-muted">{name}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block id="textures" title="Ornament / grain" dark>
        <div className="grain ornament relative h-48 overflow-hidden rounded-block border border-white/10 bg-navy-900">
          <div className="relative z-10 grid h-full place-items-center">
            <SectionHead onDark title={home.services.title} eyebrow={home.services.eyebrow} className="mb-0 items-center text-center lg:flex-col lg:items-center" />
          </div>
        </div>
      </Block>
    </main>
  )
}
