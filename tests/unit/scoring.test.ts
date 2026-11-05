import { describe, expect, it } from 'vitest'

import { scoringSeed } from '@content/seed/data'
import {
  defaultScoringConfig,
  type GradeKey,
  type ScoringConfigData,
  type ScoringGrade,
  validateScoringConfig,
} from '@/lib/scoring/config'
import { computeScore, gradeFor, type ScoreEntry } from '@/lib/scoring/score'
import {
  type ComplianceVeto,
  isMatchableGrade,
  isVetoActive,
  matchableGrades,
  resolveInvestorStatus,
} from '@/lib/scoring/status'

// 100 балдық бағалау: баптау, есептеу, деңгей және комплаенс ветосы (ТТ 8.2).

const withWeights = (weights: number[]): ScoringConfigData => ({
  ...defaultScoringConfig,
  dimensions: defaultScoringConfig.dimensions.map((item, index) => ({
    ...item,
    weight: weights[index],
  })),
})

const withGrades = (grades: ScoringGrade[]): ScoringConfigData => ({
  ...defaultScoringConfig,
  grades,
})

const band = (key: GradeKey, min: number, max: number): ScoringGrade => ({ key, min, max })

describe('бағалау баптауы (ТТ 8.2)', () => {
  it('әдепкі баптауда 7 өлшем бар және салмақ қосындысы 100', () => {
    const weights = defaultScoringConfig.dimensions.map((item) => item.weight)
    expect(weights).toEqual([25, 15, 15, 15, 10, 10, 10])
    expect(weights.reduce((sum, weight) => sum + weight, 0)).toBe(100)
  })

  it('әдепкі баптау қателіксіз өтеді және кездейсоқ өзгертуден қорғалған', () => {
    expect(validateScoringConfig(defaultScoringConfig)).toEqual([])
    expect(Object.isFrozen(defaultScoringConfig)).toBe(true)
    expect(Object.isFrozen(defaultScoringConfig.dimensions)).toBe(true)
  })

  it('әдепкі баптау Payload seed (scoringSeed) мәндерімен сәйкес', () => {
    expect(defaultScoringConfig.dimensions).toEqual(
      scoringSeed.dimensions.map(({ key, weight }) => ({ key, weight })),
    )
    expect(defaultScoringConfig.grades).toEqual(
      scoringSeed.grades.map(({ key, min, max }) => ({ key, min, max })),
    )
  })

  it('салмақ қосындысы 100 емес конфигурация қабылданбайды (95)', () => {
    const errors = validateScoringConfig(withWeights([25, 15, 15, 15, 10, 10, 5]))
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('100')
    expect(errors[0]).toContain('95')
  })

  it('салмақ қосындысы 100-ден асса да қабылданбайды (110)', () => {
    const errors = validateScoringConfig(withWeights([25, 15, 15, 15, 10, 10, 20]))
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('110')
  })

  it('өлшем кілттері қайталанса қате береді', () => {
    const config: ScoringConfigData = {
      ...defaultScoringConfig,
      dimensions: defaultScoringConfig.dimensions.map((item) =>
        item.key === 'reputation' ? { ...item, key: 'sectorExperience' } : item,
      ),
    }
    expect(validateScoringConfig(config)).toContain('Өлшем кілті қайталанады: sectorExperience')
  })

  it('теріс немесе санға жатпайтын салмақ қате береді', () => {
    const negative = validateScoringConfig(withWeights([30, -5, 15, 15, 10, 10, 25]))
    expect(negative.some((message) => message.includes('0-ден кем емес'))).toBe(true)
    const notNumber = validateScoringConfig(withWeights([Number.NaN, 15, 15, 15, 10, 10, 10]))
    expect(notNumber.some((message) => message.includes('0-ден кем емес'))).toBe(true)
  })

  it('өлшемсіз баптау қабылданбайды', () => {
    const errors = validateScoringConfig({ ...defaultScoringConfig, dimensions: [] })
    expect(errors).toContain('Кемінде бір өлшем болуы тиіс')
  })

  it('деңгейлер арасында бос аралық болса қате береді (65 баллды ешбір деңгей алмайды)', () => {
    const errors = validateScoringConfig(
      withGrades([band('A', 80, 100), band('B', 66, 79), band('C', 50, 64), band('D', 0, 49)]),
    )
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('бос аралық')
  })

  it('деңгейлер қабаттасса қате береді', () => {
    const errors = validateScoringConfig(
      withGrades([band('A', 80, 100), band('B', 65, 80), band('C', 50, 64), band('D', 0, 49)]),
    )
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('қабаттасады')
  })

  it('деңгейлер 0 баллдан басталып, 100 баллмен аяқталуы тиіс', () => {
    const errors = validateScoringConfig(
      withGrades([band('A', 80, 99), band('B', 65, 79), band('C', 50, 64), band('D', 1, 49)]),
    )
    expect(errors).toContain('Ең төменгі деңгей 0 баллдан басталуы тиіс')
    expect(errors).toContain('Ең жоғарғы деңгей 100 баллмен аяқталуы тиіс')
  })

  it('деңгей шегі бүтін емес немесе төменгі шек жоғарғыдан үлкен болса қате береді', () => {
    const reversed = validateScoringConfig(
      withGrades([band('A', 80, 100), band('B', 79, 65), band('C', 50, 64), band('D', 0, 49)]),
    )
    expect(reversed.some((message) => message.includes('Деңгей B'))).toBe(true)
    const fractional = validateScoringConfig(
      withGrades([band('A', 80, 100), band('B', 65, 79.5), band('C', 50, 64), band('D', 0, 49)]),
    )
    expect(fractional.some((message) => message.includes('Деңгей B'))).toBe(true)
  })

  it('деңгей әріптері қайталанса немесе жетіспесе қате береді', () => {
    const errors = validateScoringConfig(
      withGrades([band('A', 80, 100), band('B', 65, 79), band('C', 50, 64), band('C', 0, 49)]),
    )
    expect(errors).toContain('Деңгейлер A, B, C, D болуы тиіс, әрқайсысы бір реттен')
  })

  it('A деңгейі ең жоғары балл аралығында болмаса қате береді', () => {
    const errors = validateScoringConfig(
      withGrades([band('A', 0, 49), band('B', 50, 64), band('C', 65, 79), band('D', 80, 100)]),
    )
    expect(errors).toContain('Деңгей әріптері баллға сәйкес болуы тиіс: A ең жоғары, D ең төмен')
  })
})

