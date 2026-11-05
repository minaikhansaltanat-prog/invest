import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

const chipClass = (selected: boolean) =>
  cn(
    'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium',
    'transition-[transform,background-color,border-color,color] duration-200 ease-out-expo active:scale-[0.97]',
    selected
      ? 'border-navy-900 bg-navy-900 text-white'
      : 'border-line bg-paper text-ink hover:-translate-y-px hover:border-navy-700 hover:text-navy-700',
  )

/** Сүзгі чипі сілтеме ретінде (басты беттегі салалар: каталогқа өтеді) */
export function ChipLink({
  href,
  selected = false,
  children,
  className,
}: {
  href: string
  selected?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <Link href={href} aria-current={selected ? 'true' : undefined} className={cn(chipClass(selected), className)}>
      {children}
    </Link>
  )
}

/** Сүзгі чипі (сала, өңір, деңгей). Биіктігі кемінде 44 px, `selected` күйі aria-pressed арқылы */
export function Chip({
  selected = false,
  children,
  className,
  ...rest
}: { selected?: boolean; children: ReactNode; className?: string } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(chipClass(selected), className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ChipGroup({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
      {children}
    </div>
  )
}
