import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** «Мысал ретінде көрсетілген» және ұқсас шағын белгілер */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-sand px-[11px] py-[5px] text-xs font-semibold text-gold-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

export type LevelValue = '1' | '2' | '3' | '4'

/**
 * Жоба деңгейінің белгісі (ТТ 8.3).
 * overlay: суреттің үстінде (қараңғы шыны), soft: карточка ішінде (2: көк, 3: жасыл)
 */
export function LevelBadge({
  level,
  children,
  variant = 'soft',
  className,
}: {
  level: LevelValue
  children: ReactNode
  variant?: 'overlay' | 'soft'
  className?: string
}) {
  if (variant === 'overlay') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-navy-950/80 px-3 py-[7px] text-[12.5px] font-semibold text-white backdrop-blur-md',
          className,
        )}
      >
        <i aria-hidden="true" className="size-[7px] rounded-full bg-success-dot" />
        {children}
      </span>
    )
  }
  const tone = level === '3' || level === '4' ? 'bg-success-bg text-success' : 'bg-info-bg text-navy-700'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] justify-self-start rounded-full px-2.5 py-[5px] text-xs font-semibold',
        tone,
        className,
      )}
    >
      {children}
    </span>
  )
}
