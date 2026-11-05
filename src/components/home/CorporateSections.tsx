import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/icons'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { Eyebrow, Lines, NoBreak } from '@/components/ui/typography'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { mediaOf } from '@/lib/media'
import type { Partner, Setting } from '@/payload-types'

// Corporate басты бетінің үш жаңа бөлімі (PORTAL_MODE=corporate): «Қауымдастық туралы», «Серіктестер», «Байланыс».
// Қалған бөлімдер (hero, қызметтер, жаңалықтар, басшылық) бұрынғы компоненттер. Мәтіндер: messages/*.json `corporate.*`
// және CMS (бет сипаттамасы, қағидаттар, серіктестер, баптаулар).

const arrowLink =
  'group inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-semibold text-navy-700 hover:text-navy-900'
const arrow = (
  <Icon name="arrow-right" size={16} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1 rtl:rotate-180" />
)

export type Principle = { id?: string | null; title: string; text?: string | null }

/** Қауымдастық туралы: сол жақта тезис пен сілтемелер, оң жақта «Миссия» бетінің қағидаттары (CMS: Беттер) */
export async function CorporateAbout({
  locale,
  lead,
  principles,
}: {
  locale: Locale
  lead?: string | null
  principles: Principle[]
}) {
  const t = await getTranslations({ locale, namespace: 'corporate.about' })
  const shown = principles.slice(0, 6)

  return (
    <section className="section-y">
      <div
        className={cn(
          'wrap grid gap-10 lg:gap-[72px]',
          shown.length > 0 && 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center',
        )}
      >
        <Reveal className="grid content-start gap-6">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="t-h2 text-navy-900">
            <Lines text={t('title')} />
          </h2>
          <p className="t-lead max-w-[580px] text-muted">
            <NoBreak text={lead || t('lead')} />
          </p>
          <div className="mt-2 flex flex-col gap-3.5 md:flex-row md:items-center md:gap-7">
            <Button href="/about" variant="navy" arrow className="max-md:w-full">
              {t('more')}
            </Button>
            <Link href="/about/mission" className={arrowLink}>
              {t('mission')}
              {arrow}
            </Link>
          </div>
        </Reveal>

        {shown.length > 0 ? (
          <Reveal delay={90}>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-700">{t('principles')}</p>
            <ol className="grid border-l border-t border-line md:grid-cols-2">
              {shown.map((item, index) => (
                <li
                  key={item.id ?? item.title}
                  className="grid content-start gap-2.5 border-b border-r border-line bg-paper p-6 lg:p-7"
                >
                  <span className="lining font-serif text-[15px] font-bold tracking-[0.1em] text-gold-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="t-h3 text-[21px] leading-[1.15] text-navy-900">{item.title}</h3>
                  {item.text ? <p className="line-clamp-3 text-[15px] leading-[1.6] text-muted">{item.text}</p> : null}
                </li>
              ))}
            </ol>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

function PartnerTile({ partner }: { partner: Partner }) {
  // Логотип тек жазбаша рұқсатпен (showLogo), әйтпесе монограмма
  const logo = partner.showLogo ? mediaOf(partner.logo) : null
  const body = (
    <>
      <span className="grid h-20 place-items-center rounded-card border border-line bg-ivory px-4">
        {logo ? (
          <Image src={logo.src} alt={logo.alt || partner.name || ''} width={logo.width} height={logo.height} className="max-h-14 w-auto object-contain" />
        ) : (
          <span className="grid size-12 place-items-center rounded-full bg-navy-900 font-serif text-lg font-bold text-gold-300">
            {initials(partner.name ?? '')}
          </span>
        )}
      </span>
      <span className="text-base font-semibold leading-snug text-navy-900">{partner.name}</span>
      {partner.country ? <span className="text-sm text-muted">{partner.country}</span> : null}
    </>
  )
  const classes = 'grid content-start gap-3 rounded-card border border-line bg-ivory/60 p-4 lg:p-5'
  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(classes, 'cursor-pointer transition-transform duration-300 ease-out-expo hover:-translate-y-1')}
    >
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  )
}

/** Серіктестер: 8-ге дейін карточка (CMS: Серіктестер). Тізім бос болса, серіктестікке шақыру карточкасы */
export async function CorporatePartners({ locale, partners }: { locale: Locale; partners: Partner[] }) {
  const t = await getTranslations({ locale, namespace: 'corporate.partners' })
  const shown = partners.slice(0, 8)

  return (
    <section className="section-y border-y border-line bg-paper">
      <div className="wrap">
        <Reveal>
          <SectionHead
            eyebrow={t('eyebrow')}
            title={t('title')}
            action={
              shown.length > 0 ? (
                <Link href="/partners" className={arrowLink}>
                  {t('all')}
                  {arrow}
                </Link>
              ) : undefined
            }
          />
        </Reveal>
        <Reveal delay={80}>
          {shown.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {shown.map((partner) => (
                <li key={partner.id}>
                  <PartnerTile partner={partner} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                'relative grid gap-5 overflow-hidden rounded-card border border-line bg-ivory p-7 shadow-card lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:p-10',
                'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-linear-to-b before:from-gold-400 before:to-gold-600',
              )}
            >
              <div className="grid gap-2.5">
                <h3 className="t-h3 text-navy-900">{t('emptyTitle')}</h3>
                <p className="max-w-[640px] text-base leading-[1.65] text-muted">{t('emptyText')}</p>
              </div>
              <Button href="/contacts#apply-form" variant="navy" arrow className="max-lg:w-full">
                {t('emptyCta')}
              </Button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

type ContactRow = { icon: IconName; label: string; value: string; href?: string }

/** Байланыс: нави блок (CtaBand стилі). Деректер CMS-тен (Баптаулар): телефон, WeChat, пошта, мекенжайлар; түйме байланыс формасына */
export async function CorporateContact({ locale, settings }: { locale: Locale; settings: Setting }) {
  const [t, footer, util] = await Promise.all([
    getTranslations({ locale, namespace: 'corporate.contact' }),
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'util' }),
  ])

  const rows: ContactRow[] = []
  if (settings.phone) rows.push({ icon: 'phone', label: t('phone'), value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}` })
  if (settings.wechatId) rows.push({ icon: 'wechat', label: util('wechat'), value: settings.wechatId })
  if (settings.email) rows.push({ icon: 'mail', label: t('email'), value: settings.email, href: `mailto:${settings.email}` })
  if (settings.legalAddress) rows.push({ icon: 'pin', label: footer('legalAddress'), value: settings.legalAddress })
  if (settings.officeAddress) rows.push({ icon: 'pin', label: footer('office'), value: settings.officeAddress })

  return (
    <section className="pt-[var(--section-y)]">
      <div className="wrap">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-hero bg-navy-900 px-6 py-11 text-white shadow-float lg:px-14 lg:py-14">
            <span aria-hidden="true" className="ornament absolute inset-0" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_90%_at_0%_0%,rgb(37_80_143/0.4),transparent_70%),radial-gradient(40%_80%_at_100%_120%,rgb(196_154_60/0.25),transparent_70%)]"
            />
            <div className="relative z-10 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
              <div className="grid content-start gap-5">
                <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
                <h2 className="t-h2 text-white [text-wrap:balance]">
                  <Lines text={t('title')} />
                </h2>
                <p className="t-lead max-w-[540px] text-white/70">
                  <NoBreak text={t('text')} />
                </p>
                <div className="mt-1">
                  <Button href="/contacts#apply-form" arrow className="max-lg:w-full">
                    {t('cta')}
                  </Button>
                </div>
              </div>

              {rows.length > 0 ? (
                <dl className="grid gap-px overflow-hidden rounded-card border border-white/15 bg-white/10">
                  {rows.map((row) => (
                    <div key={`${row.icon}-${row.label}`} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 bg-navy-900/80 px-5 py-4 lg:px-6">
                      <span className="mt-0.5 grid size-10 place-items-center rounded-full bg-white/10 text-gold-300">
                        <Icon name={row.icon} size={18} />
                      </span>
                      <div className="grid gap-0.5">
                        <dt className="text-[11.5px] uppercase tracking-[0.12em] text-gold-300">{row.label}</dt>
                        <dd className="text-[15px] leading-snug text-white/90">
                          {row.href ? (
                            <a href={row.href} className="inline-flex min-h-11 items-center hover:text-gold-300 lg:min-h-8">
                              {row.value}
                            </a>
                          ) : (
                            row.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
