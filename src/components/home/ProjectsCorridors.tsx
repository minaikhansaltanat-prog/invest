import { getTranslations } from 'next-intl/server'

import { ChipLink } from '@/components/ui/Chip'
import { Tag } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/icons'
import { ProjectCardBig, ProjectCardSmall } from '@/components/ui/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { Button } from '@/components/ui/Button'
import { Eyebrow, Lines } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { mediaOf } from '@/lib/media'
import { labelOf, projectModels, regions, sectors } from '@/lib/taxonomy'
import type { Home, Project } from '@/payload-types'

const chipSectors = ['all', 'industry', 'energy', 'logistics', 'agro', 'infrastructure'] as const

/** Жобалар қоры (8-блок): сала чиптері, 1 үлкен + 2 шағын карточка. Тек жариялауға рұқсат берілген жобалар */
export async function ProjectsSection({
  data,
  projects,
  levelTitles,
  locale,
  showExampleBadge,
}: {
  data: NonNullable<Home['projects']>
  projects: Project[]
  levelTitles: string[]
  locale: Locale
  showExampleBadge: boolean
}) {
  if (projects.length === 0) return null
  const t = await getTranslations({ locale })
  const label = (key: 'region' | 'volume' | 'model' | 'volumeModel') => t(`project.${key}`)

  const bigIndex = Math.max(0, projects.findIndex((project) => mediaOf(project.image)))
  const big = projects[bigIndex]
  const small = projects.filter((_, index) => index !== bigIndex).slice(0, 2)

  const level = (project: Project) =>
    t('project.levelFormat', { n: project.level, title: levelTitles[Number(project.level) - 1] ?? '' })
  const region = (project: Project) => labelOf(regions, project.region, locale)
  const amount = (project: Project) => (project.amountMusd ? t('project.volumeMusd', { amount: project.amountMusd }) : '')
  const model = (project: Project) => labelOf(projectModels, project.model, locale)

  const bigImage = mediaOf(big.image)
  const chips = data.chips ?? []

  return (
    <section className="section-y">
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
                    href="/projects"
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
        {chips.length > 0 ? (
          <Reveal className="mb-7 flex flex-wrap gap-2" delay={60}>
            {chips.map((chip, index) => {
              const sector = chipSectors[index] ?? 'all'
              return (
                <ChipLink key={chip.id ?? index} href={sector === 'all' ? '/projects' : `/projects?sector=${sector}`} selected={index === 0}>
                  {chip.label}
                </ChipLink>
              )
            })}
          </Reveal>
        ) : null}
        <div className="grid gap-[22px] lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="h-full">
            <ProjectCardBig
              className="h-full"
              href={`/projects/${big.slug}`}
              title={big.title ?? ''}
              level={big.level}
              levelLabel={level(big)}
              sector={[labelOf(sectors, big.sector, locale), big.subSector].filter(Boolean).join(' · ')}
              image={bigImage ? { src: bigImage.src, alt: bigImage.alt } : { src: '', alt: '' }}
              lockLabel={t('project.ndaLock')}
              actionLabel={t('project.passport')}
              facts={[
                { label: label('region'), value: region(big) },
                { label: label('volume'), value: amount(big) },
                { label: label('model'), value: model(big) },
              ]}
            />
          </Reveal>
          <div className="grid content-start gap-[22px]">
            {small.map((project, index) => {
              const image = mediaOf(project.image)
              return (
                <Reveal key={project.id} delay={(index + 1) * 90}>
                  <ProjectCardSmall
                    href={`/projects/${project.slug}`}
                    title={project.title ?? ''}
                    level={project.level}
                    levelLabel={level(project)}
                    glyph={project.iconKey ?? undefined}
                    image={image ? { src: image.src, alt: image.alt } : undefined}
                    facts={[
                      { label: label('region'), value: region(project) },
                      { label: label('volumeModel'), value: [amount(project), model(project)].filter(Boolean).join(' · ') },
                    ]}
                  />
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Инвестициялық дәліздер (9-блок): үлкен Қытай карточкасы + Парсы шығанағы + Еуропа және Азия */
export async function CorridorsSection({ data, locale }: { data: NonNullable<Home['corridors']>; locale: Locale }) {
  const china = data.china
  const gulf = data.gulf
  const global = data.global
  const t = await getTranslations({ locale })
  const isZh = locale === 'zh'

  return (
    <section className="pb-[var(--section-y)]">
      <div className="wrap">
        <Reveal>
          <SectionHead eyebrow={data.eyebrow ?? undefined} title={data.title ?? ''} />
        </Reveal>
        <div className="grid gap-[22px] lg:grid-cols-[1.5fr_1fr]">
          {china ? (
            <Reveal className="h-full">
              <div
                data-surface="dark"
                className="on-dark grain relative grid h-full content-between gap-9 overflow-hidden rounded-block bg-navy-900 p-[26px] py-[34px] text-white shadow-lift lg:min-h-[470px] lg:p-[52px] lg:pb-12"
              >
                {/* Үлкен «中» иероглифі: фондағы белгі */}
                <span
                  aria-hidden="true"
                  lang="zh-CN"
                  className="pointer-events-none absolute -bottom-[110px] -right-[30px] z-0 select-none font-zh-serif text-[420px] font-bold leading-none text-gold-400/[0.07]"
                >
                  中
                </span>
                <span aria-hidden="true" className="ornament absolute inset-0 opacity-50" />
                <div className="relative z-10">
                  {china.eyebrow ? <Eyebrow onDark>{china.eyebrow}</Eyebrow> : null}
                  <h3 className="mb-2 mt-4 font-serif text-[38px] font-semibold leading-[1.02] tracking-[-0.02em] lg:text-[52px]">
                    {china.title}
                  </h3>
                  {china.zhTitle ? (
                    <p lang="zh-CN" className="font-zh-serif text-[22px] tracking-[0.08em] text-gold-300 lg:text-[26px]">
                      {china.zhTitle}
                    </p>
                  ) : null}
                  {china.text ? <p className="mt-5 max-w-[520px] text-white/75">{china.text}</p> : null}
                  <ul className="mt-7 grid max-w-[600px] gap-x-7 gap-y-3 lg:grid-cols-2">
                    {(china.bullets ?? []).map((bullet) => (
                      <li key={bullet.id ?? bullet.text} className="flex items-start gap-2.5 text-base text-white/85 lg:text-[14.5px]">
                        <i aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-400" />
                        {bullet.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative z-10 flex flex-col gap-3 lg:flex-row">
                  {isZh ? (
                    <Button href="/investors/china" arrow className="max-lg:w-full">
                      <span lang="zh-CN">{china.zhTitle}</span>
                    </Button>
                  ) : china.primaryCtaLabel ? (
                    // «进入中文版»: басқа тілдердегі бетте қытай нұсқасына ауыстырады
                    <Button href="/" locale="zh" lang="zh-CN" arrow className="max-lg:w-full">
                      {china.primaryCtaLabel}
                    </Button>
                  ) : null}
                  {china.secondaryCtaLabel ? (
                    <Button href="/contacts#wechat" variant="ghost" className="max-lg:w-full">
                      {china.secondaryCtaLabel}
                    </Button>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ) : null}
          <div className="grid gap-[22px]">
            {[
              { card: gulf, href: '/investors/gulf', arabic: true },
              { card: global, href: '/investors/global', arabic: false },
            ].map(({ card, href, arabic }, index) =>
              card ? (
                <Reveal key={href} delay={(index + 1) * 90}>
                  <div className="group grid h-full content-start gap-3 rounded-block border border-line bg-paper p-[34px] shadow-card transition-transform duration-300 ease-out-expo hover:-translate-y-1">
                    {card.tag ? (
                      <span
                        lang={arabic ? 'ar' : undefined}
                        dir={arabic ? 'rtl' : undefined}
                        className={arabic ? 'text-left font-zh-serif text-xl text-gold-700' : 'font-serif text-xl font-semibold tracking-[0.04em] text-gold-700'}
                      >
                        {card.tag}
                      </span>
                    ) : null}
                    <h3 className="t-h3 text-navy-900">
                      <Lines text={card.title ?? ''} />
                    </h3>
                    <p className="text-base leading-relaxed text-muted lg:text-[15px]">{card.text}</p>
                    <Link href={href} className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-navy-700 hover:text-navy-900">
                      {card.linkLabel ?? t('common.readMore')}
                      <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Reveal>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
