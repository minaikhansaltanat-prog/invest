'use client'

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

import { cn } from '@/lib/cn'

import { Icon } from './icons'

type ToastTone = 'success' | 'info' | 'error'
type ToastItem = { id: number; tone: ToastTone; message: string }

const ToastContext = createContext<{ push: (message: string, tone?: ToastTone) => void } | null>(null)

/** Хабарлама (toast): role=status, 5 секундтан кейін жабылады, жабу түймесі 44x44 px */
export function ToastProvider({ children, closeLabel }: { children: ReactNode; closeLabel: string }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), [])
  const push = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = Date.now() + Math.random()
      setItems((current) => [...current, { id, tone, message }])
      window.setTimeout(() => dismiss(id), 5000)
    },
    [dismiss],
  )
  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 grid justify-items-start gap-2.5 lg:inset-x-auto lg:bottom-6 lg:left-6"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role={item.tone === 'error' ? 'alert' : 'status'}
            className={cn(
              'load-rise pointer-events-auto flex w-full max-w-[420px] items-center gap-3 rounded-card border bg-navy-950 py-2 pl-4 pr-1.5 text-sm text-white shadow-float',
              item.tone === 'error' ? 'border-danger' : 'border-gold-500/40',
            )}
          >
            <Icon
              name={item.tone === 'error' ? 'alert' : item.tone === 'success' ? 'check' : 'info'}
              size={18}
              className={item.tone === 'error' ? 'text-danger' : 'text-gold-300'}
            />
            <span className="flex-1 py-1.5 leading-snug">{item.message}</span>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => dismiss(item.id)}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-white/80 transition-[background-color,color] duration-200 hover:bg-white/10 hover:text-white"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast ToastProvider ішінде қолданылуы тиіс')
  return context
}
