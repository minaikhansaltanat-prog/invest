import { describe, expect, it } from 'vitest'

import {
  canAccessDataroom,
  type DataroomInvestor,
  defaultNdaDays,
  describeAccessLog,
  ndaExpiry,
  type NdaRecord,
  watermarkText,
} from '@/lib/investment/dataroom'

// NDA және деректер бөлмесі (ТТ 8.6, 14.1): NDA, мерзім, кері алу, деңгей, вето, 2FA, су белгісі, журнал.

const now = new Date('2026-11-05T09:00:00Z')
const project = { id: 'p-1' }
const investor: DataroomInvestor = { id: 'inv-1', grade: 'A', veto: null }
/** 2026-10-01 + 90 күн = 2026-12-30 */
const nda: NdaRecord = { projectId: 'p-1', investorId: 'inv-1', signedAt: '2026-10-01T10:00:00Z' }

type AccessInput = Parameters<typeof canAccessDataroom>[0]
const access = (overrides: Partial<AccessInput> = {}) =>
  canAccessDataroom({ nda, investor, project, now, twoFactorVerified: true, ...overrides })

describe('ndaExpiry: қатынас мерзімі', () => {
  it('әдепкі мерзім 90 күн', () => {
    expect(defaultNdaDays).toBe(90)
    expect(ndaExpiry('2026-01-01T00:00:00Z').toISOString()).toBe('2026-04-01T00:00:00.000Z')
  })

  it('мерзімді өзгертуге болады', () => {
    expect(ndaExpiry('2026-10-01T10:00:00Z', 30).toISOString()).toBe('2026-10-31T10:00:00.000Z')
  })

  it('Date және ISO жол бірдей нәтиже береді', () => {
    const fromString = ndaExpiry('2026-10-01T10:00:00Z')
    const fromDate = ndaExpiry(new Date('2026-10-01T10:00:00Z'))
    expect(fromDate.getTime()).toBe(fromString.getTime())
  })

  it('жарамсыз күннен жарамсыз Date шығады', () => {
    expect(Number.isNaN(ndaExpiry('күні жоқ').getTime())).toBe(true)
  })
})

describe('canAccessDataroom: NDA', () => {
  it('NDA бар, мерзімі өтпеген, A деңгейі, 2FA расталған: қатынас ашық', () => {
    expect(access()).toEqual({ allowed: true, reason: null })
  })

  it('B деңгейлі инвестор да кіре алады', () => {
    expect(access({ investor: { ...investor, grade: 'B' } }).allowed).toBe(true)
  })

  it('NDA-сыз деректер бөлмесі жабық', () => {
    expect(access({ nda: null })).toEqual({ allowed: false, reason: 'nda-missing' })
    expect(access({ nda: undefined })).toEqual({ allowed: false, reason: 'nda-missing' })
  })

  it('басқа жобаға қол қойылған NDA қатынас бермейді', () => {
    expect(access({ nda: { ...nda, projectId: 'p-2' } })).toEqual({
      allowed: false,
      reason: 'nda-missing',
    })
  })

  it('басқа инвесторға тиесілі NDA қатынас бермейді', () => {
    expect(access({ nda: { ...nda, investorId: 'inv-2' } })).toEqual({
      allowed: false,
      reason: 'nda-missing',
    })
  })

  it('қол қойылған күні жарамсыз NDA есепке алынбайды', () => {
    expect(access({ nda: { ...nda, signedAt: 'белгісіз' } }).reason).toBe('nda-missing')
  })

  it('NDA мерзімі өткен деректер бөлмесі жабық', () => {
    const old: NdaRecord = { ...nda, signedAt: '2026-07-01T00:00:00Z' }
    expect(access({ nda: old })).toEqual({ allowed: false, reason: 'nda-expired' })
  })

  it('мерзім шекарасы: 89-шы күні ашық, дәл 90-шы күні жабық', () => {
    expect(access({ now: new Date('2026-12-29T10:00:00Z') }).allowed).toBe(true)
    expect(access({ now: new Date('2026-12-30T10:00:00Z') })).toEqual({
      allowed: false,
      reason: 'nda-expired',
    })
    expect(access({ now: new Date('2026-12-31T10:00:00Z') }).reason).toBe('nda-expired')
  })

  it('сақталған аяқталу күні (expiresAt) берілсе, 90 күн емес, сол қолданылады', () => {
    const earlier: NdaRecord = { ...nda, expiresAt: '2026-11-01T00:00:00Z' }
    expect(access({ nda: earlier }).reason).toBe('nda-expired')
    const longer: NdaRecord = { ...nda, signedAt: '2026-06-01T00:00:00Z', expiresAt: '2027-01-01T00:00:00Z' }
    expect(access({ nda: longer }).allowed).toBe(true)
  })

  it('қатынас күні қысқартылса (30 күн), NDA ертерек аяқталады', () => {
    expect(access({ nda: { ...nda, accessDays: 30 } }).reason).toBe('nda-expired')
  })

  it('кері алынған NDA мерзімі өтпесе де қатынас бермейді', () => {
    const revoked: NdaRecord = { ...nda, revokedAt: '2026-11-01T00:00:00Z' }
    expect(access({ nda: revoked })).toEqual({ allowed: false, reason: 'nda-revoked' })
  })

  it('кері алу белгісі болашақ күнмен қойылса да қатынас жабық (қауіпсіз жағы)', () => {
    expect(access({ nda: { ...nda, revokedAt: '2027-01-01T00:00:00Z' } }).reason).toBe('nda-revoked')
  })

  it('кері алынған әрі мерзімі өткен NDA үшін себеп: nda-revoked', () => {
    const both: NdaRecord = { ...nda, signedAt: '2026-01-01T00:00:00Z', revokedAt: '2026-02-01T00:00:00Z' }
    expect(access({ nda: both }).reason).toBe('nda-revoked')
  })

  it('now жарамсыз болса, қатынас жабық', () => {
    expect(access({ now: 'жарамсыз' }).allowed).toBe(false)
  })
})