describe('gradeFor: жалпы баллдан деңгей', () => {
  it.each<[number, GradeKey]>([
    [100, 'A'],
    [80, 'A'],
    [79, 'B'],
    [65, 'B'],
    [64, 'C'],
    [50, 'C'],
    [49, 'D'],
    [0, 'D'],
  ])('%s балл = %s деңгейі', (total, expected) => {
    expect(gradeFor(defaultScoringConfig, total)).toBe(expected)
  })

  it('бөлшек балл төменгі деңгейге жатады (79.5 = B, 64.9 = C, 49.99 = D)', () => {
    expect(gradeFor(defaultScoringConfig, 79.5)).toBe('B')
    expect(gradeFor(defaultScoringConfig, 64.9)).toBe('C')
    expect(gradeFor(defaultScoringConfig, 49.99)).toBe('D')
  })

  it('шектен тыс немесе жарамсыз балл: 100-ден жоғары = A, 0-ден төмен және NaN = D', () => {
    expect(gradeFor(defaultScoringConfig, 150)).toBe('A')
    expect(gradeFor(defaultScoringConfig, -5)).toBe('D')
    expect(gradeFor(defaultScoringConfig, Number.NaN)).toBe('D')
  })

  it('деңгей шектері баптаудан алынады, кодқа қатаң жазылмаған', () => {
    const strict = withGrades([
      band('A', 90, 100),
      band('B', 70, 89),
      band('C', 50, 69),
      band('D', 0, 49),
    ])
    expect(gradeFor(defaultScoringConfig, 85)).toBe('A')
    expect(gradeFor(strict, 85)).toBe('B')
  })
})

