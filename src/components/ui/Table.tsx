import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type Column<Row> = {
  key: string
  header: string
  render: (row: Row) => ReactNode
  /** Сандық баған: оңға тураланады, tabular-nums */
  numeric?: boolean
  className?: string
}

/**
 * Кесте: бет көлденең айналмайды (кесте өз ішінде айналады), тақырып жолы, hover, сандар tabular.
 * caption міндетті: қолжетімділік (экран оқығыштар) үшін.
 */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  className,
}: {
  caption: string
  columns: Column<Row>[]
  rows: Row[]
  rowKey: (row: Row) => string
  className?: string
}) {
  return (
    <div className={cn('overflow-x-auto rounded-card border border-line bg-paper shadow-card', className)}>
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-sand">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted',
                  column.numeric && 'text-right',
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-line last:border-b-0 transition-colors duration-200 hover:bg-ivory">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-4 py-3.5 text-ink', column.numeric && 'lining text-right', column.className)}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
