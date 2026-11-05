import { type ComponentProps, type ReactNode, useId } from 'react'

import { cn } from '@/lib/cn'

import { Icon } from './icons'

// Форма өрістері (ТТ 12.6): әр өрісте label, қате мәтіні, aria байланыстары. Өріс биіктігі 48 px, мәтін 16 px (iOS zoom жоқ).

type ControlIds = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

/** Label + бақылау элементі + көмек + қате. Бақылауға id мен aria-describedby render-prop арқылы беріледі */
export function Field({
  label,
  hint,
  error,
  required,
  optionalLabel,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** «міндетті емес» жазуы (4 тілде сырттан беріледі) */
  optionalLabel?: string
  children: (ids: ControlIds) => ReactNode
  className?: string
}) {
  const uid = useId()
  const id = `f-${uid}`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        ) : optionalLabel ? (
          <span className="ml-2 text-xs font-normal text-muted">{optionalLabel}</span>
        ) : null}
      </label>
      {children({
        id,
        'aria-describedby': describedBy,
        ...(error ? { 'aria-invalid': true as const } : {}),
        ...(required ? { 'aria-required': true as const } : {}),
      })}
      {hint ? (
        <p id={hintId} className="text-[13px] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-[13px] font-medium leading-snug text-danger">
          <Icon name="alert" size={15} className="mt-px shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

const control =
  'min-h-12 w-full rounded-[12px] border border-line bg-paper px-4 text-base text-ink placeholder:text-muted/70 ' +
  'transition-[border-color,box-shadow] duration-200 hover:border-navy-700/50 ' +
  'focus-visible:border-navy-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold-400/45 ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-bg/40 disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted'

export function Input({ className, ...rest }: ComponentProps<'input'>) {
  return <input className={cn(control, className)} {...rest} />
}

export function Textarea({ className, rows = 5, ...rest }: ComponentProps<'textarea'>) {
  return <textarea rows={rows} className={cn(control, 'min-h-32 resize-y py-3 leading-relaxed', className)} {...rest} />
}

export function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  return (
    <span className="relative block">
      <select className={cn(control, 'cursor-pointer appearance-none pr-11', className)} {...rest}>
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={18}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy-700"
      />
    </span>
  )
}

/**
 * Келісім чекбоксы (дербес деректер, NDA). Ешқашан алдын ала белгіленбейді.
 * Басылатын аймақ кемінде 44 px, толық жол басылады.
 */
export function Checkbox({
  label,
  error,
  className,
  ...rest
}: { label: ReactNode; error?: string } & Omit<ComponentProps<'input'>, 'type' | 'defaultChecked' | 'checked'> & {
    checked?: boolean
  }) {
  const uid = useId()
  const errorId = error ? `${uid}-error` : undefined
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label className="group flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
        <input
          type="checkbox"
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            'mt-0.5 grid size-6 shrink-0 place-items-center rounded-[7px] border-[1.5px] border-navy-700/60 bg-paper text-transparent',
            'transition-[background-color,border-color,color,transform] duration-200 ease-out-expo',
            'group-hover:border-navy-700 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-gold-300',
            'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-600 peer-active:scale-90',
            error && 'border-danger',
          )}
        >
          <Icon name="check" size={15} strokeWidth={2.6} />
        </span>
        <span className="text-[15px] leading-snug text-ink">{label}</span>
      </label>
      {error ? (
        <p id={errorId} role="alert" className="ml-9 flex items-start gap-1.5 text-[13px] font-medium text-danger">
          <Icon name="alert" size={15} className="mt-px shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
