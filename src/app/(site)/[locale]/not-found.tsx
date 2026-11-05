import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'
import { Ornament } from '@/components/ui/typography'

/** 404: қараңғы нави, үлкен алтын «404», басты бетке оралу. Локаль сұраудан алынады (proxy.ts). */
export default async function NotFound() {
  const t = await getTranslations('page')
  return (
    <main id="main" className="grain relative -mb-[72px] overflow-hidden bg-navy-950 text-white lg:-mb-[110px]">
      <span aria-hidden="true" className="ornament absolute inset-0" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_50%_0%,rgb(37_80_143/0.4),transparent_70%),radial-gradient(40%_60%_at_50%_120%,rgb(196_154_60/0.22),transparent_70%)]"
      />
      <div className="wrap relative z-10 grid min-h-[70vh] place-content-center justify-items-center gap-6 py-24 text-center">
        <span
          aria-hidden="true"
          className="lining bg-linear-to-b from-gold-300 to-gold-600 bg-clip-text font-serif text-[clamp(96px,22vw,200px)] font-bold leading-none tracking-[-0.04em] text-transparent"
        >
          404
        </span>
        <Ornament onDark />
        <h1 className="t-h2 text-white">{t('notFoundTitle')}</h1>
        <p className="t-lead max-w-[560px] text-white/70">{t('notFoundText')}</p>
        <Button href="/" arrow>
          {t('notFoundAction')}
        </Button>
      </div>
    </main>
  )
}
