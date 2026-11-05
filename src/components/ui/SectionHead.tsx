import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Eyebrow, Lines, NoBreak } from './typography'

/** Бөлім тақырыбы: белгі, H2, сипаттама және оң жақтағы әрекет (сілтеме, белгі) */
export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  onDark = false,
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string
  title: string
  lead?: string
  action?: ReactNode
  onDark?: boolean
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col items-start gap-5 lg:mb-[52px] lg:flex-row lg:items-end lg:justify-between lg:gap-10',
        className,
      )}
    >
      <div className="grid gap-4">
        {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
        <Heading className={cn('t-h2', onDark ? 'text-white' : 'text-navy-900')}>
          <Lines text={title} />
        </Heading>
        {lead ? (
          <p className={cn('t-lead max-w-[620px]', onDark ? 'text-white/70' : 'text-muted')}>
            <NoBreak text={lead} />
          </p>
        ) : null}
      </div>
      {action ? <div className="flex flex-wrap items-center gap-3.5">{action}</div> : null}
    </div>
  )
}
