import { getTranslations } from 'next-intl/server'

import { Tag } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/icons'
import { NewsFeatured, NewsItem } from '@/components/ui/NewsCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { Eyebrow } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/format'
import { mediaOf } from '@/lib/media'
import type { Home, News } from '@/payload-types'

const galleryLink =
  'group flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-card border border-line bg-paper px-6 py-[18px] font-semibold text-navy-900 shadow-card transition-[transform,border-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-gold-500/60'

/** Медиа орталығы (12-блок): 1 басты жаңалық + 3 жаңалық тізімі, Видео және Фото галерея сілтемелері */
export async function MediaSection({
  data,
  news,
  locale,
  showExampleBadge,
}: {
  data: NonNullable<Home['media']>
  news: News[]
  locale: Locale
  showExampleBadge: boolean
}) {
  if (news.length === 0) return null
  const t = await getTranslations({ locale })
  const categoryLabel = (item: News) => t(`news.categories.${item.category}`)
  const meta = (item: News) => `${formatDate(item.publishedAt, locale)} · ${categoryLabel(item)}`

  const featured = news.find((item) => item.featured) ?? news[0]
  const rest = news.filter((item) => item.id !== featured.id).slice(0, 3)
  const image = mediaOf(featured.image)

  return (
    <section className="pb-[var(--section-y)]">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow={data.eyebrow ?? undefined}
            title={data.title ?? ''}
            action={
              <>
                {showExampleBadge && data.showExampleBadge ? <Tag>{t('common.example')}</Tag> : null}
                {data.linkLabel ? (
                  <Link
                    href="/media/news"
                    className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-semibold text-navy-700 hover:text-navy-900"
                  >
                    {data.linkLabel}
                    <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                  </Link>
                ) : null}
              </>
            }
          />
        </Reveal>
        <div className="grid gap-[22px] lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="h-full">
            <NewsFeatured
              className="h-full"
              href={`/media/news/${featured.slug}`}
              meta={meta(featured)}
              title={featured.title ?? ''}
              image={image ? { src: image.src, alt: image.alt } : { src: '', alt: '' }}
            />
          </Reveal>
          <div className="grid content-start gap-[22px]">
            <Reveal delay={90}>
              <div className="rounded-block border border-line bg-paper px-[30px] py-2 shadow-card">
                {rest.map((item) => (
                  <NewsItem key={item.id} href={`/media/news/${item.slug}`} meta={meta(item)} title={item.title ?? ''} />
                ))}
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="grid gap-[22px] md:grid-cols-2">
                <Link href="/media/video" className={galleryLink}>
                  <span className="flex items-center gap-3.5">
                    <Icon name="video" size={26} strokeWidth={1.5} className="text-gold-700" />
                    {data.videoLabel}
                  </span>
                  <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </Link>
                <Link href="/media/photo" className={galleryLink}>
                  <span className="flex items-center gap-3.5">
                    <Icon name="image" size={26} strokeWidth={1.5} className="text-gold-700" />
                    {data.photoLabel}
                  </span>
                  <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI']

/** Мүшелік CTA (13-блок): 5 санат, «Мүшелікке өтініш» және «Шарттармен танысу» */
export function MembershipSection({ data }: { data: NonNullable<Home['membership']> }) {
  const categories = data.categories ?? []
  return (
    <section className="wrap">
      <Reveal>
        <div
          data-surface="dark"
          className="on-dark grain relative grid items-center gap-10 overflow-hidden rounded-[22px] bg-linear-to-br from-navy-950 to-navy-800 p-[36px_24px] text-white shadow-float lg:grid-cols-[1.1fr_1fr] lg:gap-[50px] lg:p-16"
        >
          {/* Декоративті концентрлі шеңберлер */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[120px] -top-[120px] size-[420px] rounded-full border border-gold-400/20 shadow-[0_0_0_60px_rgb(215_184_104/0.03),0_0_0_120px_rgb(215_184_104/0.025)]"
          />
          <div className="relative z-10">
            {data.eyebrow ? <Eyebrow onDark>{data.eyebrow}</Eyebrow> : null}
            <h2 className="t-h2 mt-3.5 text-white">{data.title}</h2>
            {data.text ? <p className="t-lead mt-4 text-white/75">{data.text}</p> : null}
            <div className="mt-[30px] flex flex-col gap-3 lg:flex-row">
              {data.primaryCtaLabel ? (
                <Button href="/membership/apply" className="max-lg:w-full">
                  {data.primaryCtaLabel}
                </Button>
              ) : null}
              {data.secondaryCtaLabel ? (
                <Button href="/membership/terms" variant="ghost" className="max-lg:w-full">
                  {data.secondaryCtaLabel}
                </Button>
              ) : null}
            </div>
          </div>
          <ul className="relative z-10 grid gap-2.5">
            {categories.map((category, index) => (
              <li key={category.id ?? index}>
                <Link
                  href={`/membership#category-${index + 1}`}
                  className="group flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-white/10 bg-white/5 px-5 py-4 text-[15px] transition-[transform,background-color,border-color] duration-300 ease-out-expo hover:translate-x-1 hover:border-gold-400/40 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    <b className="w-6 font-serif text-lg font-semibold text-gold-300">{roman[index]}</b>
                    {category.title}
                  </span>
                  <Icon name="arrow-right" size={16} className="shrink-0 text-gold-300 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
