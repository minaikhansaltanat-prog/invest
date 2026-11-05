import { describe, expect, it } from 'vitest'

import { canPromoteToLevel, canPublishToCatalog } from '@/lib/investment/projectRules'
import { toFourAmounts, toMatchInvestor, toMatchProject, toNdaRecord, toProjectRecord, toScoringConfig } from '@/lib/investment/records'
import { defaultScoringConfig } from '@/lib/scoring/config'

// 7-кезең: Payload құжаттарын ереже кітапханасының түрлеріне келтіру (ТТ 8). Бос және жарамсыз дерек қауіпсіз жағына ауытқиды.

describe('toScoringConfig', () => {
  const valid = {
    dimensions: [
      { key: 'a', weight: 60 },
      { key: 'b', weight: 40 },
    ],
    grades: [
      { key: 'A', min: 80, max: 100 },
      { key: 'B', min: 65, max: 79 },
      { key: 'C', min: 50, max: 64 },
      { key: 'D', min: 0, max: 49 },
    ],
  }

  it('жарамды баптауды өзгеріссіз береді', () => {
    expect(toScoringConfig(valid).dimensions).toEqual(valid.dimensions)
  })

  it('салмақ қосындысы 100 емес, бос немесе жоқ баптау: әдепкі баптау (бұзылған конфигпен бағаланбайды)', () => {
    expect(toScoringConfig({ ...valid, dimensions: [{ key: 'a', weight: 70 }, { key: 'b', weight: 40 }] })).toBe(defaultScoringConfig)
    expect(toScoringConfig({})).toBe(defaultScoringConfig)
    expect(toScoringConfig(null)).toBe(defaultScoringConfig)
  })
})

describe('toProjectRecord', () => {
  it('ішкі өрістер ереже кітапханасына дұрыс түседі: иесі, сомалар, дәлел файлдарының саны', () => {
    const record = toProjectRecord({
      level: '2',
      region: 'astana',
      stage: '3',
      publishToCatalog: true,
      internal: {
        ownerName: 'Иесі',
        purpose: 'Мақсат',
        documentsVerified: true,
        responsibleManager: { id: 5, name: 'Менеджер' },
        amounts: { declared: 10, loi: 8, contract: 5, received: 2, receivedEvidence: [1, 2], associationContribution: 'direct' },
      },
    })
    expect(record.owner).toEqual({ id: null, name: 'Иесі' })
    expect(record.responsibleManager).toEqual({ name: 'Менеджер' })
    expect(record.amounts).toMatchObject({ declared: 10, loi: 8, contract: 5, received: 2, receivedEvidenceFiles: 2, associationContribution: 'direct' })
    expect(record.stage).toBe('3')
  })

  it('құжат толық емес болса, ереже қауіпсіз жағына ауытқиды', () => {
    const record = toProjectRecord({ level: '1' })
    expect(canPromoteToLevel(record, '2').ok).toBe(false)
    expect(canPublishToCatalog({ ...record, publishToCatalog: true }).ok).toBe(false)
    expect(toFourAmounts(undefined)).toMatchObject({ declared: null, received: null, receivedEvidenceFiles: 0 })
  })

  it('иесі байланыс құжаты бар жоба 1-деңгей шартын орындайды (иесі, орны, мақсаты)', () => {
    const record = toProjectRecord({ level: '1', region: 'astana', internal: { ownerOrganization: { id: 9 }, purpose: 'Мақсат' } })
    expect(record.owner?.id).toBe('9')
    expect(canPromoteToLevel({ ...record, level: null }, '1').ok).toBe(true)
  })
})

describe('инвестор, жоба, NDA сәйкестендіру түрлері', () => {
  it('toMatchInvestor: бос өрістер қауіпсіз мәнге келтіріледі', () => {
    const investor = toMatchInvestor({ id: 7 })
    expect(investor).toMatchObject({ id: '7', grade: null, sectors: [], regions: [], models: [], minAmountMusd: null })
    expect(investor.veto).toEqual({ active: false, reason: null })
  })

  it('toMatchProject', () => {
    expect(toMatchProject(3, { sector: 'energy', region: 'astana', model: 'ppp', amountMusd: 40, internal: { riskLevel: 'low' } })).toEqual({
      id: '3',
      sector: 'energy',
      region: 'astana',
      model: 'ppp',
      amountMusd: 40,
      riskLevel: 'low',
    })
  })

  it('toNdaRecord: байланыстар id-ге айналады, жоқ NDA null', () => {
    expect(toNdaRecord(null)).toBeNull()
    expect(toNdaRecord({ project: { id: 4 }, investor: 8, signedAt: '2026-11-05T00:00:00Z', expiresAt: '2027-02-03T00:00:00Z', revokedAt: null })).toEqual({
      projectId: '4',
      investorId: '8',
      signedAt: '2026-11-05T00:00:00Z',
      expiresAt: '2027-02-03T00:00:00Z',
      revokedAt: null,
    })
  })
})
