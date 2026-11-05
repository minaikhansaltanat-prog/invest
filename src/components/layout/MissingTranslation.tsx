import { getTranslations } from 'next-intl/server'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { defaultLocale, type Locale, localeMeta } from '@/i18n/config'

/**
 * Бетте көрсетілген тілде бекітілген аударма жоқ болғанда (ТТ 11.2): бөтен тілдегі мәтін көрсетілмейді,
 * орнына хабарлама және әдепкі тілдегі нұсқаға сілтеме беріледі.
 */
export async function MissingTranslation({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'lang' })
  return (
    <main id="main" className="wrap section-y">
      <EmptyState
        icon="globe"
        title={t(defaultLocale)}
        text={t('missingTranslation')}
        action={
          <Button href="/" locale={defaultLocale} lang={localeMeta[defaultLocale].htmlLang} arrow>
            {localeMeta[defaultLocale].label}
          </Button>
        }
      />
    </main>
  )
}
