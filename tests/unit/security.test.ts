import { createHash } from 'node:crypto'

import { beforeEach, describe, expect, it } from 'vitest'

import { createChallenge, verifySolution } from '@/lib/security/altcha'
import { rateLimit, resetRateLimits } from '@/lib/security/rateLimit'
import { decryptSecret, encryptSecret } from '@/lib/security/secretBox'
import { base32Decode, base32Encode, generateTotpSecret, otpauthUri, totpCode, verifyTotp } from '@/lib/security/totp'

// 6-кезең: ALTCHA, TOTP (RFC 6238), құпия қорап (AES-GCM), rate limit.

const secret = 'test-secret-not-real'

function solve(challenge: ReturnType<typeof createChallenge>): string {
  for (let number = 0; number <= challenge.maxnumber; number++) {
    if (createHash('sha256').update(`${challenge.salt}${number}`).digest('hex') === challenge.challenge) {
      return Buffer.from(JSON.stringify({ ...pickFields(challenge), number })).toString('base64')
    }
  }
  throw new Error('unsolved')
}
const pickFields = (c: ReturnType<typeof createChallenge>) => ({
  algorithm: c.algorithm,
  challenge: c.challenge,
  salt: c.salt,
  signature: c.signature,
})

describe('ALTCHA proof-of-work', () => {
  it('дұрыс шешім қабылданады, challenge бір рет қана жарайды (replay жоқ)', () => {
    const challenge = createChallenge(secret, { maxNumber: 300 })
    const payload = solve(challenge)
    expect(verifySolution(secret, payload)).toEqual({ ok: true })
    expect(verifySolution(secret, payload)).toEqual({ ok: false, reason: 'replay' })
  })

  it('қате кілтпен қол қойылған challenge қабылданбайды', () => {
    const payload = solve(createChallenge('other-secret', { maxNumber: 300 }))
    expect(verifySolution(secret, payload)).toEqual({ ok: false, reason: 'signature' })
  })

  it('мерзімі өткен challenge қабылданбайды', () => {
    const now = Date.now()
    const payload = solve(createChallenge(secret, { maxNumber: 300, expiresInSec: 60, now }))
    expect(verifySolution(secret, payload, now + 61_000)).toEqual({ ok: false, reason: 'expired' })
  })

  it('қате number (шешілмеген) қабылданбайды', () => {
    const challenge = createChallenge(secret, { maxNumber: 300 })
    const solved = JSON.parse(Buffer.from(solve(challenge), 'base64').toString()) as { number: number }
    const wrong = Buffer.from(JSON.stringify({ ...pickFields(challenge), number: solved.number + 1 })).toString('base64')
    expect(verifySolution(secret, wrong)).toEqual({ ok: false, reason: 'solution' })
  })

  it('бос, бүлінген және алгоритмі басқа дерек қабылданбайды', () => {
    expect(verifySolution(secret, null)).toEqual({ ok: false, reason: 'malformed' })
    expect(verifySolution(secret, 'not-base64-json')).toEqual({ ok: false, reason: 'malformed' })
    const bad = Buffer.from(JSON.stringify({ algorithm: 'MD5', challenge: 'x', salt: 'y', signature: 'z', number: 1 })).toString('base64')
    expect(verifySolution(secret, bad)).toEqual({ ok: false, reason: 'malformed' })
  })
})

