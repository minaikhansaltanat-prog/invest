import { cn } from '@/lib/cn'

import { CountUp } from './CountUp'

export type LedgerCell = {
  label: string
  value: number
  description: string
}

/**
 * KPI «кітабы» (ledger): төрт бөлек есеп, ешқашан қосылмайды (ТТ 8.7). Соңғы ұяшық: расталған инвестиция (алтын реңмен).
 * Ескертпе жолы кезең мен жаңартылған күнді көрсетеді.
 */
export function Ledger({
  cells,
  note,
  className,
}: {
  cells: LedgerCell[]
  note?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 overflow-hidden rounded-card border border-line bg-paper shadow-card lg:grid-cols-4',
        className,
      )}
    >
      {cells.map((cell, index) => {
        const last = index === cells.length - 1
        return (
          <div
            key={cell.label}
            className={cn(
              'relative grid content-start gap-2.5 border-b border-line p-[22px] lg:border-b-0 lg:p-[30px_26px]',
              index % 2 === 0 && 'border-r',
              index < cells.length - 1 && 'lg:border-r',
              last && 'lg:border-r-0 lg:bg-linear-to-b lg:from-white lg:to-warn-bg',
              last && 'bg-linear-to-b from-white to-warn-bg',
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{cell.label}</span>
            <CountUp
              value={cell.value}
              className={cn(
                'font-serif text-[44px] font-semibold leading-none lg:text-[58px]',
                last ? 'text-gold-700' : 'text-navy-900',
              )}
            />
            <span className="text-sm leading-snug text-muted">{cell.description}</span>
          </div>
        )
      })}
      {note ? (
        <p className="col-span-full flex items-center gap-2.5 border-t border-line bg-ivory px-[22px] py-3.5 text-[13px] text-muted lg:px-[26px]">
          <i aria-hidden="true" className="size-2 shrink-0 rounded-full bg-gold-500" />
          {note}
        </p>
      ) : null}
    </div>
  )
}