const evidenceTexts: Record<string, string> = {
  financialPotential: '2025 жылғы аудиттелген есептілік, банк растамасы: 120 млн $',
  intentAndAuthority: 'Директорлар кеңесінің 2026-2028 жылдарға арналған инвестициялық жоспары',
  sectorExperience: 'Қытайда қуаты 50 МВт-тан асатын 3 күн электр стансасы іске қосылған',
  reputation: 'Соңғы 5 жылда сот дауы жоқ, 12 шарт мерзімінде орындалған',
  localContribution: '150 жұмыс орны, жергілікті сатып алу үлесі 40%',
  complianceRisk: 'Бенефициар расталды, санкциялық тізімдерде жоқ',
  planReadiness: 'ТЭН, жер телімі және жұмыс кестесі дайын',
}

const entry = (
  dimension: string,
  points: number,
  overrides: Partial<ScoreEntry> = {},
): ScoreEntry => ({
  dimension,
  points,
  evidenceText: evidenceTexts[dimension],
  evidenceFiles: 1,
  ...overrides,
})

/** Жалпы балл: 22 + 12 + 13 + 12 + 8 + 9 + 7 = 83 (A деңгейі) */
const fullEntries = (): ScoreEntry[] => [
  entry('financialPotential', 22),
  entry('intentAndAuthority', 12),
  entry('sectorExperience', 13),
  entry('reputation', 12),
  entry('localContribution', 8),
  entry('complianceRisk', 9),
  entry('planReadiness', 7),
]

const replaceEntry = (dimension: string, overrides: Partial<ScoreEntry>): ScoreEntry[] =>
  fullEntries().map((item) => (item.dimension === dimension ? { ...item, ...overrides } : item))

