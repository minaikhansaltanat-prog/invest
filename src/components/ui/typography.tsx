import { Fragment, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** Белгі (eyebrow): 12.5 px, бас әріп, әріп аралығы 0.18em. Ашық фонда gold-700, қараңғыда gold-300 */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode
  onDark?: boolean
  className?: string
}) {
  return (
    <span className={cn('t-eyebrow', onDark ? 'text-gold-300' : 'text-gold-700', className)}>{children}</span>
  )
}

/** Мәтіндегі `\n` белгісін үлкен экранда жаңа жолға айналдырады (мобильдіде бос орын) */
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <>
              <br className="hidden lg:inline" />
              <span className="lg:hidden"> </span>
            </>
          ) : null}
          {part}
        </Fragment>
      ))}
    </>
  )
}

/** `*мәтін*` белгісі алтын түсті бөлікке айналады (hero тақырыбы). Көлбеу жоқ, тек түс. */
export function AccentText({ text, accentClassName = 'text-gold-300' }: { text: string; accentClassName?: string }) {
  const parts = text.split('*')
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className={cn('not-italic', accentClassName)}>
            {part}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** Алтын сызық пен ромб: бөлім ажыратқышы */
export function Ornament({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex items-center gap-3', onDark ? 'text-gold-400' : 'text-gold-500', className)}
    >
      <i className="h-px w-14 bg-linear-to-r from-transparent to-current" />
      <svg width="9" height="9" viewBox="0 0 9 9" className="rotate-45 fill-current">
        <rect width="9" height="9" />
      </svg>
      <i className="h-px w-14 bg-linear-to-l from-transparent to-current" />
    </span>
  )
}
