import { AudienceCard } from '@/components/ui/AudienceCard'
import { Ledger } from '@/components/ui/Ledger'
import { Reveal } from '@/components/ui/Reveal'
import { Eyebrow, Lines, NoBreak } from '@/components/ui/typography'
import type { Home, KpiTarget } from '@/payload-types'

/** Аудитория карточкалары (4-блок): Hero-ға жартылай кіріп тұрады */
export function AudienceCards({ data }: { data: NonNullable<Home['audience']> }) {
  const cards = data.cards ?? []
  if (cards.length === 0) return null
  return (
    <section className="relative z-20 -mt-[90px] lg:-mt-[118px]">
      <div className="wrap">
        <div className="grid gap-3.5 lg:grid-cols-3 lg:gap-[22px]">
          {cards.map((card, index) => (
            <Reveal key={card.id ?? card.title} delay={index * 90}>
              <AudienceCard
                index={index + 1}
                title={card.title ?? ''}
                text={card.text ?? ''}
                cta={card.ctaLabel ?? ''}
                href={card.href ?? '/'}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Нәтиже ашықтығы (5-блок): төрт бөлек есеп, ешқашан қосылмайды. Сандар KPI жинағынан */
export function ResultsSection({ data, kpi }: { data: NonNullable<Home['results']>; kpi: KpiTarget }) {
  const values = [kpi.databaseCount, kpi.screenedCount, kpi.reviewedCount, kpi.confirmedCount]
  const cells = (data.cells ?? []).map((cell, index) => ({
    label: cell.label ?? '',
    description: cell.description ?? '',
    value: values[index] ?? 0,
  }))

  return (
    <section className="section-y">
      <div className="wrap grid items-start gap-7 lg:grid-cols-[1.05fr_2fr] lg:gap-14">
        <Reveal className="grid gap-4">
          {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
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
        </Reveal>
        <Reveal delay={120}>
          <Ledger cells={cells} note={kpi.periodNote ?? undefined} />
        </Reveal>
      </div>
    </section>
  )
}
