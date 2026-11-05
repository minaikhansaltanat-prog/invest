import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

// TOTP (RFC 6238, HMAC-SHA1, 6 сан, 30 секунд): әкімші панелінде міндетті, инвестор деректер бөлмесін ашу үшін міндетті (ТТ 14.1).
// Сыртқы кітапхана жоқ: Node crypto ғана. QR суреті жасалмайды, пайдаланушы кілтті немесе otpauth:// сілтемесін қолмен енгізеді.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0
  let value = 0
  let out = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31]
  return out
}

export function base32Decode(text: string): Buffer {
  const clean = text.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase()
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const char of clean) {
    const index = ALPHABET.indexOf(char)
    if (index === -1) throw new Error('invalid-base32')
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

/** 160 бит (20 байт) кездейсоқ кілт, base32 жолы */
export const generateTotpSecret = (): string => base32Encode(randomBytes(20))

export function totpCode(
  secret: string,
  options: { now?: number; step?: number; digits?: number; counterOffset?: number } = {},
): string {
  const { now = Date.now(), step = 30, digits = 6, counterOffset = 0 } = options
  const counter = Math.floor(now / 1000 / step) + counterOffset
  const message = Buffer.alloc(8)
  message.writeBigUInt64BE(BigInt(counter))
  const digest = createHmac('sha1', base32Decode(secret)).update(message).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary =
    ((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3]
  return String(binary % 10 ** digits).padStart(digits, '0')
}

/** Код ағымдағы қадамда немесе көрші қадамдарда (saat ауытқуы үшін ±window) сәйкес келе ме */
export function verifyTotp(secret: string, code: string, options: { now?: number; window?: number; digits?: number } = {}): boolean {
  const { now = Date.now(), window = 1, digits = 6 } = options
  const normalized = code.replace(/\s+/g, '')
  if (!/^\d+$/.test(normalized) || normalized.length !== digits) return false
  let matched = false
  for (let offset = -window; offset <= window; offset++) {
    const expected = Buffer.from(totpCode(secret, { now, digits, counterOffset: offset }))
    const given = Buffer.from(normalized)
    if (expected.length === given.length && timingSafeEqual(expected, given)) matched = true
  }
  return matched
}

export function otpauthUri({ issuer, account, secret }: { issuer: string; account: string; secret: string }): string {
  const label = encodeURIComponent(`${issuer}:${account}`)
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}
