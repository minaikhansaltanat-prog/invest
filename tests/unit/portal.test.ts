import { afterEach, describe, expect, it } from 'vitest'

import { hasAdminRole, isAdminUser, verifiedAdmin } from '@/access'
import { loginSchema, registerErrors, registerSchema } from '@/lib/forms/auth'
import { adminTwoFactorRequired } from '@/lib/portal/env'
import { passwordProblems } from '@/lib/portal/password'
import { buildReference, hashIp } from '@/lib/portal/submissions'
import { TWO_FACTOR_COOKIE, hasValidTwoFactor, readCookie, signTwoFactor, verifyTwoFactor } from '@/lib/portal/twofactor'

// 6-кезең: 2FA белгісі (cookie), әкімші қақпасы, құпия сөз саясаты, тіркелу схемасы, өтініш нөмірі.

const secret = 'unit-test-secret'

describe('2FA белгісі (cookie)', () => {
  it('қол қойылған белгі сол пайдаланушы мен коллекция үшін жарайды', () => {
    const value = signTwoFactor(7, 'admins', { secret })
    expect(verifyTwoFactor(value, 7, 'admins', { secret })).toBe(true)
    expect(verifyTwoFactor(value, 8, 'admins', { secret })).toBe(false)
    expect(verifyTwoFactor(value, 7, 'users', { secret })).toBe(false)
  })

  it('мерзімі өткен, өзгертілген және бөтен кілтпен қол қойылған белгі қабылданбайды', () => {
    const now = 1_700_000_000_000
    const value = signTwoFactor(1, 'users', { secret, now, ttlSec: 60 })
    expect(verifyTwoFactor(value, 1, 'users', { secret, now: now + 59_000 })).toBe(true)
    expect(verifyTwoFactor(value, 1, 'users', { secret, now: now + 61_000 })).toBe(false)
    expect(verifyTwoFactor(value.replace('.users.', '.admins.'), 1, 'admins', { secret, now })).toBe(false)
    expect(verifyTwoFactor(value, 1, 'users', { secret: 'other', now })).toBe(false)
    expect(verifyTwoFactor('garbage', 1, 'users', { secret })).toBe(false)
    expect(verifyTwoFactor(null, 1, 'users', { secret })).toBe(false)
  })

  it('cookie тақырыбынан оқу', () => {
    expect(readCookie('a=1; kfca-2fa=abc%2Edef; b=2', 'kfca-2fa')).toBe('abc.def')
    expect(readCookie('a=1', 'kfca-2fa')).toBeUndefined()
    expect(readCookie(null, 'x')).toBeUndefined()
  })

  it('hasValidTwoFactor сұраудың cookie-імен жұмыс істейді', () => {
    const previous = process.env.PAYLOAD_SECRET
    process.env.PAYLOAD_SECRET = secret
    try {
      const value = signTwoFactor(3, 'admins')
      const headers = new Headers({ cookie: `${TWO_FACTOR_COOKIE}=${encodeURIComponent(value)}` })
      expect(hasValidTwoFactor(headers, { id: 3, collection: 'admins' })).toBe(true)
      expect(hasValidTwoFactor(headers, { id: 4, collection: 'admins' })).toBe(false)
      expect(hasValidTwoFactor(new Headers(), { id: 3, collection: 'admins' })).toBe(false)
      expect(hasValidTwoFactor(headers, null)).toBe(false)
    } finally {
      if (previous === undefined) delete process.env.PAYLOAD_SECRET
      else process.env.PAYLOAD_SECRET = previous
    }
  })
})

