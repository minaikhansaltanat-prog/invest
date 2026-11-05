import { isSecureEnv } from '@/lib/portal/env'
import { json } from '@/lib/portal/http'
import { clearTwoFactorCookieHeader } from '@/lib/portal/twofactor'

/** Шығу кезінде 2FA белгісін (cookie) тазалайды: сессия cookie-ін Payload өзі `/api/<collection>/logout` арқылы тазалайды */
export async function POST() {
  return json({ ok: true }, 200, { 'set-cookie': clearTwoFactorCookieHeader(isSecureEnv()) })
}
