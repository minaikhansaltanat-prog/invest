'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/icons'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { isActivePath, type ResolvedNavItem } from '@/lib/nav'

/**
 * Десктоп мәзірі (1080 px және одан жоғары). Бөлім сілтемесі + ашылатын ішкі тізім.
 * Hover (қысқа кідіріспен), пернетақта фокусы кезінде ашылады; Esc жабады (WCAG 1.4.13); бет ауысқанда жабылады.
 */
export function DesktopNav({ items, label }: { items: ResolvedNavItem[]; label: string }) {
  const pathname = usePathname()
  // Ашық бөлім «қай бетте ашылды» деп сақталады: бет ауысқанда жабылады (effect-сіз)
  const [opened, setOpened] = useState<{ key: string; path: string } | null>(null)
  const openKey = opened?.path === pathname ? opened.key : null
  const setOpenKey = useCallback(
    (key: string | null) => setOpened(key ? { key, path: pathname } : null),
    [pathname],
  )
  const timer = useRef<number | undefined>(undefined)
  const triggers = useRef(new Map<string, HTMLAnchorElement>())

  useEffect(() => {
    if (!openKey) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        triggers.current.get(openKey)?.focus()
        setOpenKey(null)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openKey, setOpenKey])

  const schedule = (key: string | null, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpenKey(key), delay)
  }

  return (
    <nav aria-label={label} className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-[clamp(10px,1.3vw,26px)]">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href) || item.children.some((child) => child.href !== '/' && isActivePath(pathname, child.href) && child.href !== item.href)
          const open = openKey === item.key
          const hasChildren = item.children.length > 0
          return (
            <li
              key={item.key}
              className="relative"
              onPointerEnter={(event) => event.pointerType === 'mouse' && hasChildren && schedule(item.key, 90)}
              onPointerLeave={(event) => event.pointerType === 'mouse' && schedule(null, 180)}
              onFocus={() => hasChildren && schedule(item.key, 0)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) schedule(null, 0)
              }}
            >
              <Link
                href={item.href}
                ref={(node) => {
                  if (node) triggers.current.set(item.key, node)
                }}
                aria-haspopup={hasChildren ? 'true' : undefined}
                aria-expanded={hasChildren ? open : undefined}
                aria-current={active && !hasChildren ? 'page' : undefined}
                className={cn(
                  'group relative inline-flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-1 text-[14px] font-medium text-navy-900 xl:text-[14.5px]',
                  'transition-colors duration-200 hover:text-navy-700',
                  // Белсенді бөлімнің астындағы алтын сызық (дизайн үлгісінде)
                  'after:absolute after:inset-x-1 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-sm after:bg-gold-500 after:transition-transform after:duration-300 after:ease-out-expo',
                  active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
                )}
              >
                {item.label}
                {hasChildren ? (
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={cn('opacity-60 transition-transform duration-300 ease-out-expo', open && 'rotate-180')}
                  />
                ) : null}
              </Link>
              {hasChildren && open ? (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
                  <ul
                    className={cn(
                      'load-rise grid gap-0.5 rounded-block border border-line bg-paper p-2.5 shadow-float',
                      item.children.length > 8 ? 'w-[560px] grid-cols-2' : 'w-[300px]',
                    )}
                    style={{ ['--d' as string]: '0ms' }}
                  >
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className="group/item flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-3.5 text-[14.5px] font-medium text-navy-900 transition-colors duration-150 hover:bg-ivory hover:text-navy-700"
                        >
                          <span className="leading-snug">{child.label}</span>
                          <Icon
                            name="arrow-right"
                            size={14}
                            className="shrink-0 -translate-x-1 text-gold-600 opacity-0 transition-[transform,opacity] duration-200 ease-out-expo group-hover/item:translate-x-0 group-hover/item:opacity-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
