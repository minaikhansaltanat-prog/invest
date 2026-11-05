import { Fragment, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * Белгі (eyebrow): 12.5 px, бас әріп, әріп аралығы 0.18em. Алдында қысқа алтын сызық (бренд түсі, мәтін емес).
 * Ашық фонда мәтін gold-700 (WCAG AA 4.5:1), қараңғыда gold-300; `hero` нұсқасы дизайн үлгісіндегідей gold-500.
 */
export function Eyebrow({
  children,
  onDark = false,
  tone,
  rule = true,
  className,
}: {
  children: ReactNode
  onDark?: boolean
  tone?: 'hero'
  rule?: boolean
  className?: string
}) {
  const text = tone === 'hero' ? 'text-gold-500' : onDark ? 'text-gold-300' : 'text-gold-700'
  const line = onDark || tone === 'hero' ? 'bg-gold-400' : 'bg-gold-500'
  return (
    <span className={cn('t-eyebrow inline-flex items-center gap-3', text, className)}>
      {rule ? <i aria-hidden="true" className={cn('h-px w-7 shrink-0', line)} /> : null}
      <span>{children}</span>
    </span>
  )
}

/**
 * Мәтіндегі `\n` белгісі: үлкен экранда жаңа жол, мобильдіде бос орын.
 * Қытай тілінде әрқашан жаңа жол: иероглифті мәтіннің үзілімі «сөзді» (哈萨克斯坦, 账目) бөліп жібермеуі үшін
 * үзілімді редактор қояды.
 */
export function Lines({ text }: { text: string }) {
  const parts = text.split('\n')
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <>
              <br className="hidden lg:inline [&:lang(zh)]:inline" />
              <span className="lg:hidden [&:lang(zh)]:hidden"> </span>
            </>
          ) : null}
          {part}
        </Fragment>
      ))}
    </>
  )
}

// Тек латын, кирилл әріптері мен сандар: қытай иероглифтері бар мәтін (2026-2028年战略发展规划) бүтін nowrap болып кетпеуі үшін
const word = '[\\p{Script=Latin}\\p{Script=Cyrillic}\\p{N}]+'
const hyphenated = new RegExp(`(${word}(?:-${word})+)`, 'gu')

/**
 * Дефисті сөздер мен сан аралықтары («іс-шаралар», «2026-2028») жолдың ортасында үзілмейді (nowrap).
 * Дизайн үлгісінде бұл қолмен жасалған; CMS мәтініне автоматты түрде қолданылады.
 */
export function NoBreak({ text }: { text: string }) {
  return (
    <>
      {text.split(hyphenated).map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
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
            <Lines text={part} />
          </em>
        ) : (
          <Fragment key={index}>
            <Lines text={part} />
          </Fragment>
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