describe('TOTP (RFC 6238)', () => {
  // RFC 6238 қосымшасы: SHA-1 кілті ASCII "12345678901234567890"
  const rfcSecret = base32Encode(Buffer.from('12345678901234567890'))

  it('base32 кері түрлендіру дәл', () => {
    expect(rfcSecret).toBe('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ')
    expect(base32Decode(rfcSecret).toString()).toBe('12345678901234567890')
  })

  it.each([
    [59, '94287082'],
    [1111111109, '07081804'],
    [1111111111, '14050471'],
    [1234567890, '89005924'],
    [2000000000, '69279037'],
  ])('T=%i үшін 8 таңбалы код %s (RFC вектор)', (time, expected) => {
    expect(totpCode(rfcSecret, { now: time * 1000, digits: 8 })).toBe(expected)
  })

  it('6 таңбалы код 8 таңбалының соңғы 6 саны', () => {
    expect(totpCode(rfcSecret, { now: 59_000 })).toBe('287082')
  })

  it('verifyTotp ағымдағы және көрші қадамды қабылдайды, алыс қадамды қабылдамайды', () => {
    const now = 1_700_000_000_000
    const code = totpCode(rfcSecret, { now })
    expect(verifyTotp(rfcSecret, code, { now })).toBe(true)
    expect(verifyTotp(rfcSecret, code, { now: now + 30_000 })).toBe(true)
    expect(verifyTotp(rfcSecret, code, { now: now + 120_000 })).toBe(false)
  })

  it('қате пішімді код қабылданбайды', () => {
    expect(verifyTotp(rfcSecret, '12345')).toBe(false)
    expect(verifyTotp(rfcSecret, 'abcdef')).toBe(false)
    expect(verifyTotp(rfcSecret, '')).toBe(false)
  })

  it('жаңа кілт 32 таңба, otpauth сілтемесі issuer мен кілтті қамтиды', () => {
    const generated = generateTotpSecret()
    expect(generated).toMatch(/^[A-Z2-7]{32}$/)
    const uri = otpauthUri({ issuer: 'KFCA', account: 'a@b.test', secret: generated })
    expect(uri.startsWith('otpauth://totp/KFCA%3Aa%40b.test?secret=')).toBe(true)
    expect(uri).toContain(`secret=${generated}`)
  })
})

describe('secretBox (AES-256-GCM)', () => {
  it('шифрлап, қайта ашады; шифрланған жол ашық мәтінді қамтымайды', () => {
    const boxed = encryptSecret('JBSWY3DPEHPK3PXP', secret)
    expect(boxed.startsWith('v1.')).toBe(true)
    expect(boxed.includes('JBSWY3DPEHPK3PXP')).toBe(false)
    expect(decryptSecret(boxed, secret)).toBe('JBSWY3DPEHPK3PXP')
  })

  it('әр шифрлау әртүрлі (кездейсоқ iv), қате кілт пен өзгертілген дерек ашылмайды', () => {
    expect(encryptSecret('x', secret)).not.toBe(encryptSecret('x', secret))
    const boxed = encryptSecret('құпия', secret)
    expect(() => decryptSecret(boxed, 'wrong-secret')).toThrow()
    const parts = boxed.split('.')
    parts[3] = Buffer.from('tampered').toString('base64url')
    expect(() => decryptSecret(parts.join('.'), secret)).toThrow()
    expect(() => decryptSecret('garbage', secret)).toThrow()
  })
})

describe('rateLimit', () => {
  beforeEach(() => resetRateLimits())

  it('шектен асқанда тоқтатады және қанша күту керегін айтады', () => {
    const now = 1_000_000
    for (let i = 0; i < 3; i++) expect(rateLimit('ip:1', { limit: 3, windowMs: 60_000, now: now + i }).ok).toBe(true)
    const blocked = rateLimit('ip:1', { limit: 3, windowMs: 60_000, now: now + 10 })
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfterMs).toBeGreaterThan(0)
    expect(blocked.retryAfterMs).toBeLessThanOrEqual(60_000)
  })

  it('терезе өткеннен кейін қайта рұқсат етіледі, кілттер бір-біріне әсер етпейді', () => {
    const now = 5_000_000
    for (let i = 0; i < 2; i++) rateLimit('a', { limit: 2, windowMs: 1000, now })
    expect(rateLimit('a', { limit: 2, windowMs: 1000, now: now + 10 }).ok).toBe(false)
    expect(rateLimit('b', { limit: 2, windowMs: 1000, now: now + 10 }).ok).toBe(true)
    expect(rateLimit('a', { limit: 2, windowMs: 1000, now: now + 1001 }).ok).toBe(true)
  })
})
