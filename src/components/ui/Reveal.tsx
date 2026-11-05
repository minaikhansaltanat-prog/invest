'use client'

import { usePathname } from 'next/navigation'
import { type CSSProperties, type ElementType, type ReactNode, useEffect } from 'react'

declare global {
  interface Window {
    __kfcaRevealTimer?: number
  }
}

/**
 * Бастапқы жасырын күйді (html.reveal-ready) <head> ішіндегі шағын скрипт қояды.
 * Скрипт 3.5 секундтан кейін reveal-timeout қосады: JS жүктелмесе, мазмұн бәрібір көрінеді.
 */
export const revealBootScript = `(function(){var d=document.documentElement;d.classList.add('reveal-ready');window.__kfcaRevealTimer=window.setTimeout(function(){d.classList.add('reveal-timeout')},3500)})()`

/** Бір ортақ IntersectionObserver: барлық [data-reveal] элементтерін бақылайды */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.__kfcaRevealTimer) window.clearTimeout(window.__kfcaRevealTimer)
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])'))
    if (nodes.length === 0) return

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.setAttribute('data-in', ''))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [pathname])

  return null
}

/** Айналдырғанда пайда болатын қабықша. `delay` миллисекундпен (кезекпен шығу үшін) */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  mode = 'rise',
  className,
  children,
}: {
  as?: ElementType
  delay?: number
  mode?: 'rise' | 'fade' | 'scale-x'
  className?: string
  children?: ReactNode
}) {
  return (
    <Tag
      data-reveal={mode === 'rise' ? '' : mode}
      className={className}
      style={delay ? ({ '--d': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