describe('computeScore: ұпайларды есептеу', () => {
  it('толық және дұрыс бағалау: жалпы балл, өлшем бойынша балл, деңгей, қате жоқ', () => {
    const result = computeScore(defaultScoringConfig, fullEntries())
    expect(result.total).toBe(83)
    expect(result.grade).toBe('A')
    expect(result.errors).toEqual([])
    expect(result.complete).toBe(true)
    expect(result.byDimension).toEqual({
      financialPotential: 22,
      intentAndAuthority: 12,
      sectorExperience: 13,
      reputation: 12,
      localContribution: 8,
      complianceRisk: 9,
      planReadiness: 7,
    })
  })

  it('ұпай салмақтан асса қате береді, ал жалпы балл салмаққа қысылып есептеледі', () => {
    const result = computeScore(defaultScoringConfig, replaceEntry('financialPotential', { points: 30 }))
    expect(result.errors).toEqual([{ code: 'points-out-of-range', dimension: 'financialPotential' }])
    expect(result.byDimension.financialPotential).toBe(25)
    expect(result.total).toBe(86)
    expect(result.complete).toBe(false)
  })

  it('теріс ұпай қате береді және 0 деп есептеледі', () => {
    const result = computeScore(defaultScoringConfig, replaceEntry('financialPotential', { points: -3 }))
    expect(result.errors).toEqual([{ code: 'points-out-of-range', dimension: 'financialPotential' }])
    expect(result.total).toBe(61)
    expect(result.grade).toBe('C')
  })

  it('ұпай жоқ (NaN) болса қате береді', () => {
    const result = computeScore(defaultScoringConfig, replaceEntry('reputation', { points: Number.NaN }))
    expect(result.errors).toEqual([{ code: 'points-out-of-range', dimension: 'reputation' }])
    expect(result.total).toBe(71)
  })

  it('дәлелдеме мәтіні бос немесе тек бос орындардан тұрса қате береді', () => {
    const empty = computeScore(defaultScoringConfig, replaceEntry('reputation', { evidenceText: '' }))
    const blank = computeScore(defaultScoringConfig, replaceEntry('reputation', { evidenceText: '   ' }))
    const absent = computeScore(defaultScoringConfig, replaceEntry('reputation', { evidenceText: null }))
    for (const result of [empty, blank, absent]) {
      expect(result.errors).toEqual([{ code: 'evidence-text-missing', dimension: 'reputation' }])
      expect(result.complete).toBe(false)
    }
  })

  it('дәлел файлы жоқ болса қате береді', () => {
    const result = computeScore(defaultScoringConfig, replaceEntry('localContribution', { evidenceFiles: 0 }))
    expect(result.errors).toEqual([{ code: 'evidence-files-missing', dimension: 'localContribution' }])
  })

  it('бір өлшемде мәтін де, файл да жоқ болса екі қате жиналады', () => {
    const result = computeScore(
      defaultScoringConfig,
      replaceEntry('complianceRisk', { evidenceText: '', evidenceFiles: 0 }),
    )
    expect(result.errors).toEqual([
      { code: 'evidence-text-missing', dimension: 'complianceRisk' },
      { code: 'evidence-files-missing', dimension: 'complianceRisk' },
    ])
  })

  it('нөл ұпайлы өлшемде де дәлелдеме міндетті', () => {
    const result = computeScore(
      defaultScoringConfig,
      replaceEntry('planReadiness', { points: 0, evidenceText: '', evidenceFiles: 0 }),
    )
    expect(result.errors).toHaveLength(2)
    expect(result.byDimension.planReadiness).toBe(0)
  })

  it('өлшем жетіспесе қате береді, жалпы балл әлі есептеледі, бірақ complete: false', () => {
    const entries = fullEntries().filter((item) => item.dimension !== 'planReadiness')
    const result = computeScore(defaultScoringConfig, entries)
    expect(result.errors).toEqual([{ code: 'dimension-missing', dimension: 'planReadiness' }])
    expect(result.total).toBe(76)
    expect(result.grade).toBe('B')
    expect(result.complete).toBe(false)
    expect(result.byDimension).not.toHaveProperty('planReadiness')
  })

  it('бос тізім: барлық өлшем жетіспейді, жалпы балл 0', () => {
    const result = computeScore(defaultScoringConfig, [])
    expect(result.total).toBe(0)
    expect(result.grade).toBe('D')
    expect(result.errors).toHaveLength(7)
    expect(result.errors.every((error) => error.code === 'dimension-missing')).toBe(true)
  })

  it('белгісіз өлшем қате береді және жалпы баллға қосылмайды', () => {
    const result = computeScore(defaultScoringConfig, [...fullEntries(), entry('luck', 20)])
    expect(result.errors).toEqual([{ code: 'dimension-unknown', dimension: 'luck' }])
    expect(result.total).toBe(83)
  })

  it('қайталанған өлшем қате береді, тек бірінші жазба есептеледі', () => {
    const result = computeScore(defaultScoringConfig, [...fullEntries(), entry('reputation', 15)])
    expect(result.errors).toEqual([{ code: 'dimension-duplicate', dimension: 'reputation' }])
    expect(result.byDimension.reputation).toBe(12)
    expect(result.total).toBe(83)
  })

  it('қате болса да жалпы балл мен деңгей есептеледі', () => {
    const result = computeScore(defaultScoringConfig, replaceEntry('financialPotential', { evidenceFiles: 0 }))
    expect(result.complete).toBe(false)
    expect(result.total).toBe(83)
    expect(result.grade).toBe('A')
  })

  it('бөлшек ұпайлар дәл қосылады (0.1 + 0.2 = 0.3)', () => {
    const entries = fullEntries().map((item) => ({ ...item, points: 0 }))
    entries[0].points = 0.1
    entries[1].points = 0.2
    expect(computeScore(defaultScoringConfig, entries).total).toBe(0.3)
  })

  it('есептеу баптауға тәуелді: басқа өлшемдермен де жұмыс істейді', () => {
    const config: ScoringConfigData = {
      dimensions: [
        { key: 'finance', weight: 60 },
        { key: 'plan', weight: 40 },
      ],
      grades: defaultScoringConfig.grades,
    }
    const result = computeScore(config, [
      { dimension: 'finance', points: 55, evidenceText: 'Банк растамасы', evidenceFiles: 2 },
      { dimension: 'plan', points: 30, evidenceText: 'ТЭН бар', evidenceFiles: 1 },
    ])
    expect(result.total).toBe(85)
    expect(result.grade).toBe('A')
    expect(result.complete).toBe(true)
  })
})