describe('canAccessDataroom: инвестор деңгейі, вето және 2FA', () => {
  it.each([['C' as const], ['D' as const], [null]])('%s деңгейлі инвестор NDA-сы болса да кіре алмайды', (grade) => {
    expect(access({ investor: { ...investor, grade } })).toEqual({
      allowed: false,
      reason: 'grade-too-low',
    })
  })

  it('вето белсенді инвестор (A деңгейі, NDA бар) кіре алмайды', () => {
    const vetoed: DataroomInvestor = {
      ...investor,
      veto: { active: true, reason: 'Қаражат көзі расталмаған' },
    }
    expect(access({ investor: vetoed })).toEqual({ allowed: false, reason: 'veto-active' })
  })

  it('вето белсенді емес болса, қатынасқа кедергі жоқ', () => {
    const lifted: DataroomInvestor = { ...investor, veto: { active: false, reason: 'Тексеру аяқталды' } }
    expect(access({ investor: lifted }).allowed).toBe(true)
  })

  it('2FA расталмаса, басқа шарттар орындалса да деректер бөлмесі жабық', () => {
    expect(access({ twoFactorVerified: false })).toEqual({
      allowed: false,
      reason: 'two-factor-required',
    })
  })

  it('себептер реті: вето деңгейден, ал NDA мен 2FA-дан бұрын тексеріледі', () => {
    const vetoedWeak: DataroomInvestor = { ...investor, grade: 'D', veto: { active: true, reason: 'OFAC' } }
    expect(access({ investor: vetoedWeak, nda: null, twoFactorVerified: false }).reason).toBe('veto-active')
    const weak: DataroomInvestor = { ...investor, grade: 'D' }
    expect(access({ investor: weak, nda: null, twoFactorVerified: false }).reason).toBe('grade-too-low')
  })

  it('2FA ең соңында тексеріледі: NDA жоқ инвесторға nda-missing қайтады', () => {
    expect(access({ nda: null, twoFactorVerified: false }).reason).toBe('nda-missing')
    expect(access({ nda: { ...nda, revokedAt: '2026-11-01T00:00:00Z' }, twoFactorVerified: false }).reason).toBe(
      'nda-revoked',
    )
  })
})

