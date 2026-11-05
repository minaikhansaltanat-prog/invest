import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from './config'

// URL әрқашан тілден басталады: /kk, /ru, /en, /zh. Тіл таңдауы cookie-де де сақталады (NEXT_LOCALE).
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
})
