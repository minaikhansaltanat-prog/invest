import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { adminTwoFactorRequired } from './lib/portal/env'
import { TWO_FACTOR_COOKIE, verifyTwoFactor } from './lib/portal/twofactor'

// Next.js 16: middleware.ts орнына proxy.ts. Екі міндет: (1) сайт беттері үшін тіл маршрутизациясы, (2) әкімші панелінің 2FA қақпасы (ТТ 14.1).
const intl = createMiddleware(routing)

// Кіру және қалпына келтіру көріністері 2FA-сыз қолжетімді (әйтпесе әкімші кіре алмайды)
const openAdminViews = /^\/admin\/(login|logout|forgot|reset|create-first-user|unauthorized)(\/|$)/

/** Payload сессия JWT-інің ішіндегі id мен коллекцияны оқиды (қолтаңбаны Payload өзі тексереді, бұл тек бағыттау үшін) */
function sessionClaims(token: string): { id: string | number; collection: string } | null {
  try {
    const claims = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8')) as { id?: string | number; collection?: string }
    return claims.id !== undefined && claims.collection ? { id: claims.id, collection: claims.collection } : null
  } catch {
    return null
  }
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!adminTwoFactorRequired() || openAdminViews.test(pathname)) return NextResponse.next()
    const token = request.cookies.get('payload-token')?.value
    const claims = token ? sessionClaims(token) : null
    if (claims?.collection === 'admins' && !verifyTwoFactor(request.cookies.get(TWO_FACTOR_COOKIE)?.value, claims.id, 'admins')) {
      return NextResponse.redirect(new URL(`/kk/account/2fa?next=${encodeURIComponent(pathname)}`, request.url))
    }
    return NextResponse.next()
  }

  return intl(request)
}

// /api, _next және файлдар (нүктесі барлар) қамтылмайды; /admin тек 2FA қақпасы үшін
export const config = {
  matcher: ['/admin', '/admin/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
