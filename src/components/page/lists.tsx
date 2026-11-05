import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { Tag } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChipLink } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/icons'
import { ProjectCardSmall } from '@/components/ui/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { ServiceCell } from '@/components/ui/ServiceCell'
import { NoBreak } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import {
  getAlbums,
  getAllCatalogProjects,
  getDocuments,
  getEvents,
  getNewsList,
  getPartners,
  getPeople,
  getServices,
  getVideos,
} from '@/lib/content'
import { formatDate } from '@/lib/format'
import { mediaOf } from '@/lib/media'
import { labelOf, projectLevels, projectModels, regions, sectors } from '@/lib/taxonomy'
import type { Partner } from '@/payload-types'

// Беттің статикалық блоктарынан кейін көрсетілетін динамикалық тізімдер (ТТ 7): қызметтер, жобалар каталогы,
// жаңалықтар, іс-шаралар, бейне, фото, серіктестер, басшылық, құжаттар. Деректер Payload-тан, тек осы тілде көрінетіні.

async function Empty({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'page' })
  return (
    <EmptyState
      icon="document"
      title={t('emptyTitle')}
      text={t('emptyText')}
      action={
        <Button href="/contacts" variant="line" arrow>
          {t('emptyAction')}
        </Button>
      }
    />
  )
}

const GroupTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="t-h3 mb-6 text-navy-900">{children}</h2>
)

/** Қызметтердің 8 бағыты: басты беттегі тормен бірдей ұяшықтар */
export async function ServicesList({ locale }: { locale: Locale }) {
  const services = await getServices(locale)
  if (services.length === 0) return <Empty locale={locale} />
  return (
    <div className="grid grid-cols-1 overflow-hidden border-l border-t border-line md:grid-cols-2 lg:grid-cols-4">
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
  )
}

