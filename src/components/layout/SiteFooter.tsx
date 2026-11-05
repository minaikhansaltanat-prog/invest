import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import emblem from '@/assets/images/emblem.png'
import type { Locale } from '@/i18n/config'
import { Link } from '@/i18n/navigation'
import { getSettings } from '@/lib/content'

type FooterLink = { href: string; label: string; lang?: string; locale?: Locale }

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="grid gap-1">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              locale={link.locale}
              lang={link.lang}
              className="inline-flex min-h-11 min-w-11 items-center text-[14.5px] text-white/70 transition-colors duration-200 hover:text-gold-300 lg:min-h-8 lg:min-w-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Футер (ТТ 6, 14-блок): логотип, ұран, 3 сілтеме бағаны, екі мекенжай, БСН, жауапкершілікті шектеу мәтіні */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [settings, t] = await Promise.all([getSettings(locale), getTranslations({ locale, namespace: 'footer' })])
  const lines = (settings.brandName ?? '').split('\n')
  const year = new Date().getFullYear()

  return (
    <footer
      className={
        'on-dark grain relative mt-[72px] bg-navy-950 pt-14 text-sm text-white/70 lg:mt-[110px] lg:pt-[76px] ' +
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-gold-500/60 before:to-transparent'
      }
      data-surface="dark"
    >
      <div className="wrap relative z-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr] lg:gap-10">
          <div className="col-span-2 grid content-start gap-[18px] lg:col-span-1">
            <span className="grid size-[92px] place-items-center rounded-full bg-white p-2 shadow-float">
              <Image src={emblem} alt="" sizes="92px" className="w-full" />
            </span>
            <p className="text-base font-bold uppercase leading-snug tracking-[0.05em] text-white lg:text-sm">
              {lines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </p>
            {settings.tagline ? (
              <p className="font-serif text-[22px] italic text-gold-300 [&:lang(zh)]:not-italic">{settings.tagline}</p>
            ) : null}
          </div>

          <Column
            title={t('association')}
            links={[
              { href: '/about', label: t('aboutUs') },
              { href: '/about/governance', label: t('governance') },
              { href: '/about/documents', label: t('documents') },
              { href: '/about/reports', label: t('reports') },
            ]}
          />
          <Column
            title={t('forInvestors')}
            links={[
              { href: '/projects', label: t('projectPool') },
              { href: '/investors/apply', label: t('investorApplication') },
              { href: '/services/market-entry', label: t('marketEntry') },
              ...(locale === 'zh' ? [] : [{ href: '/', locale: 'zh' as const, label: t('zhVersion'), lang: 'zh-CN' }]),
            ]}
          />
          <Column
            title={t('forMembers')}
            links={[
              { href: '/membership', label: t('categories') },
              { href: '/membership/apply', label: t('membershipApplication') },
              { href: '/account', label: t('account') },
              { href: '/media', label: t('media') },
            ]}
          />

          <div className="col-span-2 grid content-start gap-3.5 lg:col-span-1">
            {settings.legalAddress ? (
              <div>
                <small className="mb-0.5 block text-[11.5px] uppercase tracking-[0.12em] text-gold-300">{t('legalAddress')}</small>
                {settings.legalAddress}
              </div>
            ) : null}
            {settings.officeAddress ? (
              <div>
                <small className="mb-0.5 block text-[11.5px] uppercase tracking-[0.12em] text-gold-300">{t('office')}</small>
                {settings.officeAddress}
              </div>
            ) : null}
            <div id="contact-footer">
              <small className="mb-0.5 block text-[11.5px] uppercase tracking-[0.12em] text-gold-300">{t('contact')}</small>
              {settings.phone ? (
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-11 items-center hover:text-gold-300 lg:min-h-8">
                  {settings.phone}
                </a>
              ) : null}
              {settings.wechatId ? <span> · {settings.wechatId}</span> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-2.5 border-t border-white/10 pb-8 pt-[22px] text-[12.5px] text-white/60">
          <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
            <span>
              {t('copyright', { year, name: settings.legalName ?? '' })} · {t('bin')} {settings.bin}
            </span>
            <span className="flex flex-wrap items-center gap-x-5">
              <Link href="/legal/privacy" className="inline-flex min-h-11 items-center hover:text-gold-300 lg:min-h-8">
                {t('privacy')}
              </Link>
              <Link href="/legal/terms" className="inline-flex min-h-11 items-center hover:text-gold-300 lg:min-h-8">
                {t('terms')}
              </Link>
            </span>
          </div>
          {settings.disclaimer ? <p className="max-w-[900px] text-base leading-relaxed lg:text-[12.5px]">{settings.disclaimer}</p> : null}
        </div>
      </div>
    </footer>
  )
}
