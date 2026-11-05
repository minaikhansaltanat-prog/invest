import type { ReactNode } from 'react'

import { Accordion } from '@/components/ui/Accordion'
import { Tag } from '@/components/ui/Badge'
import { Icon, type IconName, ServiceGlyph, type ServiceIconName, serviceIconNames, uiIconNames } from '@/components/ui/icons'
import { Reveal } from '@/components/ui/Reveal'
import { DataTable } from '@/components/ui/Table'
import { NoBreak } from '@/components/ui/typography'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { visibleHref } from '@/lib/mode'
import { parseRich, type RichInline } from '@/lib/rich'
import type { Page } from '@/payload-types'

export type PageBlock = NonNullable<Page['blocks']>[number]

/** Бөлім ішіндегі тақырыптың якорь id-і: беттің оң жақ мазмұн тізімі (TOC) осыған сілтейді */
export const blockAnchor = (block: PageBlock, index: number) => `section-${block.id ?? index}`

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href)

function AnyLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

function Glyph({ name, size }: { name: string; size: number }) {
  if ((uiIconNames as string[]).includes(name)) return <Icon name={name as IconName} size={size} strokeWidth={1.6} />
  if ((serviceIconNames as string[]).includes(name)) return <ServiceGlyph name={name as ServiceIconName} size={size} />
  return null
}

const Inline = ({ parts }: { parts: RichInline[] }) => (
  <>
    {parts.map((part, index) =>
      part.bold ? (
        <strong key={index} className="font-semibold text-navy-900">
          {part.text}
        </strong>
      ) : (
        <span key={index}>
          <NoBreak text={part.text} />
        </span>
      ),
    )}
  </>
)

