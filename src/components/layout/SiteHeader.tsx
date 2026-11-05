import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import { getServices, getSettings } from '@/lib/content'
import { navSections, type ResolvedNavItem } from '@/lib/nav'

import { Brand } from './Brand'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'
import { StickyHeader } from './StickyHeader'
import { UtilityBar } from './UtilityBar'

type Translate = (key: string) => string

/** Қызметтік жол + бекітілетін header (логотип, мәзір, «Өтініш беру», бургер) */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const [settings, services, t, a11y] = await Promise.all([
    getSettings(locale),
    getServices(locale),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
  ])
  const tr = t as unknown as Translate

  const items: ResolvedNavItem[] = navSections.map((section) => ({
    key: section.key,
    label: tr(section.key),
    href: section.href,
    children:
      section.key === 'services'
        ? [
            { id: 'all', label: tr('sub.services.all'), href: '/services' },
            ...services.map((service) => ({ id: service.slug, label: service.title ?? '', href: `/services/${service.slug}` })),
          ]
        : (section.children ?? []).map((child) => ({
            id: child.id,
            label: tr(`sub.${section.key}.${child.id}`),
            href: child.href,
          })),
  }))

  const phone = settings.phone
    ? { label: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}` }
    : undefined

  return (
    <>
      <UtilityBar settings={settings} />
      <StickyHeader>
        <div className="wrap-wide flex h-[72px] items-center justify-between gap-4 lg:h-[92px]">
          <Brand settings={settings} />
          <DesktopNav items={items} label={a11y('mainNav')} />
          <div className="flex shrink-0 items-center gap-3.5">
            <div className="hidden lg:block">
              <Button href="/investors/apply" className="lg:px-5 xl:px-[26px]">
                {t('apply')}
              </Button>
            </div>
            <MobileMenu
              items={items}
              phone={phone}
              brand={<Brand settings={settings} onDark priority={false} />}
              labels={{
                open: a11y('openMenu'),
                close: a11y('closeMenu'),
                menu: t('menuTitle'),
                mainNav: a11y('mobileNav'),
                openSection: a11y('openSection'),
                apply: t('apply'),
                account: t('account'),
              }}
            />
          </div>
        </div>
      </StickyHeader>
    </>
  )
}
