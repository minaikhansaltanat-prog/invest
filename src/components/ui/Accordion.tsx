'use client'

import { type ReactNode, useId, useState } from 'react'

import { cn } from '@/lib/cn'

import { Icon } from './icons'

export type AccordionItem = {
  id: string
  title: ReactNode
  content: ReactNode
}

/**
 * Аккордеон (FAQ, мобильді мәзірдің ішкі бөлімдері). Тақырып: кемінде 44 px, aria-expanded/aria-controls.
 * Мазмұн opacity + transform арқылы пайда болады (биіктік анимацияланбайды).
 */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  tone = 'light',
  className,
}: {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
  tone?: 'light' | 'dark'
  className?: string
}) {
  const uid = useId()
  const [open, setOpen] = useState<string[]>(defaultOpen)

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : multiple ? [...current, id] : [id],
    )

  return (
    <div className={cn('divide-y', tone === 'dark' ? 'divide-white/10' : 'divide-line', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id)
        const buttonId = `${uid}-${item.id}-btn`
        const panelId = `${uid}-${item.id}-panel`
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 py-3 text-left text-base font-semibold',
                  'transition-colors duration-200',
                  tone === 'dark' ? 'text-white hover:text-gold-300' : 'text-navy-900 hover:text-navy-700',
                )}
              >
                <span>{item.title}</span>
                <Icon
                  name="chevron-down"
                  size={20}
                  className={cn(
                    'shrink-0 transition-transform duration-300 ease-out-expo',
                    isOpen && 'rotate-180',
                    tone === 'dark' ? 'text-gold-300' : 'text-gold-700',
                  )}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <div className="load-rise pb-4" style={{ ['--d' as string]: '0ms' }}>
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
