import config from '@payload-config'
import { getPayload } from 'payload'

/** JSON жауап: кэш жоқ (құпия және динамикалық деректер) */
export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

export const payloadClient = () => getPayload({ config })

/** Сұраудың сессиясы (Payload cookie немесе Authorization: JWT) бойынша пайдаланушы: users немесе admins */
export async function sessionOf(headers: Headers) {
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers })
  return { payload, user: user as ({ id: string | number; collection: 'users' | 'admins'; email: string; name?: string } & Record<string, unknown>) | null }
}

export const isSecure = () => process.env.NODE_ENV === 'production'