/** Жобалар каталогы: сала сүзгісі (сілтеме), тек жариялауға рұқсат берілген жобалар. Мысал жобалар белгімен. */
export async function ProjectsCatalog({ locale, sector }: { locale: Locale; sector?: string }) {
  const [projects, t] = await Promise.all([getAllCatalogProjects(locale), getTranslations({ locale })])
  if (projects.length === 0) return <Empty locale={locale} />

  const present = sectors.filter((entry) => projects.some((project) => project.sector === entry.value))
  const active = present.some((entry) => entry.value === sector) ? sector : undefined
  const shown = active ? projects.filter((project) => project.sector === active) : projects

  return (
    <div className="grid gap-8">
      <div role="group" aria-label={t('page.filterSector')} className="flex flex-wrap gap-2.5">
        <ChipLink href="/projects" selected={!active}>
          {t('page.allSectors')}
        </ChipLink>
        {present.map((entry) => (
          <ChipLink key={entry.value} href={`/projects?sector=${entry.value}`} selected={active === entry.value}>
            {entry.label[locale]}
          </ChipLink>
        ))}
      </div>
      <ul className="grid gap-6 lg:grid-cols-2">
        {shown.map((project, index) => {
          const image = mediaOf(project.image)
          const amount = project.amountMusd ? t('project.volumeMusd', { amount: project.amountMusd }) : ''
          const model = labelOf(projectModels, project.model, locale)
          return (
            <li key={project.id} data-testid="project-card">
              <Reveal delay={(index % 2) * 80} className="h-full">
                <ProjectCardSmall
                  className="h-full"
                  href={`/projects/${project.slug}`}
                  title={project.title ?? ''}
                  level={project.level}
                  levelLabel={labelOf(projectLevels, project.level, locale)}
                  glyph={project.iconKey ?? undefined}
                  image={image ? { src: image.src, alt: image.alt } : undefined}
                  facts={[
                    { label: t('project.region'), value: labelOf(regions, project.region, locale) },
                    { label: t('project.volumeModel'), value: [amount, model].filter(Boolean).join(' · ') },
                  ]}
                />
              </Reveal>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Жаңалықтар: күні мен санаты, тақырып, қысқа мазмұн. Басты жаңалық бірінші. */
export async function NewsList({ locale }: { locale: Locale }) {
  const [news, t] = await Promise.all([getNewsList(locale), getTranslations({ locale })])
  if (news.length === 0) return <Empty locale={locale} />
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => {
        const image = mediaOf(item.image)
        return (
          <li key={item.id}>
            <Reveal delay={(index % 3) * 70} className="h-full">
              <Link
                href={`/media/news/${item.slug}`}
                className={cn(
                  'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card',
                  'transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0',
                  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift after:transition-opacity after:duration-300 hover:after:opacity-100',
                )}
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-navy-900">
                  {image ? (
                    <>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                      />
                      <span aria-hidden="true" className="absolute inset-0 bg-navy-800/20 mix-blend-multiply" />
                    </>
                  ) : (
                    <span aria-hidden="true" className="ornament absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,var(--color-navy-700),var(--color-navy-950))]" />
                  )}
                </span>
                <span className="grid flex-1 content-start gap-3 p-6">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.05em] text-gold-700">
                    {formatDate(item.publishedAt, locale)} · {t(`news.categories.${item.category}`)}
                  </span>
                  <span className="t-h3 text-[22px] leading-[1.15] text-navy-900">
                    <NoBreak text={item.title ?? ''} />
                  </span>
                  {item.excerpt ? (
                    <span className="text-base leading-[1.65] text-muted">
                      <NoBreak text={item.excerpt} />
                    </span>
                  ) : null}
                  {item.isSample ? <Tag className="w-fit">{t('common.example')}</Tag> : null}
                </span>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}

/** Іс-шаралар: алдағы (жақын күн бірінші) және өткен (соңғысы бірінші) */
export async function EventsList({ locale }: { locale: Locale }) {
  const [events, t] = await Promise.all([getEvents(locale), getTranslations({ locale })])
  if (events.length === 0) return <Empty locale={locale} />
  const now = new Date().getTime()
  const upcoming = events.filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now)
  const past = events.filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() < now).reverse()

  const group = (title: string, items: typeof events, muted = false) =>
    items.length === 0 ? null : (
      <section>
        <GroupTitle>{title}</GroupTitle>
        <ul className="grid gap-4">
          {items.map((event) => {
            const date = new Date(event.startsAt)
            const day = new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'Asia/Almaty' }).format(date)
            const month = formatDate(date, locale).split(' ').slice(1).join(' ')
            return (
              <li
                key={event.id}
                className={cn(
                  'grid gap-5 rounded-card border border-line bg-paper p-5 shadow-card md:grid-cols-[96px_1fr_auto] md:items-center lg:p-6',
                  muted && 'opacity-85',
                )}
              >
                <span className="grid h-24 w-24 content-center justify-items-center rounded-card bg-navy-900 text-white">
                  <span className="lining font-serif text-4xl font-bold leading-none text-gold-300">{day}</span>
                  <span className="mt-1 max-w-[88px] text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-white/75">
                    {month}
                  </span>
                </span>
                <div className="grid gap-2">
                  <h3 className="t-h3 text-[22px] text-navy-900">
                    <NoBreak text={event.title ?? ''} />
                  </h3>
                  {event.summary ? <p className="text-base leading-[1.65] text-muted">{event.summary}</p> : null}
                  <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="calendar" size={16} className="text-gold-700" />
                      {formatDate(date, locale)}
                    </span>
                    {event.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="pin" size={16} className="text-gold-700" />
                        {event.location}
                      </span>
                    ) : null}
                    <Tag>{t(`page.format.${event.format}`)}</Tag>
                    {event.isSample ? <Tag>{t('common.example')}</Tag> : null}
                  </p>
                </div>
                {event.registrationUrl && !muted ? (
                  <Button href={event.registrationUrl} external variant="navy" arrow className="max-md:w-full">
                    {t('page.register')}
                  </Button>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>
    )

  return (
    <div className="grid gap-12">
      {group(t('page.upcoming'), upcoming)}
      {group(t('page.past'), past, true)}
    </div>
  )
}

/** Бейнелер: өз серверіндегі mp4 (YouTube/сыртқы embed жоқ), preload=none */
export async function VideosList({ locale }: { locale: Locale }) {
  const [videos, t] = await Promise.all([getVideos(locale), getTranslations({ locale })])
  const playable = videos.filter((video) => typeof video.file === 'object' && video.file?.url)
  if (playable.length === 0) return <Empty locale={locale} />
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {playable.map((video) => {
        const file = typeof video.file === 'object' ? video.file : null
        const poster = mediaOf(video.poster)
        return (
          <li key={video.id} className="grid gap-4 overflow-hidden rounded-card border border-line bg-paper pb-5 shadow-card">
            <video
              controls
              preload="none"
              poster={poster?.src}
              className="aspect-video w-full bg-navy-950"
              aria-label={video.title ?? undefined}
            >
              {file?.url ? <source src={file.url} type={file.mimeType ?? 'video/mp4'} /> : null}
              {t('page.videoUnsupported')}
            </video>
            <div className="grid gap-1.5 px-5">
              <h3 className="t-h3 text-[22px] text-navy-900">{video.title}</h3>
              {video.summary ? <p className="text-base leading-[1.65] text-muted">{video.summary}</p> : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Фотоальбомдар: мұқаба, атауы, суреттер саны */
export async function AlbumsList({ locale }: { locale: Locale }) {
  const [albums, t] = await Promise.all([getAlbums(locale), getTranslations({ locale })])
  if (albums.length === 0) return <Empty locale={locale} />
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => {
        const cover = mediaOf(album.cover) ?? mediaOf(album.photos?.[0]?.image)
        return (
          <li key={album.id}>
            <Link
              href={`/media/photo/${album.slug}`}
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0"
            >
              <span className="relative block aspect-[4/3] bg-navy-900">
                {cover ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                ) : null}
              </span>
              <span className="grid gap-1.5 p-5">
                <span className="t-h3 text-[22px] text-navy-900">{album.title}</span>
                <span className="text-sm text-muted">{t('page.photoCount', { count: album.photos?.length ?? 0 })}</span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function PartnerCard({ partner }: { partner: Partner }) {
  const logo = partner.showLogo ? mediaOf(partner.logo) : null
  const body = (
    <>
      <span className="grid h-20 place-items-center rounded-card border border-line bg-ivory px-4">
        {logo ? (
          <Image src={logo.src} alt={logo.alt || partner.name || ''} width={logo.width} height={logo.height} className="max-h-14 w-auto object-contain" />
        ) : (
          <span className="grid size-12 place-items-center rounded-full bg-navy-900 font-serif text-lg font-bold text-gold-300">
            {initials(partner.name ?? '')}
          </span>
        )}
      </span>
      <span className="text-base font-semibold leading-snug text-navy-900">{partner.name}</span>
      {partner.country ? <span className="text-sm text-muted">{partner.country}</span> : null}
      {partner.description ? <span className="text-[15px] leading-snug text-muted">{partner.description}</span> : null}
    </>
  )
  const cls = 'grid content-start gap-3 rounded-card border border-line bg-paper p-5 shadow-card'
  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" className={cn(cls, 'cursor-pointer transition-transform duration-300 ease-out-expo hover:-translate-y-1')}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

/** Серіктестер түрі бойынша топталады; логотип тек жазбаша рұқсатпен (showLogo), әйтпесе атауы мен монограмма */
export async function PartnersList({ locale }: { locale: Locale }) {
  const [partners, t] = await Promise.all([getPartners(locale), getTranslations({ locale })])
  if (partners.length === 0) return <Empty locale={locale} />
  const kinds = [...new Set(partners.map((partner) => partner.kind))]
  return (
    <div className="grid gap-12">
      {kinds.map((kind) => (
        <section key={kind}>
          <GroupTitle>{t(`page.partnerKind.${kind}`)}</GroupTitle>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {partners
              .filter((partner) => partner.kind === kind)
              .map((partner) => (
                <li key={partner.id}>
                  <PartnerCard partner={partner} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** Басшылық: фото (4:5) тек жариялауға келісім белгісі болғанда, әйтпесе монограмма */
export async function PeopleList({ locale }: { locale: Locale }) {
  const people = await getPeople(locale)
  if (people.length === 0) return <Empty locale={locale} />
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => {
        const photo = person.photoConsent ? mediaOf(person.photo) : null
        return (
          <li key={person.id}>
            <figure className="grid gap-5 rounded-block border border-line bg-paper p-5 shadow-lift">
              <div
                className={cn(
                  'relative aspect-[4/5] w-full overflow-hidden rounded-[12px] ring-1 ring-gold-400 ring-offset-[3px] ring-offset-paper',
                  !photo && 'grid place-items-center bg-[radial-gradient(circle_at_30%_25%,var(--color-navy-700),var(--color-navy-950))]',
                )}
              >
                {photo ? (
                  <Image
                    src={photo.src}
                    alt={person.photoAlt || photo.alt}
                    fill
                    sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <span aria-hidden="true" className="font-serif text-6xl font-bold text-gold-300">
                    {person.monogram}
                  </span>
                )}
              </div>
              <figcaption className="grid gap-1">
                <span className="t-h3 text-[24px] text-navy-900">{person.name}</span>
                <span className="text-base leading-snug text-muted">{person.position}</span>
              </figcaption>
            </figure>
          </li>
        )
      })}
    </ul>
  )
}

/** Құжаттар мен есептер: PDF жүктеу, нұсқа, күн; бекітілмеген әдістеме «Жоба» белгісімен */
export async function DocumentsList({ locale, mode }: { locale: Locale; mode: 'documents' | 'reports' }) {
  const [all, t] = await Promise.all([getDocuments(locale), getTranslations({ locale })])
  const documents = all.filter((doc) => (mode === 'reports' ? doc.category === 'report' : doc.category !== 'report'))
  if (documents.length === 0) return <Empty locale={locale} />
  return (
    <ul className="grid divide-y divide-line rounded-card border border-line bg-paper shadow-card">
      {documents.map((doc) => {
        const file = typeof doc.file === 'object' && doc.file?.url ? doc.file : null
        return (
          <li key={doc.id} className="grid items-center gap-4 p-5 md:grid-cols-[auto_1fr_auto] lg:px-7">
            <span className="grid size-12 place-items-center rounded-full bg-sand text-gold-700 ring-1 ring-gold-400/50">
              <Icon name="document" size={22} strokeWidth={1.6} />
            </span>
            <div className="grid gap-1.5">
              <h3 className="text-base font-semibold leading-snug text-navy-900">{doc.title}</h3>
              {doc.summary ? <p className="text-[15px] leading-snug text-muted">{doc.summary}</p> : null}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <Tag>{t(`page.docCategory.${doc.category}`)}</Tag>
                {doc.isDraftMethod ? <Tag className="bg-warn-bg text-warn-ink">{t('page.docDraft')}</Tag> : null}
                {doc.version ? <span>{t('page.docVersion', { version: doc.version })}</span> : null}
                {doc.publishedAt ? <span>{formatDate(doc.publishedAt, locale)}</span> : null}
              </p>
            </div>
            {file?.url ? (
              <Button href={file.url} external variant="line" className="max-md:w-full">
                {t('page.docDownload')}
              </Button>
            ) : (
              <span className="text-sm text-muted">{t('page.docNoFile')}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
