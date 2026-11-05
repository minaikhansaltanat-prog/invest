import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { LevelBadge, Tag } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/icons'
import { Reveal } from '@/components/ui/Reveal'
import { NoBreak } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { mediaOf } from '@/lib/media'
import { labelOf, projectLevels, projectModels, projectStages, regions, sectors } from '@/lib/taxonomy'
import type { Album, News, Project } from '@/payload-types'

/** Жоба беті (ашық бөлік): қысқа сипаттама, негізгі деректер. Толық паспорт пен деректер бөлмесі NDA-дан кейін (7-кезең). */
export async function ProjectBody({ locale, project }: { locale: Locale; project: Project }) {
  const t = await getTranslations({ locale })
  const image = mediaOf(project.image)
  const facts = [
    { label: t('page.project.sector'), value: [labelOf(sectors, project.sector, locale), project.subSector].filter(Boolean).join(' · ') },
    { label: t('project.region'), value: labelOf(regions, project.region, locale) },
    { label: t('project.volume'), value: project.amountMusd ? t('project.volumeMusd', { amount: project.amountMusd }) : '' },
    { label: t('project.model'), value: labelOf(projectModels, project.model, locale) },
    { label: t('page.project.stage'), value: labelOf(projectStages, project.stage, locale) },
    { label: t('page.project.level'), value: labelOf(projectLevels, project.level, locale) },
  ].filter((fact) => fact.value)

  return (
    <div className="wrap grid gap-10 pt-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14 lg:pt-16">
      <div className="grid min-w-0 content-start gap-10">
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-block bg-navy-900 shadow-card">
            <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1080px) 760px, 100vw" className="object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-navy-800/20 mix-blend-multiply" />
            <LevelBadge level={project.level} variant="overlay" className="absolute left-5 top-5">
              {t('project.levelFormat', { n: project.level, title: labelOf(projectLevels, project.level, locale).split(': ')[1] ?? '' })}
            </LevelBadge>
          </div>
        ) : null}
        <section className="grid gap-4">
          <h2 className="t-h2 text-navy-900">{t('page.project.summaryTitle')}</h2>
          {project.summary ? (
            <p className="t-lead max-w-[70ch] text-ink">
              <NoBreak text={project.summary} />
            </p>
          ) : null}
          {project.isSample ? <Tag className="w-fit">{t('common.example')}</Tag> : null}
        </section>
        <section className="grid gap-5">
          <h2 className="t-h3 text-navy-900">{t('page.project.factsTitle')}</h2>
          <dl className="grid gap-4 md:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-1.5 rounded-card border border-line bg-paper px-5 py-4 shadow-lift">
                <dt className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-gold-700">{fact.label}</dt>
                <dd className="text-base font-semibold leading-snug text-navy-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-block bg-navy-900 p-7 text-white shadow-float">
            <span aria-hidden="true" className="ornament absolute inset-0" />
            <div className="relative z-10 grid gap-4">
              <span className="grid size-12 place-items-center rounded-full border border-gold-400/60 bg-white/5 text-gold-300">
                <Icon name="lock" size={22} strokeWidth={1.6} />
              </span>
              <h2 className="t-h3 text-white">{t('page.project.ndaTitle')}</h2>
              <p className="text-base leading-[1.65] text-white/70">{t('page.project.ndaText')}</p>
              <Button href="/investors/apply" arrow full>
                {t('page.project.ndaAction')}
              </Button>
              <Link
                href="/projects/levels"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-300 underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-gold-300"
              >
                {t('page.project.levelsLink')}
              </Link>
            </div>
          </div>
        </Reveal>
      </aside>
    </div>
  )
}

/** Жаңалық беті: басты сурет, қысқа мазмұн (lead), мәтін (Lexical), мысал белгісі */
export async function NewsBody({ locale, item }: { locale: Locale; item: News }) {
  const t = await getTranslations({ locale })
  const image = mediaOf(item.image)
  return (
    <article className="wrap grid gap-10 pt-12 lg:pt-16">
      {image ? (
        <div className="relative aspect-[16/8] overflow-hidden rounded-block bg-navy-900 shadow-card">
          <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-navy-800/20 mix-blend-multiply" />
        </div>
      ) : null}
      <div className="grid max-w-[760px] gap-6">
        {item.excerpt ? (
          <p className="t-lead text-ink">
            <NoBreak text={item.excerpt} />
          </p>
        ) : null}
        {item.body ? (
          <div className="grid gap-5 text-base leading-[1.7] text-ink [&_a]:font-semibold [&_a]:text-navy-700 [&_a]:underline [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-navy-900 [&_li]:ml-5 [&_li]:list-disc">
            <RichText data={item.body} />
          </div>
        ) : null}
        {item.isSample ? <Tag className="w-fit">{t('common.example')}</Tag> : null}
      </div>
    </article>
  )
}

/** Фотоальбом беті: суреттер торы (lazy, өлшемге сай sizes) */
export async function AlbumBody({ locale, album }: { locale: Locale; album: Album }) {
  const t = await getTranslations({ locale })
  const photos = (album.photos ?? []).flatMap((photo) => {
    const image = mediaOf(photo.image)
    return image ? [{ id: photo.id ?? image.src, image, caption: photo.caption }] : []
  })
  return (
    <div className="wrap grid gap-8 pt-12 lg:pt-16">
      {album.description ? <p className="t-lead max-w-[70ch] text-ink">{album.description}</p> : null}
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {photos.map(({ id, image, caption }, index) => (
          <li key={id}>
            <figure className="grid gap-2.5">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-card bg-navy-900 shadow-card">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="object-cover"
                />
              </span>
              {caption ? <figcaption className="text-sm leading-snug text-muted">{caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">{t('page.photoCount', { count: photos.length })}</p>
    </div>
  )
}
