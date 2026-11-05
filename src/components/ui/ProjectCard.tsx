import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { LevelBadge, type LevelValue } from './Badge'
import { Icon, ProjectGlyph, type ProjectGlyphName } from './icons'

export type ProjectFact = { label: string; value: string }

type ProjectImage = { src: string; alt: string; width?: number; height?: number }

type Common = {
  href: string
  title: string
  level: LevelValue
  levelLabel: string
  facts: ProjectFact[]
}

function Facts({ facts, cols }: { facts: ProjectFact[]; cols: 2 | 3 }) {
  return (
    <dl className={cn('grid gap-x-4 gap-y-2.5 border-t border-line pt-4', cols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2')}>
      {facts.map((fact) => (
        <div key={fact.label} className="grid gap-0.5">
          <dt className="text-xs text-muted">{fact.label}</dt>
          <dd className="text-base font-semibold text-navy-900">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Үлкен жоба карточкасы: сурет, деңгей белгісі, сала, атау, 3 дерек, NDA жазуы */
export function ProjectCardBig({
  href,
  title,
  level,
  levelLabel,
  facts,
  sector,
  image,
  lockLabel,
  actionLabel,
  priority = false,
  className,
}: Common & {
  sector: string
  image: ProjectImage
  lockLabel: string
  actionLabel: string
  priority?: boolean
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card',
        'transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift after:transition-opacity after:duration-300 hover:after:opacity-100',
        className,
      )}
    >
      <div className="relative h-[220px] overflow-hidden bg-navy-800 lg:h-[330px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1080px) 700px, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-navy-800/25 mix-blend-multiply" />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-transparent to-transparent" />
        <LevelBadge level={level} variant="overlay" className="absolute left-[18px] top-[18px]">
          {levelLabel}
        </LevelBadge>
      </div>
      <div className="grid flex-1 gap-4 p-[26px] pb-7">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-700">{sector}</span>
        <h3 className="t-h3 text-navy-900 lg:text-[30px]">{title}</h3>
        <Facts facts={facts} cols={3} />
        <span className="flex items-center justify-between gap-3 text-sm font-semibold text-navy-700">
          <span className="flex items-center gap-2 font-medium text-muted">
            <Icon name="lock" size={16} />
            {lockLabel}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
            {actionLabel}
            <Icon name="arrow-right" size={15} />
          </span>
        </span>
      </div>
    </Link>
  )
}

/** Шағын жоба карточкасы: сол жағында иконка немесе сурет, оң жағында деректер */
export function ProjectCardSmall({
  href,
  title,
  level,
  levelLabel,
  facts,
  glyph,
  image,
  className,
}: Common & {
  glyph?: ProjectGlyphName
  image?: ProjectImage
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card lg:flex-row',
        'transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift after:transition-opacity after:duration-300 hover:after:opacity-100',
        className,
      )}
    >
      <div className="relative grid h-[120px] shrink-0 place-items-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_20%,var(--color-navy-700),var(--color-navy-950))] lg:h-auto lg:w-[168px]">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="168px" className="object-cover" />
        ) : glyph ? (
          <ProjectGlyph
            name={glyph}
            className="text-gold-300 transition-transform duration-500 ease-out-expo group-hover:scale-110"
          />
        ) : null}
        <span aria-hidden="true" className="ornament absolute inset-0 opacity-60" />
      </div>
      <div className="grid flex-1 content-start gap-3 p-[22px] lg:px-6">
        <LevelBadge level={level}>{levelLabel}</LevelBadge>
        <h3 className="t-h3 text-navy-900 lg:text-2xl">{title}</h3>
        <Facts facts={facts} cols={2} />
      </div>
    </Link>
  )
}