describe('әкімші қақпасы (ТТ 14.1)', () => {
  const admin = { id: 5, collection: 'admins', roles: ['secretariat'] }
  const saved = { ADMIN_2FA: process.env.ADMIN_2FA, PAYLOAD_SECRET: process.env.PAYLOAD_SECRET }

  afterEach(() => {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  it('ADMIN_2FA=off: 2FA белгісінсіз де әкімші танылады', () => {
    process.env.ADMIN_2FA = 'off'
    expect(adminTwoFactorRequired()).toBe(false)
    expect(isAdminUser({ user: admin as never })).toBe(true)
    expect(hasAdminRole({ user: admin as never }, 'secretariat')).toBe(true)
  })

  it('ADMIN_2FA=on: белгісіз әкімші ешқандай құқық алмайды, белгімен алады', () => {
    process.env.ADMIN_2FA = 'on'
    process.env.PAYLOAD_SECRET = secret
    expect(adminTwoFactorRequired()).toBe(true)
    expect(isAdminUser({ user: admin as never })).toBe(false)
    expect(hasAdminRole({ user: admin as never, headers: new Headers() }, 'secretariat')).toBe(false)

    const cookie = encodeURIComponent(signTwoFactor(5, 'admins'))
    const headers = new Headers({ cookie: `${TWO_FACTOR_COOKIE}=${cookie}` })
    expect(isAdminUser({ user: admin as never, headers })).toBe(true)
    expect(verifiedAdmin({ user: admin as never, headers })?.roles).toEqual(['secretariat'])
    expect(hasAdminRole({ user: admin as never, headers }, 'secretariat')).toBe(true)
    expect(hasAdminRole({ user: admin as never, headers }, 'chair')).toBe(false)
  })

  it('сайт пайдаланушысы ешқашан қызметкер емес', () => {
    process.env.ADMIN_2FA = 'off'
    expect(isAdminUser({ user: { id: 1, collection: 'users', roles: ['investor'] } as never })).toBe(false)
    expect(isAdminUser({ user: null })).toBe(false)
  })

  it('өндірісте (NODE_ENV=production) әдепкіде міндетті, ADMIN_2FA=off өшіреді', () => {
    const env = process.env as Record<string, string | undefined>
    const previous = env.NODE_ENV
    try {
      env.NODE_ENV = 'production'
      delete env.ADMIN_2FA
      expect(adminTwoFactorRequired()).toBe(true)
      env.ADMIN_2FA = 'off'
      expect(adminTwoFactorRequired()).toBe(false)
    } finally {
      env.NODE_ENV = previous
    }
  })
})

describe('құпия сөз саясаты', () => {
  it('жақсы құпия сөз өтеді', () => {
    expect(passwordProblems('Qazaqstan-2026-ok', 'a@b.kz')).toEqual([])
    expect(passwordProblems('ұзынпарольқазақша1', '')).toEqual([])
  })

  it('қысқа, әріпсіз, сансыз, жиі және поштаға ұқсас құпия сөз қабылданбайды', () => {
    expect(passwordProblems('Short1')).toContain('too-short')
    expect(passwordProblems('123456789012345')).toContain('no-letter')
    expect(passwordProblems('abcdefghijklmnop')).toContain('no-digit')
    expect(passwordProblems('password1234')).toContain('common')
    expect(passwordProblems('Askhat-nurlan-2026', 'askhat@example.kz')).toContain('contains-email')
    expect(passwordProblems('a'.repeat(129) + '1')).toContain('too-long')
  })
})

describe('тіркелу және кіру схемалары', () => {
  const base = {
    name: 'Асхат Нұрлан',
    email: 'Askhat@Example.com',
    password: 'Strong-pass-2026',
    passwordConfirm: 'Strong-pass-2026',
    roles: ['investor'],
    locale: 'kk',
    consent: true,
    altcha: 'payload',
  }

  it('дұрыс дерек өтеді, пошта кіші әріпке келтіріледі', () => {
    const result = registerSchema.safeParse(base)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('askhat@example.com')
  })

  it('кодтар: әлсіз құпия сөз, сәйкес емес, рөлсіз, келісімсіз', () => {
    const input = { ...base, password: 'short', passwordConfirm: 'other', roles: [], consent: false }
    expect(registerSchema.safeParse(input).success).toBe(false)
    // барлық қате бірден: Zod консенттің қатесінде superRefine орындамайды, registerErrors оларды қосады
    expect(registerErrors(input)).toMatchObject({ password: 'weak', passwordConfirm: 'mismatch', roles: 'required', consent: 'required' })
    expect(registerErrors(base)).toEqual({})
  })

  it('құпия сөз поштаның атын қамтыса, weak', () => {
    expect(registerErrors({ ...base, email: 'askhat@example.com', password: 'Askhat-2026-pass', passwordConfirm: 'Askhat-2026-pass' })).toMatchObject({ password: 'weak' })
  })

  it('қызметкер рөлін тіркелу арқылы алуға болмайды', () => {
    expect(registerSchema.safeParse({ ...base, roles: ['super-admin'] }).success).toBe(false)
    expect(registerSchema.safeParse({ ...base, roles: ['investor', 'chair'] }).success).toBe(false)
  })

  it('honeypot толтырылса, қабылданбайды', () => {
    expect(registerSchema.safeParse({ ...base, hp: 'bot' }).success).toBe(false)
  })

  it('кіру схемасы: пошта форматы, бос құпия сөз', () => {
    expect(loginSchema.safeParse({ email: 'x', password: '' }).success).toBe(false)
    expect(loginSchema.safeParse({ email: 'a@b.kz', password: 'x' }).success).toBe(true)
  })
})

describe('өтініш нөмірі мен IP хэші', () => {
  it('нөмір пішімі KF-ЖЖ-ТҮР-XXXXXX, ұқсас таңбасыз', () => {
    const reference = buildReference('investor', new Date('2026-11-05T10:00:00Z'))
    expect(reference).toMatch(/^KF-26-INV-[A-HJ-NP-Z2-9]{6}$/)
    expect(buildReference('contact', new Date('2027-01-01T00:00:00Z'))).toMatch(/^KF-27-C-/)
    expect(buildReference('project')).toMatch(/-PRJ-/)
    expect(buildReference('membership')).toMatch(/-MEM-/)
  })

  it('нөмірлер қайталанбайды (1000 ішінде)', () => {
    const set = new Set(Array.from({ length: 1000 }, () => buildReference('contact')))
    expect(set.size).toBe(1000)
  })

  it('IP хэші тұрақты, қысқа, IP-ді ашпайды', () => {
    const hash = hashIp('203.0.113.9', secret)
    expect(hash).toBe(hashIp('203.0.113.9', secret))
    expect(hash).toHaveLength(16)
    expect(hash.includes('203')).toBe(false)
    expect(hash).not.toBe(hashIp('203.0.113.10', secret))
  })
})
