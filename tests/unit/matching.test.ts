import { describe, expect, it } from 'vitest'

import { type MatchInvestor, matchInvestors, type MatchProject } from '@/lib/investment/matching'

// Сәйкестендіру (ТТ 8.5): сүзгі ережелері, тек A және B, вето жоқ, бағасы мерзімі өтпеген.

const now = new Date('2026-11-05T09:00:00Z')

const project: MatchProject = {
  id: 'p-1',
  sector: 'energy',
  region: 'turkistan',
  model: 'ppp',
  amountMusd: 120,
  riskLevel: 'medium',
}

/** Жобаға толық сәйкес келетін A деңгейлі инвестор; ерекшелік `overrides` арқылы беріледі */
const investor = (id: string, overrides: Partial<MatchInvestor> = {}): MatchInvestor => ({
  id,
  grade: 'A',
  veto: null,
  lastAssessedAt: '2026-03-01T00:00:00Z',
  sectors: ['energy', 'logistics'],
  regions: ['turkistan', 'almaty'],
  models: ['ppp', 'bot'],
  minAmountMusd: 50,
  maxAmountMusd: 300,
  riskAppetite: 'medium',
  ...overrides,
})

const suggestedIds = (investors: MatchInvestor[], target: MatchProject = project): string[] =>
  matchInvestors(target, investors, now).suggestions.map((item) => item.investorId)

describe('matchInvestors: деңгей, вето және баға мерзімі', () => {
  it('A деңгейлі сәйкес инвестор ұсынылады, шешімді менеджер қабылдайды', () => {
    const result = matchInvestors(project, [investor('inv-a')], now)
    expect(result.requiresManagerDecision).toBe(true)
    expect(result.suggestions).toHaveLength(1)
    expect(result.suggestions[0]).toMatchObject({
      investorId: 'inv-a',
      grade: 'A',
      matchedCriteria: 5,
    })
  })

  it('B деңгейлі инвестор да ұсынылады', () => {
    const result = matchInvestors(project, [investor('inv-b', { grade: 'B' })], now)
    expect(result.suggestions.map((item) => item.grade)).toEqual(['B'])
  })

  it('D деңгейлі инвестор сәйкестендірілмейді (барлық қалауы сәйкес келсе де)', () => {
    expect(suggestedIds([investor('inv-d', { grade: 'D' })])).toEqual([])
  })

  it('C деңгейлі инвестор сәйкестендірілмейді', () => {
    expect(suggestedIds([investor('inv-c', { grade: 'C' })])).toEqual([])
  })

  it('деңгейі жоқ (бағаланбаған) инвестор сәйкестендірілмейді', () => {
    expect(suggestedIds([investor('new', { grade: null }), investor('new-2', { grade: undefined })])).toEqual(
      [],
    )
  })

  it('вето белсенді инвестор (A деңгейі болса да) ешқашан шықпайды', () => {
    const vetoed = investor('inv-vetoed', { veto: { active: true, reason: 'Санкциялық тәуекел' } })
    const result = matchInvestors(project, [vetoed, investor('inv-ok')], now)
    expect(result.suggestions.map((item) => item.investorId)).toEqual(['inv-ok'])
    expect(JSON.stringify(result)).not.toContain('inv-vetoed')
  })

  it('вето белсенді емес инвестор өтеді', () => {
    const lifted = investor('inv-lifted', { veto: { active: false, reason: 'Тексеру аяқталды' } })
    expect(suggestedIds([lifted])).toEqual(['inv-lifted'])
  })

  it('D, C және вето белсенді инвесторлар аралас тізімде де ешқашан шықпайды', () => {
    const mixed = [
      investor('d', { grade: 'D' }),
      investor('a-ok'),
      investor('c', { grade: 'C' }),
      investor('vetoed', { veto: { active: true, reason: 'Жалған құжат' } }),
      investor('b-ok', { grade: 'B' }),
    ]
    expect(suggestedIds(mixed)).toEqual(['a-ok', 'b-ok'])
  })

  it('бағасының 12 айлық мерзімі өткен инвестор шықпайды', () => {
    expect(suggestedIds([investor('old', { lastAssessedAt: '2025-10-01T00:00:00Z' })])).toEqual([])
  })

  it('баға мерзімінің шекарасы: дәл 12 ай толса шықпайды, бір күн қалса шығады', () => {
    const exactlyYear = investor('edge-expired', { lastAssessedAt: '2025-11-05T09:00:00Z' })
    const dayLeft = investor('edge-valid', { lastAssessedAt: '2025-11-06T09:00:00Z' })
    expect(suggestedIds([exactlyYear, dayLeft])).toEqual(['edge-valid'])
  })

  it('бағаланған күні жоқ инвестор шықпайды', () => {
    expect(suggestedIds([investor('no-date', { lastAssessedAt: null })])).toEqual([])
  })
})

