import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { userRoleLabels, type UserRole } from '@/access/roles'
import { DataActions, LogoutButton } from '@/components/forms/AccountActions'
import { AccountShell, noIndex } from '@/components/page/AccountShell'
import { Tag } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/icons'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { hiddenInCorporate } from '@/lib/portal/guard'
import { formatDate } from '@/lib/format'
import { hasValidTwoFactor } from '@/lib/portal/twofactor'
import { sessionOf } from '@/lib/portal/http'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'account.dashboard' })
  return { title: t('title'), ...noIndex }
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="grid gap-4 rounded-block border border-line bg-paper p-6 shadow-card lg:p-8">
    <h2 className="t-h3 text-navy-900">{title}</h2>
    {children}
  </section>
)

/** Жеке кабинет (ТТ 9): рөлдер, өтініш мәртебелері, 2FA, кіру тарихы, деректерді жүктеу және жою сұранысы. Инвестор/жоба/мүше бөлімдері 7-8 кезеңдерде толықтырылады. */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  hiddenInCorporate() // corporate режимінде кабинет беттері жоқ (404)
  const requestHeaders = await headers()
  const { payload, user } = await sessionOf(requestHeaders)
  if (!user) redirect({ href: '/account/login', locale })
  const td = await getTranslations({ locale, namespace: 'account.dashboard' })
  const tf = await getTranslations({ locale, namespace: 'account.twofa' })

  const current = user!
  const record = (await payload.findByID({ collection: current.collection, id: current.id, overrideAccess: true, depth: 0 })) as unknown as {
    roles?: string[]
    totpEnabled?: boolean | null
    loginHistory?: { at?: string; ip?: string; agent?: string; id?: string }[] | null
    deletionRequestedAt?: string | null
  }
  const verified = hasValidTwoFactor(requestHeaders, { id: current.id, collection: current.collection })
  const isStaff = current.collection === 'admins'

  const submissions = isStaff
    ? []
    : (
        await payload.find({
          collection: 'submissions',
          where: { or: [{ user: { equals: current.id } }, { email: { equals: current.email } }] },
          sort: '-createdAt',
          limit: 50,
          depth: 0,
          overrideAccess: true,
        })
      ).docs

  return (
    <AccountShell locale={locale} title={td('title')} lead={td('welcome', { name: String(current.name ?? current.email) })} wide>
      <Card title={td('roles')}>
        <div className="flex flex-wrap items-center gap-3">
          {isStaff ? (
            <Tag>{td('adminNote')}</Tag>
          ) : (
            (record.roles ?? []).map((role) => <Tag key={role}>{userRoleLabels[role as UserRole]?.[locale] ?? role}</Tag>)
          )}
          <span className="ml-auto flex flex-wrap items-center gap-3">
            {isStaff ? (
              <Button href="/admin" external arrow>
                {td('openAdmin')}
              </Button>
            ) : null}
            <LogoutButton collection={current.collection} />
          </span>
        </div>
      </Card>

      <Card title={tf('title')}>
        <p className="flex flex-wrap items-center gap-3 text-base text-ink">
          <Icon name={record.totpEnabled ? 'check' : 'lock'} size={20} className={record.totpEnabled ? 'text-success' : 'text-gold-700'} />
          {record.totpEnabled ? `${tf('enabled')} · ${verified ? tf('verified') : tf('notVerified')}` : tf('disabled')}
        </p>
        <div>
          <Button href="/account/2fa" variant="line" arrow>
            {tf('title')}
          </Button>
        </div>
      </Card>

      {isStaff ? null : (
        <Card title={td('submissions')}>
          {submissions.length === 0 ? (
            <p className="t-body text-muted">{td('noSubmissions')}</p>
          ) : (
            <ul className="grid divide-y divide-line">
              {submissions.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <span className="grid gap-0.5">
                    <span className="font-semibold text-navy-900">{td(`kind.${item.kind}`)}</span>
                    <span className="lining font-mono text-sm text-muted">{item.reference}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm text-muted">
                    {formatDate(item.createdAt, locale)}
                    <Tag>{td(`status.${item.status}`)}</Tag>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {(record.loginHistory ?? []).length > 0 ? (
        <Card title={td('loginHistory')}>
          <ul className="grid divide-y divide-line text-sm text-muted">
            {(record.loginHistory ?? []).slice(0, 5).map((entry, index) => (
              <li key={entry.id ?? index} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span>{entry.at ? formatDate(entry.at, locale) : ''}</span>
                <span className="lining font-mono">{entry.ip}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {isStaff ? null : (
        <Card title={td('data')}>
          <DataActions deletionRequested={Boolean(record.deletionRequestedAt)} />
        </Card>
      )}
    </AccountShell>
  )
}
