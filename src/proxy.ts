import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

// Next.js 16: middleware.ts орнына proxy.ts. /admin, /api, _next және файлдар (нүктесі барлар) қамтылмайды.
export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
