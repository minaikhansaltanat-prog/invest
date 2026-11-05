import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { ServiceCell } from '@/components/ui/ServiceCell'
import { Stepper } from '@/components/ui/Stepper'
import { Link } from '@/i18n/navigation'
import { Icon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { Home, Service } from '@/payload-types'

/** Қызметтер (6-блок): 8 бағыттың 4x2 торы, нөмір, иконка, тақырып, бір сөйлем */
export function ServicesSection({ data, services }: { data: NonNullable<Home['services']>; services: Service[] }) {
  if (services.length === 0) return null
  return (
    <section className="section-y border-y border-line bg-paper">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow={data.eyebrow ?? undefined}
            title={data.title ?? ''}
            action={
              data.linkLabel ? (
                <Link
                  href="/services"
                  className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-semibold text-navy-700 hover:text-navy-900"
                >
                  {data.linkLabel}
                  <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </Link>
              ) : undefined
            }
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCell
                key={service.id}
                number={service.number}
                icon={service.icon}
                title={service.title ?? ''}
                text={service.summary ?? ''}
                href={`/services/${service.slug}`}
                highlight={Boolean(service.highlight)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Жоба өмірлік циклі (7-блок): 8 кезеңнің сызығы және 4 дайындық деңгейі */
export function LifecycleSection({ data }: { data: NonNullable<Home['lifecycle']> }) {
  const steps = (data.steps ?? []).map((step) => ({
    title: step.title ?? '',
    text: step.text ?? '',
    done: Boolean(step.done),
  }))
  if (steps.length === 0) return null
  const levels = data.levels ?? []

  return (
    <section data-surface="dark" className="on-dark ornament section-y relative isolate overflow-hidden bg-navy-950 text-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_85%_0%,rgb(37_80_143/0.35),transparent_70%),radial-gradient(40%_60%_at_5%_100%,rgb(196_154_60/0.12),transparent_70%)]"
      />
      <div className="wrap relative z-10">
        <Reveal>
          <SectionHead
            onDark
            eyebrow={data.eyebrow ?? undefined}
            title={data.title ?? ''}
            lead={data.lead ?? undefined}
            className="[&>div:first-child]:max-w-[760px]"
          />
        </Reveal>
        <div className="mt-6">
          <Stepper steps={steps} />
        </div>
        {levels.length > 0 ? (
          <Reveal
            className="mt-[60px] flex flex-col gap-4 border-t border-gold-400/20 pt-7 text-sm text-white/65 lg:flex-row lg:items-center lg:justify-between"
          >
            <span>{data.levelsLabel}</span>
            <ol className="flex flex-wrap gap-2.5">
              {levels.map((level, index) => (
                <li
                  key={level.id ?? index}
                  className={cn(
                    'rounded-full border border-gold-400/25 px-3.5 py-1.5 text-[13px] text-white/85',
                    'transition-colors duration-200 hover:border-gold-300/60 hover:bg-white/5',
                  )}
                >
                  <b className="lining mr-1.5 font-semibold text-gold-300">{index + 1}</b>
                  {level.title}
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
