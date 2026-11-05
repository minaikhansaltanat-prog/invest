import { cn } from '@/lib/cn'

import { Icon } from './icons'

/**
 * Көп қадамды форманың жоғарғы индикаторы (ТТ 7.4, 12.4). Қазіргі қадамда aria-current="step".
 * Өтілген қадамдар алтын белгімен, қалғаны күңгірт.
 */
export function FormSteps({
  steps,
  current,
  label,
  className,
}: {
  steps: string[]
  /** 0-ден басталады */
  current: number
  label: string
  className?: string
}) {
  return (
    <ol aria-label={label} className={cn('flex items-start gap-2 overflow-x-auto pb-1', className)}>
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li
            key={step}
            aria-current={active ? 'step' : undefined}
            className="flex min-w-[88px] flex-1 flex-col gap-2"
          >
            <span
              className={cn(
                'h-1 rounded-full transition-colors duration-300',
                done || active ? 'bg-gold-500' : 'bg-line',
                active && 'bg-linear-to-r from-gold-500 to-gold-400/50',
              )}
            />
            <span className="flex items-center gap-2 text-[13px] font-semibold leading-tight">
              <span
                className={cn(
                  'lining grid size-6 shrink-0 place-items-center rounded-full text-xs',
                  done ? 'bg-gold-500 text-navy-950' : active ? 'bg-navy-900 text-gold-300' : 'bg-sand text-muted',
                )}
              >
                {done ? <Icon name="check" size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span className={cn(active ? 'text-navy-900' : 'text-muted')}>{step}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
