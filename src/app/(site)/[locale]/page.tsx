import { hasLocale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { use } from 'react'

import { routing } from '@/i18n/routing'

// Уақытша бет: 0-кезеңде бет жасалмайды, тек қаңқаның жұмыс істейтіні көрсетіледі. 2-кезеңде ауыстырылады.
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = useTranslations('meta')

  return (
    <main>
      <h1>{t('siteName')}</h1>
      <p>{t('placeholder')}</p>
    </main>
  )
}
