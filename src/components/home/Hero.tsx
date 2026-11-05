import Image from 'next/image'

import heroImage from '@/assets/images/hero_web.jpg'
import { Button } from '@/components/ui/Button'
import { AccentText, Eyebrow, NoBreak } from '@/components/ui/typography'
import { str } from '@/lib/format'
import type { Home } from '@/payload-types'

/**
 * Hero (ТТ 6, 3-блок): нави фон, Астана фотосы (LCP), тік қытайша атау, H1, 2 батырма, 3 факт.
 * Фото: next/image, AVIF/WebP, priority. Мәтін бет жүктелгенде кезекпен шығады (transform/opacity, 700 ms).
 */
export function Hero({ data, zhName }: { data: NonNullable<Home['hero']>; zhName: string }) {
  const facts = data.facts ?? []
  const title = str(data.title)

  return (
    <section data-surface="dark" className="on-dark grain relative isolate overflow-hidden bg-navy-900 text-white">
      {/* Фото: мобильді (жоғарыда, 360 px) және десктоп (оң жақта, 62 %) */}
      <div className="absolute inset-x-0 top-0 h-[360px] lg:inset-y-0 lg:left-[38%] lg:right-0 lg:h-auto">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          placeholder="blur"
          quality={78}
          sizes="(min-width: 1080px) 62vw, 100vw"
          className="load-settle object-cover object-[64%_55%] lg:object-[50%_40%]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-navy-800/30 mix-blend-multiply" />
        <span
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-navy-900)_0%,rgb(11_30_63/0.86)_18%,rgb(11_30_63/0.25)_52%,rgb(11_30_63/0.05)_100%)] lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgb(7_22_49/0.85),transparent_38%)] lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-navy-900)_2%,rgb(11_30_63/0.35)_45%,rgb(11_30_63/0.1))] lg:hidden"
        />
      </div>

      {/* Ою-өрнек пен жарық: қабатты радиал градиенттер */}
      <span aria-hidden="true" className="ornament absolute inset-y-0 left-0 w-full lg:w-[46%]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_18%_42%,rgb(37_80_143/0.32),transparent_70%),radial-gradient(40%_50%_at_88%_110%,rgb(196_154_60/0.18),transparent_70%)]"
      />

      {/* Тік қытайша атау */}
      <span
        aria-hidden="true"
        lang="zh-CN"
        className="load-fade absolute right-3.5 top-[30px] z-10 font-zh-serif text-[15px] tracking-[0.5em] text-gold-300/90 [--d:600ms] [writing-mode:vertical-rl] before:mb-[18px] before:inline-block before:h-16 before:w-px before:bg-gold-400 lg:right-7 lg:top-[90px] lg:text-[19px]"
      >
        {zhName}
      </span>

      <div className="wrap relative z-10">
        <div className="grid items-center pb-[140px] pt-[300px] lg:min-h-[700px] lg:grid-cols-[minmax(0,640px)_1fr] lg:pb-[190px] lg:pt-[90px]">
          <div>
            {data.eyebrow ? (
              <div className="load-rise" style={{ ['--d' as string]: '0ms' }}>
                <Eyebrow tone="hero">{data.eyebrow}</Eyebrow>
              </div>
            ) : null}
            {title ? (
              <h1 className="t-display load-rise mb-[26px] mt-[22px] text-white" style={{ ['--d' as string]: '90ms' }}>
                <AccentText text={title} />
              </h1>
            ) : null}
            {data.subtitle ? (
              <p
                className="load-rise max-w-[560px] text-base leading-[1.65] text-white/80 lg:text-lg"
                style={{ ['--d' as string]: '190ms' }}
              >
                <NoBreak text={data.subtitle} />
              </p>
            ) : null}
            <div
              className="load-rise mt-[38px] flex flex-col gap-3.5 lg:flex-row"
              style={{ ['--d' as string]: '290ms' }}
            >
              {data.primaryCtaLabel ? (
                <Button href={data.primaryCtaHref ?? '/investors'} arrow className="max-lg:w-full">
                  {data.primaryCtaLabel}
                </Button>
              ) : null}
              {data.secondaryCtaLabel ? (
                <Button href={data.secondaryCtaHref ?? '/projects/submit'} variant="ghost" className="max-lg:w-full">
                  {data.secondaryCtaLabel}
                </Button>
              ) : null}
            </div>
            {facts.length > 0 ? (
              <dl
                className="load-rise mt-[46px] flex flex-wrap gap-x-7 gap-y-4 text-[13px] text-white/65"
                style={{ ['--d' as string]: '390ms' }}
              >
                {facts.map((fact) => (
                  <div key={fact.id ?? fact.title}>
                    <dt className="mb-0.5 text-[15px] font-semibold text-white">{fact.title}</dt>
                    <dd>{fact.text}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
