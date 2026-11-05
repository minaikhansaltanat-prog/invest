import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound, redirect as redirectTo } from 'next/navigation'

import { TwoFactorPanel } from '@/components/forms/AccountActions'
import { AccountShell, noIndex } from '@/components/page/AccountShell'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { isCorporate } from '@/lib/mode'
import { adminTwoFactorRequired } from '@/lib/portal/env'
import { sessionOf } from '@/lib/portal/http'
import { hasValidTwoFactor } from '@/lib/portal/twofactor'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'account.twofa' })
  return { title: t('title'), ...noIndex }
}

/** 2FA беті: пайдаланушы мен әкімші үшін ортақ. Әкімші панелі `?next=/admin` арқылы осында бағыттайды. */
export default async function TwoFactorPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const { next } = await searchParams
  const requestHeaders = await headers()
  const { payload, user } = await sessionOf(requestHeaders)
  if (isCorporate()) {
    // Corporate режимінде бұл бет тек әкімшіге (2FA қосу және растау): кабинет жоқ. Сессиясыз болса, әкімші кіруіне, басқа пайдаланушыға 404
    if (!user) redirectTo('/admin')
    if (user!.collection !== 'admins') notFound()
  }
  if (!user) redirect({ href: { pathname: '/account/login', query: next ? { next: `/account/2fa?next=${encodeURIComponent(next)}` } : undefined }, locale })
  const t = await getTranslations({ locale, namespace: 'account.twofa' })

  const record = (await payload.findByID({ collection: user!.collection, id: user!.id, overrideAccess: true, depth: 0 })) as unknown as { totpEnabled?: boolean | null }

  return (
    <AccountShell locale={locale} title={t('title')} wide>
      <TwoFactorPanel
        next={next}
        initial={{
          enabled: Boolean(record.totpEnabled),
          verified: hasValidTwoFactor(requestHeaders, { id: user!.id, collection: user!.collection }),
          collection: user!.collection,
          required: user!.collection === 'admins' ? adminTwoFactorRequired() : false,
        }}
      />
    </AccountShell>
  )
}
