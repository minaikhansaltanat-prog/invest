import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { Icon } from './icons'

// Төрт нұсқа (ТТ 12.4): gold, ghost (қараңғы фонда), navy, line (ашық фонда). Биіктігі 48 px, дөңгелек пішін.
export type ButtonVariant = 'gold' | 'ghost' | 'navy' | 'line'

const variants: Record<ButtonVariant, string> = {
  gold: 'btn-sheen bg-linear-to-b from-gold-400 to-gold-500 text-navy-950 shadow-gold hover:-translate-y-0.5 hover:from-gold-300 hover:to-gold-400 active:from-gold-500 active:to-gold-500',
  ghost:
    'border border-white/35 text-white hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/10 active:bg-white/5',
  navy: 'bg-navy-900 text-white shadow-card hover:-translate-y-0.5 hover:bg-navy-800 active:bg-navy-950',
  line: 'border border-navy-900 text-navy-900 hover:-translate-y-0.5 hover:bg-navy-900 hover:text-white active:bg-navy-950',
}

const base =
  'group inline-flex min-h-12 select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-[26px] text-[15px] font-semibold leading-none ' +
  'cursor-pointer transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 ease-out-expo ' +
  'active:translate-y-px active:scale-[0.985] aria-disabled:pointer-events-none aria-disabled:opacity-60 disabled:pointer-events-none disabled:opacity-60'

type Common = {
  variant?: ButtonVariant
  /** Оң жақтағы көрсеткі */
  arrow?: boolean
  /** Іштегі белгіше (көрсеткіден бұрын) */
  children: ReactNode
  className?: string
  full?: boolean
}

type AsLink = Common & {
  href: string
  external?: boolean
  /** Басқа тілдегі нұсқаға өту (мысалы, 'zh') */
  locale?: Locale
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>

type AsButton = Common & {
  href?: undefined
  loading?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

const isExternal = (href: string) => /^(https?:|mailto:|tel:|#)/.test(href)

export function Button(props: AsLink | AsButton) {
  const { variant = 'gold', arrow = false, children, className, full = false } = props
  const classes = cn(base, variants[variant], full && 'w-full', className)
  const arrowIcon = arrow ? (
    <Icon
      name="arrow-right"
      size={16}
      className="transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 rtl:rotate-180"
    />
  ) : null

  if (props.href !== undefined) {
    const { href, external, locale, variant: _v, arrow: _a, children: _c, className: _cn, full: _f, ...rest } = props as AsLink
    if (isExternal(href) || external) {
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...rest}
        >
          {children}
          {arrowIcon}
        </a>
      )
    }
    return (
      <Link href={href} locale={locale} className={classes} {...rest}>
        {children}
        {arrowIcon}
      </Link>
    )
  }

  const { loading, variant: _v, arrow: _a, children: _c, className: _cn, full: _f, disabled, type = 'button', ...rest } = props as AsButton
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
      {arrowIcon}
    </button>
  )
}
