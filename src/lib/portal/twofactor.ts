import { createHmac, timingSafeEqual } from 'node:crypto'

import { appSecret } from './env'

// 2FA расталды белгісі: қолтаңбалы HttpOnly cookie `kfca-2fa` = <userId>.<collection>.<exp>.<hmac>. Сессия cookie-ін ауыстырмайды,
// тек «осы сессияда TOTP коды енгізілді» дегенді растайды. Әкімшіде әкімші панелі мен API-ға қатынас, инвесторда деректер бөлмесі осыған байланысты.

export const TWO_FACTOR_COOKIE = 'kfca-2fa'
export const TWO_FACTOR_TTL_SEC = 12 * 60 * 60

const sign = (value: string, secret: string) => createHmac('sha256', secret).update(`2fa:${value}`).digest('base64url')

export function signTwoFactor(
  userId: string | number,
  collection: string,
  options: { secret?: string; now?: number; ttlSec?: number } = {},
): string {
  const { secret = appSecret(), now = Date.now(), ttlSec = TWO_FACTOR_TTL_SEC } = options
  const exp = Math.floor(now / 1000) + ttlSec
  const body = `${userId}.${collection}.${exp}`
  return `${body}.${sign(body, secret)}`
}

export function verifyTwoFactor(
  cookie: string | null | undefined,
  userId: string | number,
  collection: string,
  options: { secret?: string; now?: number } = {},
): boolean {
  if (!cookie) return false
  const { secret = appSecret(), now = Date.now() } = options
  const parts = cookie.split('.')
  if (parts.length !== 4) return false
  const [id, coll, exp, mac] = parts
  if (id !== String(userId) || coll !== collection) return false
  if (!/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false
  const expected = Buffer.from(sign(`${id}.${coll}.${exp}`, secret))
  const given = Buffer.from(mac)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export function readCookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    if (part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim())
  }
  return undefined
}

/** Сұраудың cookie-інде осы пайдаланушы үшін жарамды 2FA белгісі бар ма */
export function hasValidTwoFactor(
  headers: Pick<Headers, 'get'>,
  user: { id: string | number; collection?: string } | null | undefined,
  options: { secret?: string; now?: number } = {},
): boolean {
  if (!user?.collection) return false
  return verifyTwoFactor(readCookie(headers.get('cookie'), TWO_FACTOR_COOKIE), user.id, user.collection, options)
}

export function twoFactorCookieHeader(value: string, secure: boolean): string {
  return [
    `${TWO_FACTOR_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${TWO_FACTOR_TTL_SEC}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export const clearTwoFactorCookieHeader = (secure: boolean) =>
  [`${TWO_FACTOR_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0', secure ? 'Secure' : ''].filter(Boolean).join('; ')