function Rich({ text }: { text: string }) {
  return (
    <div className="grid max-w-[70ch] gap-5">
      {parseRich(text).map((node, index) =>
        node.type === 'p' ? (
          <p key={index} className="t-body text-ink">
            <Inline parts={node.inline} />
          </p>
        ) : (
          <ul key={index} className="grid gap-2.5">
            {node.items.map((item, i) => (
              <li
                key={i}
                className="t-body relative pl-7 text-ink before:absolute before:left-1 before:top-[0.72em] before:size-2 before:rotate-45 before:bg-gold-500"
              >
                <Inline parts={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

function Head({ id, heading, lead }: { id: string; heading?: string | null; lead?: string | null }) {
  if (!heading && !lead) return null
  return (
    <div className="mb-8 grid gap-3 lg:mb-10">
      {heading ? (
        <h2 id={id} className="t-h2 scroll-mt-28 text-navy-900">
          <NoBreak text={heading} />
        </h2>
      ) : null}
      {lead ? (
        <p className="t-lead max-w-[680px] text-muted">
          <NoBreak text={lead} />
        </p>
      ) : null}
    </div>
  )
}

const columnClass = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-2 xl:grid-cols-3', '4': 'md:grid-cols-2 xl:grid-cols-4' }

const noticeTone = {
  info: { box: 'border-navy-600/25 bg-info-bg', icon: 'info' as const, iconClass: 'text-navy-600' },
  caution: { box: 'border-warn-line bg-warn-bg', icon: 'alert' as const, iconClass: 'text-gold-700' },
  legal: { box: 'border-gold-500/40 bg-sand', icon: 'shield' as const, iconClass: 'text-gold-700' },
}

function BlockView({ block, id }: { block: PageBlock; id: string }) {
  switch (block.blockType) {
    case 'paragraphs':
      return (
        <div>
          <Head id={id} heading={block.heading} lead={block.lead} />
          <Rich text={block.text} />
        </div>
      )

    case 'cards': {
      const columns = block.columns ?? '3'
      return (
        <div>
          <Head id={id} heading={block.heading} lead={block.lead} />
          <ul className={cn('grid gap-5 lg:gap-6', columnClass[columns])}>
            {(block.items ?? []).map((rawItem, index) => {
              // Corporate режимінде жасырын бетке апаратын сілтеме жоқ: карточка статикалық болады
              const item = { ...rawItem, href: visibleHref(rawItem.href) }
              const inner = (
                <>
                  <span className="flex items-start justify-between gap-3">
                    {item.icon ? (
                      <span className="grid size-12 place-items-center rounded-full bg-sand text-gold-700 ring-1 ring-gold-400/50">
                        <Glyph name={item.icon} size={item.icon === 'globe' || uiIconNames.includes(item.icon as IconName) ? 24 : 30} />
                      </span>
                    ) : (
                      <span aria-hidden="true" className="mt-1 h-px w-8 bg-gold-500" />
                    )}
                    {item.badge ? <Tag>{item.badge}</Tag> : null}
                  </span>
                  <span className="t-h3 text-[22px] leading-[1.15] text-navy-900 lg:text-2xl">
                    <NoBreak text={item.title} />
                  </span>
                  {item.text ? (
                    <span className="text-base leading-[1.65] text-muted">
                      <NoBreak text={item.text} />
                    </span>
                  ) : null}
                  {item.href ? (
                    <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-1 font-semibold text-navy-700 transition-colors duration-200 group-hover:text-navy-900">
                      <Icon name="arrow-right" size={16} className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1 rtl:rotate-180" />
                    </span>
                  ) : null}
                </>
              )
              const cardClass =
                'group relative flex h-full flex-col gap-4 rounded-card border border-line bg-paper p-6 shadow-card lg:p-7'
              return (
                <li key={item.id ?? index}>
                  <Reveal delay={(index % 3) * 70} className="h-full">
                    {item.href ? (
                      <AnyLink
                        href={item.href}
                        className={cn(
                          cardClass,
                          'cursor-pointer transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0',
                          'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift after:transition-opacity after:duration-300 hover:after:opacity-100',
                        )}
                      >
                        {inner}
                      </AnyLink>
                    ) : (
                      <div className={cardClass}>{inner}</div>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    case 'steps':
      return (
        <div>
          <Head id={id} heading={block.heading} lead={block.lead} />
          <ol className="grid max-w-[820px] gap-0">
            {(block.items ?? []).map((item, index, all) => (
              <li
                key={item.id ?? index}
                className={cn(
                  'relative grid grid-cols-[48px_1fr] gap-x-5 pb-8 last:pb-0 lg:grid-cols-[56px_1fr] lg:gap-x-6',
                  index < all.length - 1 &&
                    'before:absolute before:bottom-0 before:left-6 before:top-12 before:w-px before:bg-gold-500/40 lg:before:left-7 lg:before:top-14',
                )}
              >
                <span className="lining relative z-10 grid size-12 place-items-center rounded-full bg-linear-to-b from-gold-400 to-gold-600 font-serif text-xl font-bold text-navy-950 shadow-gold lg:size-14 lg:text-[22px]">
                  {index + 1}
                </span>
                <div className="grid content-start gap-2 pt-1.5">
                  <h3 className="text-lg font-semibold leading-snug text-navy-900">
                    <NoBreak text={item.title} />
                  </h3>
                  {item.text ? (
                    <p className="t-body text-muted">
                      <NoBreak text={item.text} />
                    </p>
                  ) : null}
                  {item.meta ? <Tag className="w-fit">{item.meta}</Tag> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )

    case 'facts':
      return (
        <div>
          <Head id={id} heading={block.heading} />
          <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(block.items ?? []).map((item, index) => (
              <div
                key={item.id ?? index}
                className="grid content-start gap-1.5 rounded-card border border-line bg-paper px-5 py-4 shadow-lift"
              >
                <dt className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-gold-700">{item.label}</dt>
                <dd className="text-base font-semibold leading-snug text-navy-900">
                  <NoBreak text={item.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'faq':
      return (
        <div>
          <Head id={id} heading={block.heading} />
          <Accordion
            className="max-w-[820px] rounded-card border border-line bg-paper px-5 shadow-card lg:px-7"
            items={(block.items ?? []).map((item, index) => ({
              id: item.id ?? String(index),
              title: item.q,
              content: <Rich text={item.a} />,
            }))}
          />
        </div>
      )

    case 'table': {
      const columns = (block.columns ?? []).map((column, index) => ({
        key: column.id ?? String(index),
        header: column.text,
        render: (row: { cells: string[] }) => row.cells[index] ?? '',
      }))
      const rows = (block.rows ?? []).map((row, index) => ({
        key: row.id ?? String(index),
        cells: (row.cells ?? []).map((cell) => cell.text ?? ''),
      }))
      return (
        <div>
          <Head id={id} heading={block.heading} />
          <DataTable caption={block.caption} columns={columns} rows={rows} rowKey={(row) => row.key} />
        </div>
      )
    }

    case 'notice': {
      const tone = noticeTone[block.tone]
      return (
        <aside
          role="note"
          className={cn('flex max-w-[860px] items-start gap-4 rounded-card border px-5 py-5 lg:px-7 lg:py-6', tone.box)}
        >
          <Icon name={tone.icon} size={22} className={cn('mt-0.5 shrink-0', tone.iconClass)} />
          <div className="grid gap-2">
            {block.title ? (
              <h2 id={id} className="scroll-mt-28 text-base font-semibold text-navy-900">
                {block.title}
              </h2>
            ) : null}
            <Rich text={block.text} />
          </div>
        </aside>
      )
    }

    case 'links':
      return (
        <div>
          <Head id={id} heading={block.heading} />
          <ul className="grid max-w-[860px] divide-y divide-line rounded-card border border-line bg-paper shadow-card">
            {(block.items ?? []).map((rawItem, index) => {
              // Corporate режимінде жасырын бетке апаратын жол тізімнен алынады
              const href = visibleHref(rawItem.href)
              if (rawItem.href && !href) return null
              const item = { ...rawItem, href }
              return (
                <li key={item.id ?? index}>
                  {item.href ? (
                    <AnyLink
                      href={item.href}
                      className="group flex min-h-14 cursor-pointer items-center justify-between gap-5 px-5 py-4 transition-colors duration-200 hover:bg-ivory lg:px-7"
                    >
                      <span className="grid gap-0.5">
                        <span className="text-base font-semibold text-navy-900">{item.label}</span>
                        {item.text ? <span className="text-[15px] leading-snug text-muted">{item.text}</span> : null}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={18}
                        className="shrink-0 text-gold-700 transition-transform duration-200 ease-out-expo group-hover:translate-x-1 rtl:rotate-180"
                      />
                    </AnyLink>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </div>
      )

    default:
      return null
  }
}

/** Беттің блоктарын реттелген бөлімдер ретінде көрсетеді (әр бөлім скроллда жеңіл пайда болады) */
export function Blocks({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Reveal
          key={block.id ?? index}
          as="section"
          className={cn(
            index > 0 && 'border-t border-line pt-12 lg:pt-14',
            index < blocks.length - 1 && 'pb-12 lg:pb-14',
          )}
        >
          <BlockView block={block} id={blockAnchor(block, index)} />
        </Reveal>
      ))}
    </>
  )
}

/** Беттің оң жақ мазмұн тізімі үшін тақырыптар (тек атауы бар бөлімдер) */
export function tocItems(blocks: PageBlock[]): { id: string; label: string }[] {
  return blocks.flatMap((block, index) => {
    const label = block.blockType === 'notice' ? block.title : 'heading' in block ? block.heading : null
    return label ? [{ id: blockAnchor(block, index), label }] : []
  })
}
