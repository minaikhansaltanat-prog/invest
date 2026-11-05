import Image from 'next/image'
import { Fragment } from 'react'

import emblem from '@/assets/images/emblem.png'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import type { Setting } from '@/payload-types'

/**
 * Логотип + атау (ТТ 12.3): атаудың мәтіндік бөлігі сурет емес, HTML мәтіні (аударылады және іздеуге түседі).
 * Мобильдіде ағылшынша қосымша атау жасырылады.
 */
export function Brand({
  settings,
  onDark = false,
  priority = true,
  className,
}: {
  settings: Pick<Setting, 'brandName' | 'brandSubtitle'>
  onDark?: boolean
  /** Көрінбейтін көшірмелер (мобильді мәзір панелі) үшін false */
  priority?: boolean
  className?: string
}) {
  const lines = (settings.brandName ?? '').split('\n')

  // Қолжетімді атау = көрінетін атау мәтіні (WCAG 2.5.3: aria-label көрінетін мәтінмен сәйкес болуы тиіс)
  return (
    <Link href="/" className={cn('group flex min-h-11 items-center gap-3.5 rounded-lg', className)}>
      {onDark ? (
        // Қараңғы фонда логотип ақ дөңгелек плашкада (ТТ 12.3): нави элементтер фонға сіңіп кетпейді
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-float">
          <Image src={emblem} alt="" priority={priority} sizes="56px" className="h-auto w-full" />
        </span>
      ) : (
        <Image
          src={emblem}
          alt=""
          priority={priority}
          sizes="(min-width: 1080px) 90px, 68px"
          className="h-[50px] w-auto transition-transform duration-500 ease-out-expo group-hover:scale-105 lg:h-[66px]"
        />
      )}
      <span className="grid gap-[3px]">
        <span
          className={cn(
            'text-[11px] font-bold uppercase leading-tight tracking-[0.06em] lg:text-[13.5px]',
            onDark ? 'text-white' : 'text-navy-900',
          )}
        >
          {lines.map((line, index) => (
            <Fragment key={index}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </span>
        {settings.brandSubtitle ? (
          <span className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.06em] text-gold-700 xl:block">
            {settings.brandSubtitle}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
