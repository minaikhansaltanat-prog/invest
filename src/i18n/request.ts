import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { defaultLocale } from './config'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Жетіспейтін кілт жасырын fallback болмайды: қате лақтырылмай, кілттің өзі көрінеді (dev ортасында байқалады)
    onError: (error) => {
      if (process.env.NODE_ENV !== 'production') console.warn('[i18n]', error.message)
    },
    getMessageFallback: ({ namespace, key }) => `⟦${[namespace, key].filter(Boolean).join('.')}⟧`,
  }
})