describe('matchInvestors: сала, өңір, модель, көлем және тәуекел', () => {
  it('сала сәйкес келмесе, инвестор шықпайды', () => {
    expect(suggestedIds([investor('agro', { sectors: ['agro', 'mining'] })])).toEqual([])
  })

  it('өңір сәйкес келмесе, инвестор шықпайды', () => {
    expect(suggestedIds([investor('north', { regions: ['pavlodar'] })])).toEqual([])
  })

  it('модель сәйкес келмесе, инвестор шықпайды', () => {
    expect(suggestedIds([investor('equity', { models: ['equity'] })])).toEqual([])
  })

  it('жоба көлемі инвестордың аралығынан тыс болса, шықпайды', () => {
    expect(suggestedIds([investor('small', { minAmountMusd: 500, maxAmountMusd: 900 })])).toEqual([])
    expect(suggestedIds([investor('tiny', { minAmountMusd: 1, maxAmountMusd: 20 })])).toEqual([])
  })

  it('көлем аралығының шекаралары қосылады (120 млн $ = 120 шегі)', () => {
    expect(suggestedIds([investor('exact', { minAmountMusd: 120, maxAmountMusd: 120 })])).toEqual([
      'exact',
    ])
    expect(suggestedIds([investor('above', { minAmountMusd: 121, maxAmountMusd: 400 })])).toEqual([])
    expect(suggestedIds([investor('below', { minAmountMusd: 10, maxAmountMusd: 119 })])).toEqual([])
  })

  it('тек төменгі немесе тек жоғарғы шегі бар аралық жұмыс істейді', () => {
    expect(suggestedIds([investor('min-only', { minAmountMusd: 100, maxAmountMusd: null })])).toEqual([
      'min-only',
    ])
    expect(suggestedIds([investor('max-only', { minAmountMusd: null, maxAmountMusd: 100 })])).toEqual([])
  })

  it('тәуекелге дайындығы жоба тәуекелінен төмен инвестор шықпайды', () => {
    expect(suggestedIds([investor('cautious', { riskAppetite: 'low' })])).toEqual([])
    expect(suggestedIds([investor('bold', { riskAppetite: 'high' })])).toEqual(['bold'])
  })

  it('жоғары тәуекелді жобаға тек жоғары тәуекелге дайын инвестор жарайды', () => {
    const risky: MatchProject = { ...project, riskLevel: 'high' }
    const investors = [
      investor('low', { riskAppetite: 'low' }),
      investor('medium', { riskAppetite: 'medium' }),
      investor('high', { riskAppetite: 'high' }),
    ]
    expect(suggestedIds(investors, risky)).toEqual(['high'])
  })
})

describe('matchInvestors: себептер, тәртіп және қауіпсіздік', () => {
  it('сәйкестік себептері әр критерий бойынша беріледі', () => {
    const [suggestion] = matchInvestors(project, [investor('inv-a')], now).suggestions
    expect(suggestion.reasons).toEqual([
      { criterion: 'sector', outcome: 'match' },
      { criterion: 'amount', outcome: 'match' },
      { criterion: 'region', outcome: 'match' },
      { criterion: 'model', outcome: 'match' },
      { criterion: 'risk', outcome: 'match' },
    ])
  })

  it('қалауы көрсетілмеген критерий шектеу емес, бірақ оң сәйкестікке есептелмейді', () => {
    const open = investor('open', {
      sectors: [],
      regions: null,
      models: ['ppp'],
      minAmountMusd: null,
      maxAmountMusd: null,
      riskAppetite: null,
    })
    const [suggestion] = matchInvestors(project, [open], now).suggestions
    expect(suggestion.matchedCriteria).toBe(1)
    expect(suggestion.reasons).toEqual([
      { criterion: 'sector', outcome: 'unspecified' },
      { criterion: 'amount', outcome: 'unspecified' },
      { criterion: 'region', outcome: 'unspecified' },
      { criterion: 'model', outcome: 'match' },
      { criterion: 'risk', outcome: 'unspecified' },
    ])
  })

  it('жобада дерек жоқ болса, критерий unspecified болады, инвестор шығарылмайды', () => {
    const [suggestion] = matchInvestors({ id: 'p-2' }, [investor('inv-a')], now).suggestions
    expect(suggestion.matchedCriteria).toBe(0)
    expect(suggestion.reasons.every((reason) => reason.outcome === 'unspecified')).toBe(true)
  })

  it('тізім тәртібі: сәйкестік көп алдымен, содан кейін A, сосын B, сосын id', () => {
    const investors = [
      investor('b-strong', { grade: 'B' }),
      investor('a-weak', { sectors: [], regions: [], models: [] }),
      investor('a-strong-2'),
      investor('a-strong-1'),
    ]
    expect(suggestedIds(investors)).toEqual(['a-strong-1', 'a-strong-2', 'b-strong', 'a-weak'])
  })

  it('инвесторлар жоқ болса, тізім бос, бірақ шешімді менеджер қабылдайды', () => {
    expect(matchInvestors(project, [], now)).toEqual({
      suggestions: [],
      requiresManagerDecision: true,
    })
  })

  it('ешкім сәйкес келмесе де requiresManagerDecision әрқашан true', () => {
    const result = matchInvestors(project, [investor('d', { grade: 'D' })], now)
    expect(result.suggestions).toEqual([])
    expect(result.requiresManagerDecision).toBe(true)
  })

  it('now жарамсыз болса, ешкім ұсынылмайды (қауіпсіз жағы)', () => {
    expect(matchInvestors(project, [investor('inv-a')], 'жарамсыз').suggestions).toEqual([])
  })

  it('кіріс инвесторлар өзгермейді', () => {
    const investors = [investor('a'), investor('b', { grade: 'B' })]
    const before = structuredClone(investors)
    matchInvestors(project, investors, now)
    expect(investors).toEqual(before)
  })
})
