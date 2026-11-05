'use client'

import { useEffect, useRef } from 'react'

/**
 * Санның 0-ден мәніне дейін өсуі (көрініске кіргенде). SSR мәтінінде нақты мән тұр (іздеу жүйесі және JS жоқ жағдай).
 * prefers-reduced-motion кезінде анимация жоқ. Мән `textContent` арқылы жаңарады: layout өзгермейді (tabular-nums).
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 4)
        node.textContent = String(Math.round(value * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      node.textContent = '0'
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}>
      {value}
    </span>
  )
}
