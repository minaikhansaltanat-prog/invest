import { getTranslations } from 'next-intl/server'

import { Tag } from '@/components/ui/Badge'
import { GradeCards } from '@/components/ui/GradeCards'
import { PersonCard } from '@/components/ui/PersonCard'
import { Reveal } from '@/components/ui/Reveal'
import { ScoreBars } from '@/components/ui/ScoreBars'
import { Eyebrow, Lines, NoBreak } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { mediaOf } from '@/lib/media'
import type { Home, ScoringConfig } from '@/payload-types'

/** 100 балдық бағалау (10-блок): 7 өлшемнің жолақшалары, A/B/C/D деңгейлері, комплаенс ветосы, «ресми рейтинг емес» ескертпесі */
export async function ScoringSection({
  data,
  config,
  locale,
}: {
  data: NonNullable<Home['scoring']>
  config: ScoringConfig
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'scoring' })
  const bars = (config.dimensions ?? []).map((dimension) => ({
    label: dimension.shortLabel || dimension.label || '',
    points: dimension.weight,
  }))
  const grades = (config.grades ?? []).map((grade) => ({
    key: grade.key,
    range: grade.rangeLabel ?? `${grade.min}-${grade.max}`,
    title: grade.title ?? '',
  }))
  if (bars.length === 0) return null

  return (
    <section className="section-y border-y border-line bg-paper">
      <div className="wrap grid items-center gap-9 lg:grid-cols-[1fr_1.15fr] lg:gap-[70px]">
        <Reveal className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
            {!config.methodologyApproved ? <Tag>{t('draftBadge')}</Tag> : null}
          </div>
          {data.title ? (
            <h2 className="t-h2 text-navy-900">
              <Lines text={data.title} />
            </h2>
          ) : null}
          {data.lead ? (
            <p className="t-lead max-w-[620px] text-muted">
              <NoBreak text={data.lead} />
            </p>
          ) : null}
          {data.vetoText ? (
            <p className="mt-3 flex items-start gap-3 rounded-[12px] border border-warn-line bg-warn-bg p-[16px_18px] text-base leading-relaxed text-warn-ink lg:text-sm">
              <i aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gold-500" />
              <span>
                <b className="font-semibold">{data.vetoTitle}</b> {data.vetoText}
              </span>
            </p>
          ) : null}
        </Reveal>
        <Reveal delay={100} className="grid gap-[30px]">
          <ScoreBars items={bars} />
          <GradeCards grades={grades} />
        </Reveal>
      </div>
    </section>
  )
}

/** Басшылық және қағидат (11-блок): стратегиядан дәйексөз, Төраға карточкасы (фото келісімі болмаса монограмма) */
export function LeadershipSection({ data }: { data: NonNullable<Home['leadership']> }) {
  const person = typeof data.person === 'object' && data.person ? data.person : null
  // Фото тек жариялауға келісім белгіленгенде көрсетіледі (field access та осыны қамтамасыз етеді)
  const photo = person?.photoConsent ? mediaOf(person.photo) : null

  return (
    <section className="section-y">
      <div className="wrap grid items-center gap-[30px] lg:grid-cols-[1.6fr_1fr] lg:gap-[60px]">
        <Reveal>
          {/* Дәйексөздің үлкен алтын тырнақшасы: тілге сай (quotes) және тек безендіру үшін */}
          <blockquote
            className={
              'relative border-l-2 border-gold-500 pb-1 pl-[22px] pt-10 font-serif text-[28px] font-medium leading-[1.16] tracking-[-0.01em] text-navy-900 [text-wrap:pretty] ' +
              'before:pointer-events-none before:absolute before:left-[22px] before:top-[-22px] before:font-serif before:text-[64px] before:font-semibold before:leading-none before:text-gold-300 before:content-[open-quote] ' +
              'lg:pl-10 lg:pt-14 lg:text-[40px] lg:before:left-10 lg:before:top-[-34px] lg:before:text-[96px] [&:lang(zh)]:font-zh-serif [&:lang(zh)]:leading-[1.5]'
            }
          >
            <NoBreak text={data.quote ?? ''} />
          </blockquote>
          {data.quoteSource ? (
            <p className="mt-[22px] pl-6 text-base text-muted lg:pl-[42px] lg:text-sm">
              <NoBreak text={data.quoteSource} />
            </p>
          ) : null}
        </Reveal>
        {person ? (
          <Reveal delay={120}>
            <PersonCard
              name={person.name ?? ''}
              position={person.position ?? ''}
              linkLabel={data.personLinkLabel ?? ''}
              href="/about/governance"
              monogram={person.monogram ?? ''}
              photo={
                photo
                  ? { src: photo.src, alt: person.photoAlt || photo.alt, width: photo.width, height: photo.height }
                  : null
              }
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
