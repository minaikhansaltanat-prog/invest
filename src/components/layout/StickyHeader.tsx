'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

/**
 * Айналдырғанда бекітілетін header (ТТ 6, 2-блок). Қазіргі күйді IntersectionObserver анықтайды (scroll тыңдаушысыз):
 * бекітілгенде көлеңке пайда болады (opacity арқылы), биіктігі өзгермейді, сондықтан layout секірмейді.
 */
export function StickyHeader({ children }: { children: ReactNode }) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const node = sentinel.current
    if (!node || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none h-px w-full" />
      <header
        data-stuck={stuck}
        className={cn(
          'sticky top-0 z-40 -mt-px border-b border-line bg-paper/95 backdrop-blur-md',
          'after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-6 after:bg-linear-to-b after:from-navy-950/10 after:to-transparent',
          'after:opacity-0 after:transition-opacity after:duration-300 data-[stuck=true]:after:opacity-100',
        )}
      >
        {children}
      </header>
    </>
  )
}
