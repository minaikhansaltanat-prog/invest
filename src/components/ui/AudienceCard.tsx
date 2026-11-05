import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { Icon } from './icons'

/** Аудитория карточкасы (Инвесторларға / Жоба иелеріне / Мүшелерге). Сол жағында алтын жолақ, hover кезінде көтеріледі */
export function AudienceCard({
  index,
  title,
  text,
  cta,
  href,
  className,
}: {
  index: number
  title: string
  text: string
  cta: string
  href: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative grid cursor-pointer gap-3 overflow-hidden rounded-card border border-line bg-paper p-[30px] pb-7 shadow-lift',
        'transition-transform duration-300 ease-out-expo hover:-translate-y-1.5 active:translate-y-0',
        'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-linear-to-b before:from-gold-400 before:to-gold-600',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:shadow-float after:transition-opacity after:duration-300 hover:after:opacity-100',
        className,
      )}
    >
      <span className="lining font-serif text-[15px] font-bold tracking-[0.1em] text-gold-700">
        {String(index).padStart(2, '0')}
      </span>
      <h3 className="t-h3 text-navy-900">{title}</h3>
      <p className="text-[15px] leading-relaxed text-muted">{text}</p>
      <span className="mt-2 flex items-center justify-between gap-4 text-sm font-semibold text-navy-700">
        {cta}
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-full border border-line text-navy-700 transition-[background-color,border-color,color,transform] duration-300 ease-out-expo group-hover:translate-x-1 group-hover:border-gold-500 group-hover:bg-gold-400 group-hover:text-navy-950"
        >
          <Icon name="arrow-right" size={16} />
        </span>
      </span>
    </Link>
  )
}
