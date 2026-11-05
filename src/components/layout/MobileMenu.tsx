'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/icons'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import type { ResolvedNavItem } from '@/lib/nav'

import { LangSwitcher } from './LangSwitcher'

export type MobileMenuLabels = {
  open: string
  close: string
  menu: string
  mainNav: string
  openSection: string
}

/** Панельдегі түйме: corporate-та «Байланысу», full режимінде «Өтініш беру» мен «Жеке кабинет» (SiteHeader береді) */
export type MenuCta = { label: string; href: string }

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Бургер-мәзір (NIGHT_TASK 3.3): 1080 px-тен төмен көрінеді. Толық экранды панель (фон navy-950).
 * Жабылу: X түймесі, Esc, мәзір сілтемесі, панельдің бос аймағы, бет ауысуы.
 * Қолжетімділік: aria-expanded/aria-controls, 4 тілдегі aria-label, focus trap, жабылғанда фокус бургерге оралады,
 * ашық кезде фон inert, бет айналдыру құлыпталады. Қозғалыс prefers-reduced-motion кезінде өшеді.
 */
export function MobileMenu({
  items,
  labels,
  brand,
  phone,
  primaryCta,
  secondaryCta,
}: {
  items: ResolvedNavItem[]
  labels: MobileMenuLabels
  brand: ReactNode
  phone?: { label: string; href: string }
  primaryCta: MenuCta
  secondaryCta?: MenuCta | null
}) {
  const pathname = usePathname()
  // Мәзір «қай бетте ашылды» деп сақталады: бет ауысқанда ашық күй өздігінен жоғалады (effect-сіз)
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === pathname
  const setOpen = useCallback((value: boolean) => setOpenPath(value ? pathname : null), [pathname])
  const [expandedItem, setExpandedItem] = useState<{ path: string; key: string } | null>(null)
  const expanded = expandedItem?.path === pathname ? expandedItem.key : null
  // Portal тек клиентте (гидратациядан кейін) жасалады
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const burgerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(
    (restoreFocus = true) => {
      setOpen(false)
      if (restoreFocus) window.setTimeout(() => burgerRef.current?.focus(), 0)
    },
    [setOpen],
  )

  // Кең экранға өткенде жабылады
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1080px)')
    const onChange = () => query.matches && setOpenPath(null)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Ашық кезде: inert фон, айналдыру құлпы, фокус панельге
  useEffect(() => {
    if (!open) return
    const root = document.getElementById('site-root')
    root?.setAttribute('inert', '')
    const previousHtml = document.documentElement.style.overflow
    const previousBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null || node === document.activeElement,
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root?.removeAttribute('inert')
      document.documentElement.style.overflow = previousHtml
      document.body.style.overflow = previousBody
    }
  }, [open, close])

  const bar = (offset: string, extra: string) =>
    cn('absolute left-0 h-0.5 w-5 rounded-full bg-navy-900 transition-[transform,opacity] duration-300 ease-out-expo', offset, extra)

  const panel = (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={labels.menu}
      hidden={!open}
      data-surface="dark"
      onClick={(event) => {
        // Бос аймақты (мазмұн контейнерінің сыртын) басқанда жабылады
        if (event.target === event.currentTarget) close()
      }}
      className="on-dark ornament fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-navy-950 text-white [animation:fade_0.2s_ease-out]"
    >
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[560px] flex-col px-[var(--gutter)] pb-8">
        <div className="flex min-h-[72px] items-center justify-between gap-3 py-2">
          <div className="min-w-0">{brand}</div>
          <button
            ref={closeRef}
            type="button"
            aria-label={labels.close}
            onClick={() => close()}
            className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-white/20 text-white transition-[background-color,transform] duration-200 ease-out-expo hover:bg-white/10 active:scale-90"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <nav aria-label={labels.mainNav} className="mt-2">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {items.map((item, index) => {
              const isOpen = expanded === item.key
              const subId = `mobile-sub-${item.key}`
              const hasChildren = item.children.length > 0
              return (
                <li key={item.key} className="load-rise" style={{ ['--d' as string]: `${60 + index * 35}ms` }}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => close(false)}
                      className="flex min-h-14 flex-1 items-center font-serif text-[26px] font-semibold leading-tight tracking-[-0.01em] text-white transition-colors hover:text-gold-300"
                    >
                      {item.label}
                    </Link>
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={subId}
                        aria-label={`${labels.openSection}: ${item.label}`}
                        onClick={() => setExpandedItem(isOpen ? null : { path: pathname, key: item.key })}
                        className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full text-gold-300 transition-colors hover:bg-white/10"
                      >
                        <Icon
                          name="chevron-down"
                          size={22}
                          className={cn('transition-transform duration-300 ease-out-expo', isOpen && 'rotate-180')}
                        />
                      </button>
                    ) : null}
                  </div>
                  {hasChildren && isOpen ? (
                    <ul id={subId} className="load-rise mb-3 grid gap-0.5 border-l border-gold-500/40 pl-4" style={{ ['--d' as string]: '0ms' }}>
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href}
                            onClick={() => close(false)}
                            className="flex min-h-11 items-center text-base text-white/80 transition-colors hover:text-gold-300"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-7 grid gap-5">
          <LangSwitcher variant="panel" onNavigate={() => close(false)} />
          <div className="grid gap-3">
            <Button href={primaryCta.href} full arrow onClick={() => close(false)}>
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button href={secondaryCta.href} variant="ghost" full onClick={() => close(false)}>
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
          {phone ? (
            <a
              href={phone.href}
              className="inline-flex min-h-11 items-center gap-2.5 text-[15px] text-white/75 hover:text-white"
            >
              <Icon name="phone" size={18} className="text-gold-300" />
              {phone.label}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => (open ? close() : setOpen(true))}
        className="grid size-11 cursor-pointer place-items-center rounded-xl border border-line bg-paper transition-[background-color,transform,border-color] duration-200 ease-out-expo hover:border-navy-700/40 hover:bg-ivory active:scale-90 lg:hidden"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <i className={bar('top-0', open ? 'translate-y-[6px] rotate-45' : '')} />
          <i className={bar('top-[6px]', open ? 'opacity-0' : '')} />
          <i className={bar('top-3', open ? '-translate-y-[6px] -rotate-45' : '')} />
        </span>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  )
}
