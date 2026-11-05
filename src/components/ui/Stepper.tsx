import { cn } from '@/lib/cn'

export type Step = { title: string; text: string; done?: boolean }

/**
 * Жоба өмірлік циклі: 8 кезеңнің сызығы (ТТ 8.4). Десктопта көлденең, мобильдіде тік.
 * Әр кезең келесісіне дейінгі сызық кесіндісін өзі салады: орындалған кезеңдер алтын, қалғаны күңгірт.
 * Қараңғы фонға арналған.
 */
export function Stepper({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn('relative grid gap-[18px] lg:grid-cols-8 lg:gap-0', className)}>
      {steps.map((step, index) => {
        const next = steps[index + 1]
        const last = index === steps.length - 1
        const segment = last
          ? ''
          : step.done && next?.done
            ? 'before:bg-gold-500'
            : step.done
              ? 'before:bg-linear-to-b before:from-gold-500 before:to-gold-400/25 lg:before:bg-linear-to-r'
              : 'before:bg-gold-400/25'
        return (
          <li
            key={step.title}
            data-reveal=""
            style={{ ['--d' as string]: `${index * 70}ms` }}
            className={cn(
              'relative grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-0.5',
              'lg:grid-cols-1 lg:content-start lg:justify-items-center lg:gap-3.5 lg:px-2 lg:text-center',
              !last &&
                'before:absolute before:left-7 before:top-14 before:-bottom-[18px] before:w-px ' +
                  'lg:before:left-1/2 lg:before:right-auto lg:before:top-[27px] lg:before:bottom-auto lg:before:h-px lg:before:w-full',
              segment,
            )}
          >
            <span
              className={cn(
                'lining relative z-10 grid size-14 place-items-center rounded-full border font-serif text-[22px] font-bold',
                step.done
                  ? 'border-transparent bg-linear-to-b from-gold-400 to-gold-600 text-navy-950 shadow-gold'
                  : 'border-gold-500 bg-navy-900 text-gold-300',
              )}
            >
              {index + 1}
            </span>
            <h4 className="text-[14.5px] font-semibold leading-snug text-white lg:min-h-[2.6em]">{step.title}</h4>
            <p className="col-start-2 text-base leading-snug text-white/65 lg:col-start-auto lg:text-[12.5px]">{step.text}</p>
          </li>
        )
      })}
    </ol>
  )
}