describe('watermarkText: жеке су белгісі (ТТ 8.6)', () => {
  it('су белгісі аты мен күннен тұрады', () => {
    expect(watermarkText('Li Wei', now)).toBe('Li Wei | 2026-11-05')
  })

  it('қазақша аттар сақталады', () => {
    expect(watermarkText('Әлия Сәрсенбай', now)).toBe('Әлия Сәрсенбай | 2026-11-05')
  })

  it('артық бос орындар қысқарады', () => {
    expect(watermarkText('  Li   Wei  ', now)).toBe('Li Wei | 2026-11-05')
  })

  it('Date, ISO жол және миллисекунд бірдей мәтін береді', () => {
    const expected = 'Li Wei | 2026-11-05'
    expect(watermarkText('Li Wei', '2026-11-05T09:00:00Z')).toBe(expected)
    expect(watermarkText('Li Wei', now.getTime())).toBe(expected)
  })

  it('күн UTC бойынша алынады', () => {
    expect(watermarkText('Li Wei', '2026-11-05T23:30:00Z')).toBe('Li Wei | 2026-11-05')
    expect(watermarkText('Li Wei', '2026-11-05T23:30:00-05:00')).toBe('Li Wei | 2026-11-06')
  })

  it('аты бос болса, су белгісі жасалмайды', () => {
    expect(() => watermarkText('   ', now)).toThrow('аты бос')
    expect(() => watermarkText(undefined as unknown as string, now)).toThrow('аты бос')
  })

  it('күні жарамсыз болса, су белгісі жасалмайды', () => {
    expect(() => watermarkText('Li Wei', 'күні жоқ')).toThrow('күн жарамсыз')
  })
})

describe('describeAccessLog: журналға жазылатын жазба (ТТ 8.6)', () => {
  const input = {
    userId: 'u-42',
    action: 'open' as const,
    projectId: 'p-1',
    ip: '203.0.113.7',
    at: now,
  }

  it('жазбада кім, не, қашан, IP бар', () => {
    expect(describeAccessLog(input)).toEqual({
      userId: 'u-42',
      action: 'open',
      projectId: 'p-1',
      fileId: null,
      at: '2026-11-05T09:00:00.000Z',
      ip: '203.0.113.7',
      reason: null,
      message: 'dataroom.open user=u-42 project=p-1 ip=203.0.113.7 at=2026-11-05T09:00:00.000Z',
    })
  })

  it('жүктеу жазбасы файлды көрсетеді', () => {
    const entry = describeAccessLog({ ...input, action: 'download', fileId: 'f-9' })
    expect(entry.fileId).toBe('f-9')
    expect(entry.message).toBe(
      'dataroom.download user=u-42 project=p-1 file=f-9 ip=203.0.113.7 at=2026-11-05T09:00:00.000Z',
    )
  })

  it('IP белгісіз болса, null жазылады', () => {
    const entry = describeAccessLog({ ...input, ip: undefined })
    expect(entry.ip).toBeNull()
    expect(entry.message).toContain('ip=-')
    expect(describeAccessLog({ ...input, ip: '  ' }).ip).toBeNull()
  })

  it('қатынастан бас тарту себебімен жазылады', () => {
    const entry = describeAccessLog({ ...input, action: 'denied', reason: 'nda-expired' })
    expect(entry.reason).toBe('nda-expired')
    expect(entry.message).toContain('dataroom.denied')
    expect(entry.message).toContain('reason=nda-expired')
  })

  it('идентификаторлардағы артық бос орындар қысқарады', () => {
    const entry = describeAccessLog({ ...input, userId: ' u-42 ', projectId: ' p-1 ', fileId: ' f-9 ' })
    expect(entry).toMatchObject({ userId: 'u-42', projectId: 'p-1', fileId: 'f-9' })
  })

  it('пайдаланушы, жоба немесе күн жоқ жазба қабылданбайды', () => {
    expect(() => describeAccessLog({ ...input, userId: '' })).toThrow('userId')
    expect(() => describeAccessLog({ ...input, projectId: '  ' })).toThrow('projectId')
    expect(() => describeAccessLog({ ...input, at: 'жарамсыз' })).toThrow('күн жарамсыз')
  })

  it('таза функция: бірдей кіріс бірдей нәтиже береді, кіріс өзгермейді', () => {
    const before = structuredClone(input)
    expect(describeAccessLog(input)).toEqual(describeAccessLog(input))
    expect(input).toEqual(before)
  })
})
