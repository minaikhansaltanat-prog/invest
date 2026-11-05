import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

import { ServiceGlyph, type ServiceIconName } from './icons'

/**
 * Қызмет торының ұяшығы: нөмір, иконка, тақырып, бір сөйлем. `highlight`: нави фон (басты бетте 1-ші).
 * Торды (шекара сызықтарын) ата-ана жасайды.
 */
export function ServiceCell({
  number,
  icon,
  title,
  text,
  href,
  highlight = false,
}: {
  number: number
  icon: ServiceIconName
  title: string
  text: string
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative grid cursor-pointer content-start gap-3.5 border-b border-r border-line p-[30px] pb-9 lg:px-[30px] lg:py-[34px]',
        'transition-colors duration-300',
        highlight ? 'bg-navy-900 text-white' : 'bg-paper hover:bg-ivory',
        // Төменгі алтын сызық hover кезінде солдан оңға созылады (transform)
        'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform after:duration-500 after:ease-out-expo hover:after:scale-x-100',
      )}
    >
      <span className={cn('lining font-serif text-[15px] font-bold tracking-[0.08em]', highlight ? 'text-gold-300' : 'text-gold-700')}>
        {String(number).padStart(2, '0')}
      </span>
      <ServiceGlyph
        name={icon}
        className={cn(
          'transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:scale-105',
          highlight ? 'text-gold-300' : 'text-navy-700',
        )}
      />
      <h3 className={cn('text-lg font-semibold leading-snug', highlight ? 'text-white' : 'text-navy-900')}>{title}</h3>
      <p className={cn('text-[14.5px] leading-relaxed', highlight ? 'text-white/70' : 'text-muted')}>{text}</p>
    </Link>
  )
}