const resolve = (total: number, veto: ComplianceVeto | null = null) =>
  resolveInvestorStatus({ total, config: defaultScoringConfig, veto })

const sanctionsVeto: ComplianceVeto = {
  active: true,
  reason: 'Қаражат көзі расталмады, санкциялық тәуекел анықталды',
}

describe('resolveInvestorStatus: мәртебе мен комплаенс ветосы', () => {
  it.each<[number, GradeKey, string, boolean]>([
    [90, 'A', 'priority', true],
    [72, 'B', 'conditional', true],
    [55, 'C', 'watch', false],
    [30, 'D', 'deferred', false],
  ])('%s балл: %s деңгейі = %s, басым жобаларға жарайды: %s', (total, grade, status, eligible) => {
    expect(resolve(total)).toEqual({
      grade,
      status,
      eligibleForPriorityProjects: eligible,
      errors: [],
    })
  })

  it('D деңгейлі инвестор басым жобаларға жіберілмейді', () => {
    expect(resolve(49).eligibleForPriorityProjects).toBe(false)
    expect(resolve(49).status).toBe('deferred')
  })

  it('комплаенс ветосы 95 баллды басып өтеді: stopped, басым жобаларға жіберілмейді', () => {
    const result = resolve(95, sanctionsVeto)
    expect(result.status).toBe('stopped')
    expect(result.eligibleForPriorityProjects).toBe(false)
    expect(result.errors).toEqual([])
  })

  it('вето кезінде деңгей баллдан есептеледі (95 балл = A), бірақ мәртебе stopped', () => {
    expect(resolve(95, sanctionsVeto).grade).toBe('A')
  })

  it('вето 100 балл үшін де басым', () => {
    expect(resolve(100, sanctionsVeto)).toMatchObject({
      status: 'stopped',
      eligibleForPriorityProjects: false,
    })
  })

  it('вето белсенді емес болса, мәртебені балл шешеді', () => {
    const lifted: ComplianceVeto = { active: false, reason: 'Тексеру аяқталды, күмән жоқ' }
    expect(resolve(95, lifted).status).toBe('priority')
    expect(resolve(95, null).status).toBe('priority')
    expect(resolveInvestorStatus({ total: 95, config: defaultScoringConfig }).status).toBe('priority')
  })

  it('вето себебі бос болса қате қайтады, бірақ инвестор бәрібір тоқтатылады', () => {
    for (const veto of [{ active: true }, { active: true, reason: '' }, { active: true, reason: '   ' }]) {
      const result = resolve(95, veto)
      expect(result.errors).toEqual(['veto-reason-required'])
      expect(result.status).toBe('stopped')
      expect(result.eligibleForPriorityProjects).toBe(false)
    }
  })

  it('жарамсыз жалпы балл қате береді және инвестор жоғары деңгей алмайды', () => {
    for (const total of [150, -1, Number.NaN]) {
      const result = resolve(total)
      expect(result.errors).toEqual(['total-out-of-range'])
      expect(result.grade).toBe('D')
      expect(result.status).toBe('deferred')
    }
  })

  it('сәйкестендіруге тек A және B жарайды', () => {
    expect(matchableGrades).toEqual(['A', 'B'])
    expect(isMatchableGrade('A')).toBe(true)
    expect(isMatchableGrade('B')).toBe(true)
    expect(isMatchableGrade('C')).toBe(false)
    expect(isMatchableGrade('D')).toBe(false)
    expect(isMatchableGrade(null)).toBe(false)
  })

  it('isVetoActive: тек active шын болғанда белсенді', () => {
    expect(isVetoActive(null)).toBe(false)
    expect(isVetoActive(undefined)).toBe(false)
    expect(isVetoActive({ active: false })).toBe(false)
    expect(isVetoActive({ active: true, reason: 'Жалған құжат' })).toBe(true)
  })
})
