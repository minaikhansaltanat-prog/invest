import { Icon } from '@/components/ui/icons'
import { Eyebrow, NoBreak } from '@/components/ui/typography'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export type Crumb = { label: string; href?: string }

/**
 * Ішкі беттің тақырып жолағы: қараңғы нави, қабатты градиент, ою-өрнек және түйіршік, жол көрсеткіш (breadcrumb),
 * белгі, H1 мен бір сөйлемдік сипаттама. Негізгі hero-дан аз биік: мазмұнға тезірек жеткізеді.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  crumbLabel,
  meta,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string | null
  crumbs: Crumb[]
  crumbLabel: string
  /** Тақырып астындағы шағын жол (күні, санаты) */
  meta?: string
  className?: string
}) {
  return (
    <header className={cn('grain relative overflow-hidden bg-navy-950 text-white', className)}>
      <span aria-hidden="true" className="ornament absolute inset-y-0 right-0 w-full lg:w-[55%]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_95%_at_10%_0%,rgb(37_80_143/0.4),transparent_70%),radial-gradient(42%_70%_at_96%_125%,rgb(196_154_60/0.22),transparent_70%)]"
      />
      <div className="wrap relative z-10 pb-12 pt-8 lg:pb-[76px] lg:pt-10">
        <nav aria-label={crumbLabel}>
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[13.5px] text-white/70">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1
              return (
                <li key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
                  {crumb.href && !last ? (
                    <Link
                      href={crumb.href}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-1 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-gold-400"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? 'page' : undefined} className={cn('px-1', last && 'text-white/90')}>
                      {crumb.label}
                    </span>
                  )}
                  {last ? null : <Icon name="chevron-right" size={14} className="shrink-0 text-gold-400/80 rtl:rotate-180" />}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="mt-6 grid max-w-[860px] gap-5 lg:mt-10">
          {eyebrow ? (
            <div className="load-rise" style={{ ['--d' as string]: '0ms' }}>
              <Eyebrow tone="hero">{eyebrow}</Eyebrow>
            </div>
          ) : null}
          <h1 className="t-h2 load-rise text-white" style={{ ['--d' as string]: '80ms' }}>
            <NoBreak text={title} />
          </h1>
          {meta ? (
            <p className="load-rise text-[13px] font-semibold uppercase tracking-[0.08em] text-gold-300" style={{ ['--d' as string]: '140ms' }}>
              {meta}
            </p>
          ) : null}
          {description ? (
            <p className="t-lead load-rise max-w-[680px] text-white/75" style={{ ['--d' as string]: '180ms' }}>
              <NoBreak text={description} />
            </p>
          ) : null}
        </div>
      </div>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-px bg-linear-to-r from-transparent via-gold-500/70 to-transparent" />
    </header>
  )
}
