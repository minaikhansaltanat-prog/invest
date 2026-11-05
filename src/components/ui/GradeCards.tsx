import { cn } from '@/lib/cn'

export type Grade = { key: string; range: string; title: string }

/** A/B/C/D деңгейлері (ТТ 8.2). A: нави фон, қалғандары ашық */
export function GradeCards({ grades, className }: { grades: Grade[]; className?: string }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 lg:grid-cols-4', className)}>
      {grades.map((grade, index) => {
        const top = index === 0
        return (
          <li
            key={grade.key}
            className={cn(
              'grid gap-1 rounded-[12px] border p-4 transition-transform duration-300 ease-out-expo hover:-translate-y-0.5',
              top ? 'border-navy-900 bg-navy-900 shadow-lift' : 'border-line bg-paper',
            )}
          >
            <b className={cn('font-serif text-[34px] font-semibold leading-none', top ? 'text-gold-300' : 'text-navy-900')}>
              {grade.key}
            </b>
            <small className={cn('text-[12.5px]', top ? 'text-white/70' : 'text-muted')}>{grade.range}</small>
            <span className={cn('text-[13px] font-semibold', top ? 'text-white' : 'text-navy-700')}>{grade.title}</span>
          </li>
        )
      })}
    </ul>
  )
}
