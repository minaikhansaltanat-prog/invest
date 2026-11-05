'use client'

import { useLocale, useTranslations } from 'next-intl'

import { localeMeta, locales } from '@/i18n/config'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

/**
 * Тіл ауыстырғыш: KK, RU, EN, 中文. Әр сілтеме сол беттің басқа тілдегі нұсқасына апарады (URL тілден басталады),
 * таңдау NEXT_LOCALE cookie-де сақталады. Ағымдағы тілде aria-current.
 * Қолжетімді атау көрінетін қысқа кодты қамтиды («ҚАЗ, Қазақша»): WCAG 2.5.3 (Label in Name).
 * bar: қызметтік жолда (шағын көрінетін белгі, бірақ басылатын аймақ 44 px), panel: мобильді мәзірде.
 */
export function LangSwitcher({
  variant = 'bar',
  className,
  onNavigate,
}: {
  variant?: 'bar' | 'panel'
  className?: string
  /** Тілді ауыстырғанда шақырылады (мобильді мәзірді жабу үшін) */
  onNavigate?: () => void
}) {
  const current = useLocale()
  const pathname = usePathname()
  const t = useTranslations('a11y')

  return (
    <nav aria-label={t('language')} className={className}>
      <ul className={cn('flex items-center', variant === 'bar' ? 'gap-0.5' : 'gap-2')}>
        {locales.map((code) => {
          const active = code === current
          const meta = localeMeta[code]
          return (
            <li key={code}>
              <Link
                href={pathname}
                locale={code}
                lang={meta.htmlLang}
                hrefLang={meta.hreflang}
                aria-current={active ? 'true' : undefined}
                onClick={onNavigate}
                className={cn(
                  'group/lang inline-flex cursor-pointer items-center justify-center',
                  variant === 'bar' ? 'min-h-11 min-w-11 lg:min-h-8 lg:min-w-8' : 'min-h-12',
                )}
              >
                <span
                  className={cn(
                    'inline-flex items-center justify-center font-semibold tracking-[0.04em]',
                    'transition-[background-color,color,border-color,transform] duration-200 ease-out-expo group-active/lang:scale-95',
                    variant === 'bar'
                      ? 'h-7 min-w-8 rounded-md px-2 text-xs'
                      : 'min-h-12 min-w-16 rounded-full border px-4 text-sm',
                    variant === 'bar'
                      ? active
                        ? 'bg-gold-500 text-navy-950'
                        : 'text-white/75 group-hover/lang:bg-white/10 group-hover/lang:text-white'
                      : active
                        ? 'border-gold-400 bg-gold-400 text-navy-950'
                        : 'border-white/25 text-white group-hover/lang:border-white/60 group-hover/lang:bg-white/10',
                  )}
                >
                  {meta.short}
                </span>
                <span className="sr-only">, {meta.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
