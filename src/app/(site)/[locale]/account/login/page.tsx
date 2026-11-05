import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { LoginForm } from '@/components/forms/AuthForms'
import { AccountShell, noIndex } from '@/components/page/AccountShell'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { sessionOf } from '@/lib/portal/http'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'account' })
  return { title: t('loginTitle'), ...noIndex }
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const { next } = await searchParams
  const { user } = await sessionOf(await headers())
  if (user) redirect({ href: next && next.startsWith('/') ? next : '/account', locale })
  const t = await getTranslations({ locale, namespace: 'account' })

  return (
    <AccountShell locale={locale} title={t('loginTitle')}>
      <div className="rounded-block border border-line bg-paper p-6 shadow-card lg:p-9">
        <LoginForm next={next} />
      </div>
    </AccountShell>
  )
}
