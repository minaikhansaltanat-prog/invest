import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { NoBreak } from '@/components/ui/typography'
import { visibleHref } from '@/lib/mode'

/** Бет соңындағы шақыру: нави карточка, ою-өрнек, алтын батырма. Мәтін бос болса, ештеңе көрсетілмейді. */
export function CtaBand({
  cta,
}: {
  cta?: { title?: string | null; text?: string | null; label?: string | null; href?: string | null } | null
}) {
  // Corporate режимінде жасырын бетке (инвестор өтініші, жоба т.б.) апаратын шақыру көрсетілмейді
  const href = visibleHref(cta?.href)
  if (!cta?.title || !cta.label || !href) return null
  return (
    <section className="pt-14 lg:pt-[88px]">
      <div className="wrap">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-hero bg-navy-900 px-6 py-11 text-white shadow-float lg:px-14 lg:py-14">
            <span aria-hidden="true" className="ornament absolute inset-0" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_0%_0%,rgb(37_80_143/0.4),transparent_70%),radial-gradient(40%_80%_at_100%_120%,rgb(196_154_60/0.25),transparent_70%)]"
            />
            <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
              <div className="grid gap-3">
                <h2 className="t-h2 text-white">
                  <NoBreak text={cta.title} />
                </h2>
                {cta.text ? (
                  <p className="t-lead max-w-[640px] text-white/70">
                    <NoBreak text={cta.text} />
                  </p>
                ) : null}
              </div>
              <Button href={href} arrow className="max-lg:w-full">
                {cta.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
