import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TranslationNotice } from '@/components/layout/TranslationNotice'
import { RevealObserver, revealBootScript } from '@/components/ui/Reveal'
import { ToastProvider } from '@/components/ui/Toast'
import { localeMeta, locales } from '@/i18n/config'
import { routing } from '@/i18n/routing'
import { siteIndexable } from '@/lib/indexing'

import './globals.css'

// Шапка мен төменгі колонтитул Payload дерекқорынан оқиды (баптаулар, мәзір): беттер құрастыру кезінде емес, әр сұраныста жасалады.
// Әйтпесе `next build` дерекқорсыз (Docker образын жинағанда) құлайды, ал дерекқормен жиналса, баптаулар жаңартылмай қалады.
export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: { default: t('siteName'), template: `%s | ${t('siteName')}` },
    description: t('tagline'),
    // Жабық орнатуда (Vercel preview) барлық бет noindex (src/lib/indexing.ts)
    ...(siteIndexable() ? {} : { robots: { index: false, follow: false } }),
    icons: {
      icon: [
        { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-180.png', sizes: '180x180' }],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'a11y' })

  return (
    // suppressHydrationWarning: <head> скрипті html-ге reveal-ready класын гидратацияға дейін қосады
    <html lang={localeMeta[locale].htmlLang} dir={localeMeta[locale].dir} suppressHydrationWarning>
      <head>
        {/* Dev режимінде 404 бетінде React «script tag» ескертуін шығарады (next/script-пен де): тек dev, өндірісте жоқ */}
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <ToastProvider closeLabel={t('close')}>
            {/* #site-root: мобильді мәзір ашық кезде осы қабық inert болады (фон басылмайды, фокус кірмейді) */}
            <div id="site-root">
              <SiteHeader locale={locale} />
              {children}
              <SiteFooter locale={locale} />
            </div>
            <TranslationNotice />
          </ToastProvider>
          <RevealObserver />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
