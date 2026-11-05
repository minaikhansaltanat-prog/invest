import type { ElementType, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type CardProps = {
  as?: ElementType
  /** base: беттің өзінде, elevated: көтерілген (көлеңке), floating: үстіңгі қабат (мәзір, модаль) */
  level?: 'base' | 'elevated' | 'floating'
  /** Басылатын карточка: hover кезінде көтеріледі, көлеңке opacity арқылы күшейеді */
  interactive?: boolean
  tone?: 'paper' | 'ivory' | 'sand' | 'navy'
  className?: string
  children: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>

const tones = {
  paper: 'bg-paper border-line text-ink',
  ivory: 'bg-ivory border-line text-ink',
  sand: 'bg-sand border-line text-ink',
  navy: 'bg-navy-900 border-white/10 text-white',
}
const levels = {
  base: '',
  elevated: 'shadow-card',
  floating: 'shadow-float',
}

/**
 * Карточка: үш қабат жүйесі (base, elevated, floating). Hover көлеңкесі opacity арқылы,
 * көтерілуі transform арқылы ғана анимацияланады.
 */
export function Card({
  as: Tag = 'div',
  level = 'elevated',
  interactive = false,
  tone = 'paper',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'relative rounded-card border',
        tones[tone],
        levels[level],
        interactive &&
          'cursor-pointer transition-transform duration-300 ease-out-expo hover:-translate-y-1 active:translate-y-0 ' +
            'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-lift ' +
            'after:transition-opacity after:duration-300 hover:after:opacity-100',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
