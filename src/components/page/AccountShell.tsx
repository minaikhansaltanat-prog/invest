import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import { PageHero } from '@/components/page/PageHero'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/cn'

/** Кабинет беттерінің ортақ қабығы: тақырып жолағы + орталықтандырылған карточка(лар). Іздеу жүйелеріне жабық (беттер noindex). */
export async function AccountShell({
  locale,
  title,
  lead,
  wide = false,
  children,
}: {
  locale: Locale
  title: string
  lead?: string
  wide?: boolean
  children: ReactNode
}) {
  const t = await getTranslations({ locale })
  return (
    <main id="main">
      <PageHero
        eyebrow={t('nav.account')}
        title={title}
        description={lead}
        crumbs={[{ label: t('page.home'), href: '/' }, { label: t('nav.account'), href: '/account' }, { label: title }]}
        crumbLabel={t('a11y.breadcrumbs')}
      />
      <div className="wrap pt-12 lg:pt-16">
        <div className={cn('grid gap-6', wide ? 'max-w-[980px]' : 'mx-auto max-w-[560px]')}>{children}</div>
      </div>
    </main>
  )
}

export const noIndex = { robots: { index: false, follow: false } } as const
