import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { DataroomViewer } from '@/components/forms/DataroomPanel'
import { AccountShell, noIndex } from '@/components/page/AccountShell'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { hiddenInCorporate } from '@/lib/portal/guard'
import { watermarkText } from '@/lib/investment/dataroom'
import { dataroomDecision, logDataroom } from '@/lib/portal/dataroom'

type Props = { params: Promise<{ locale: string; projectId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'dataroom' })
  return { title: t('pageTitle'), ...noIndex }
}

/**
 * Деректер бөлмесі (ТТ 8.6, 14.1): NDA, инвестор деңгейі (A/B), вето және 2FA тексерілген соң ғана ашылады.
 * Бас тартқанда жалпы «қатынас жоқ» көрсетіледі, себеп тек журналға жазылады. Әр ашу журналға түседі.
 */
export default async function DataroomPage({ params }: Props) {
  const { locale, projectId } = await params
  if (!hasLocale(routing.locales, locale) || !/^\d+$/.test(projectId)) notFound()
  setRequestLocale(locale)
  hiddenInCorporate() // corporate режимінде кабинет беттері жоқ (404)
  const requestHeaders = await headers()
  const decision = await dataroomDecision(requestHeaders, projectId)
  if (decision.kind === 'unauthorized') {
    redirect({ href: { pathname: '/account/login', query: { next: `/account/dataroom/${projectId}` } }, locale })
  }
  const t = await getTranslations({ locale, namespace: 'dataroom' })

  if (decision.kind === 'denied') {
    await logDataroom(decision.session.payload, { userId: decision.session.user!.id, action: 'denied', projectId, request: { headers: requestHeaders }, reason: decision.reason })
    return (
      <AccountShell locale={locale} title={t('pageTitle')}>
        <EmptyState
          icon="lock"
          title={t('pageTitle')}
          text={t('denied')}
          action={
            <Button href="/projects" variant="line" arrow>
              {t('backToProject')}
            </Button>
          }
        />
      </AccountShell>
    )
  }

  if (decision.kind !== 'allowed') notFound()
  const { payload, user } = decision.session
  const { docs } = await payload.find({ collection: 'dataroomFiles', where: { project: { equals: projectId } }, sort: 'title', limit: 200, depth: 0, overrideAccess: true })
  await logDataroom(payload, { userId: user!.id, action: 'open', projectId, request: { headers: requestHeaders } })

  return (
    <AccountShell locale={locale} title={t('pageTitle')} lead={t('viewOnly')} wide>
      {docs.length === 0 ? (
        <EmptyState icon="document" title={t('filesTitle')} text={t('noFiles')} />
      ) : (
        <DataroomViewer
          files={docs.map((file) => ({ id: file.id, title: file.title, category: file.category ?? 'other', mimeType: file.mimeType ?? undefined }))}
          watermark={watermarkText(String(user!.name ?? user!.email), new Date())}
        />
      )}
    </AccountShell>
  )
}
