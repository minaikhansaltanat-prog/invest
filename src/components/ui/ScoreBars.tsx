import { cn } from '@/lib/cn'

export type ScoreBar = { label: string; points: number }

/**
 * 100 балдық бағалаудың жолақшалары (ТТ 8.2). Ұзындығы салмаққа тең (ең үлкен салмақ = 100 %).
 * Толтырма transform: scaleX арқылы солдан оңға өседі (айналдырғанда).
 */
export function ScoreBars({ items, className }: { items: ScoreBar[]; className?: string }) {
  const max = Math.max(...items.map((item) => item.points), 1)
  return (
    <ul className={cn('grid gap-3.5', className)}>
      {items.map((item, index) => (
        <li
          key={item.label}
          className="grid grid-cols-[1fr_44px] items-center gap-x-4 gap-y-1.5 text-[14.5px] lg:grid-cols-[210px_1fr_44px] lg:gap-y-0"
        >
          <span className="font-medium text-navy-900">{item.label}</span>
          <span className="lining text-right font-serif text-xl font-bold text-navy-900 lg:order-3">{item.points}</span>
          <span
            aria-hidden="true"
            className="col-span-full h-2.5 overflow-hidden rounded-full bg-sand lg:order-2 lg:col-span-1"
          >
            <i
              data-reveal="scale-x"
              style={{ width: `${(item.points / max) * 100}%`, ['--d' as string]: `${index * 90}ms` }}
              className={cn(
                'block h-full rounded-full',
                index === 0
                  ? 'bg-linear-to-r from-gold-600 to-gold-400'
                  : 'bg-linear-to-r from-navy-700 to-navy-600',
              )}
            />
          </span>
        </li>
      ))}
    </ul>
  )
}
