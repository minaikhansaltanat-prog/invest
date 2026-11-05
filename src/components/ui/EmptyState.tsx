import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { Icon, type IconName } from './icons'

/** Бос күй: каталог, іздеу нәтижесі, кабинет бөлімдері бос болғанда. Әрқашан келесі қадамды ұсынады. */
export function EmptyState({
  icon = 'search',
  title,
  text,
  action,
  className,
}: {
  icon?: IconName
  title: string
  text?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid justify-items-center gap-4 rounded-block border border-dashed border-line bg-paper/60 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="grid size-16 place-items-center rounded-full border border-gold-400/60 bg-sand text-gold-700">
        <Icon name={icon} size={26} strokeWidth={1.6} />
      </span>
      <h3 className="t-h3 text-navy-900">{title}</h3>
      {text ? <p className="t-body max-w-[460px] text-muted">{text}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
