import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'

// ALTCHA-үйлесімді proof-of-work тексеру (ТТ 18.2, 6-кезең): Google reCAPTCHA жоқ, сыртқы сервис жоқ, дерек сыртқа шықпайды.
// Хаттама altcha-lib-пен бірдей: challenge = SHA-256(salt + number), signature = HMAC-SHA256(challenge, құпия кілт),
// salt ішінде ?expires=<unix сек> бар. Клиент 0..maxnumber аралығында number табады (src/lib/security/altcha-client.ts).

export type AltchaChallenge = {
  algorithm: 'SHA-256'
  challenge: string
  salt: string
  signature: string
  maxnumber: number
}

const sha256Hex = (value: string) => createHash('sha256').update(value).digest('hex')
const hmacHex = (secret: string, value: string) => createHmac('sha256', secret).update(value).digest('hex')

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createChallenge(
  secret: string,
  options: { maxNumber?: number; expiresInSec?: number; now?: number } = {},
): AltchaChallenge {
  const { maxNumber = 50_000, expiresInSec = 600, now = Date.now() } = options
  const expires = Math.floor(now / 1000) + expiresInSec
  const salt = `${randomBytes(12).toString('hex')}?expires=${expires}`
  const number = randomInt(0, maxNumber + 1)
  const challenge = sha256Hex(`${salt}${number}`)
  return { algorithm: 'SHA-256', challenge, salt, signature: hmacHex(secret, challenge), maxnumber: maxNumber }
}

type Payload = { algorithm: string; challenge: string; number: number; salt: string; signature: string }

const used = new Map<string, number>()

/** Бір challenge екінші рет қолданылмасын (replay қорғанысы): жад ішіндегі тізім, мерзімі өткендері тазаланады */
function consume(challenge: string, expiresAt: number, now: number): boolean {
  for (const [key, expiry] of used) if (expiry <= now) used.delete(key)
  if (used.has(challenge)) return false
  used.set(challenge, expiresAt)
  return true
}

export type AltchaResult = { ok: true } | { ok: false; reason: 'malformed' | 'signature' | 'expired' | 'solution' | 'replay' }

/** Клиент жіберген base64 JSON шешімін тексереді. Сәтті болса, challenge «қолданылды» деп белгіленеді. */
export function verifySolution(secret: string, payload: string | null | undefined, now: number = Date.now()): AltchaResult {
  if (!payload) return { ok: false, reason: 'malformed' }
  let data: Payload
  try {
    data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) as Payload
  } catch {
    return { ok: false, reason: 'malformed' }
  }
  if (
    data?.algorithm !== 'SHA-256' ||
    typeof data.challenge !== 'string' ||
    typeof data.salt !== 'string' ||
    typeof data.signature !== 'string' ||
    !Number.isInteger(data.number) ||
    data.number < 0 ||
    data.number > 10_000_000
  ) {
    return { ok: false, reason: 'malformed' }
  }
  if (!safeEqual(hmacHex(secret, data.challenge), data.signature)) return { ok: false, reason: 'signature' }

  const expires = Number(new URLSearchParams(data.salt.split('?')[1] ?? '').get('expires'))
  if (!Number.isFinite(expires) || expires * 1000 < now) return { ok: false, reason: 'expired' }

  if (!safeEqual(sha256Hex(`${data.salt}${data.number}`), data.challenge)) return { ok: false, reason: 'solution' }
  if (!consume(data.challenge, expires * 1000, now)) return { ok: false, reason: 'replay' }
  return { ok: true }
}
