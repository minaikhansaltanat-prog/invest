import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RegisterForm } from '@/components/forms/AuthForms'
import { AccountShell, noIndex } from '@/components/page/AccountShell'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'account' })
  return { title: t('registerTitle'), ...noIndex }
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'account' })

  return (
    <AccountShell locale={locale} title={t('registerTitle')} lead={t('registerLead')} wide>
      <div className="max-w-[760px] rounded-block border border-line bg-paper p-6 shadow-card lg:p-9">
        <RegisterForm />
      </div>
    </AccountShell>
  )
}
