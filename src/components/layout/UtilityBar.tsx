import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { isCorporate } from '@/lib/mode'
import type { Setting } from '@/payload-types'

import { LangSwitcher } from './LangSwitcher'

const Sep = () => <span aria-hidden="true" className="h-3.5 w-px bg-white/20" />

/** Қызметтік жол (ТТ 6, 1-блок): қалалар, телефон, WeChat, тіл ауыстырғыш, «Жеке кабинет» */
export async function UtilityBar({ settings }: { settings: Setting }) {
  const t = await getTranslations('nav')
  const u = await getTranslations('util')
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, '')}` : undefined

  return (
    <div className="bg-navy-950 text-[13px] text-white/75">
      <div className="wrap-wide flex min-h-11 items-center justify-end gap-4 lg:min-h-10 lg:justify-between">
        <div className="hidden items-center gap-[22px] lg:flex">
          {settings.citiesLine ? <span>{settings.citiesLine}</span> : null}
          {settings.phone ? (
            <>
              <Sep />
              <a href={phoneHref} className="rounded-sm py-1 hover:text-white">
                {settings.phone}
              </a>
            </>
          ) : null}
          {settings.wechatId ? (
            <>
              <Sep />
              <Link href="/contacts#wechat" className="rounded-sm py-1 hover:text-white">
                {u('wechat')}
              </Link>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher variant="bar" />
          {/* Corporate режимінде жеке кабинет жоқ */}
          {isCorporate() ? null : (
            <>
              <Sep />
              <Link
                href="/account"
                className="inline-flex min-h-11 items-center rounded-sm px-1 hover:text-white lg:min-h-8"
              >
                {t('account')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
