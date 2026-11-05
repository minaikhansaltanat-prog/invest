'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { cn } from '@/lib/cn'

import { Icon } from './icons'

/**
 * Модаль терезе: жергілікті <dialog> элементі (focus trap, Esc, inert фон браузерде дайын).
 * Артқы фонды басқанда жабылады. Жабу түймесі кемінде 44x44 px, aria-label сырттан (4 тіл).
 */
export function Modal({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'm-auto w-[min(560px,calc(100vw-32px))] max-w-none rounded-block border border-line bg-paper p-0 text-ink shadow-float',
        'backdrop:bg-navy-950/70 backdrop:backdrop-blur-sm open:animate-[rise_0.35s_var(--ease-out-expo)]',
        className,
      )}
    >
      <div className="grid gap-5 p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="t-h3 text-navy-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-2 -mt-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-navy-900 transition-[background-color,transform] duration-200 hover:bg-sand active:scale-90"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="t-body text-muted">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </dialog>
  )
}
