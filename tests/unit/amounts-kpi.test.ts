import { describe, expect, it } from 'vitest'

import * as amountsModule from '@/lib/investment/amounts'
import { amountFields, type FourAmounts, validateFourAmounts } from '@/lib/investment/amounts'
import * as kpiModule from '@/lib/kpi'
import { aggregateKpi, funnelCounts, type KpiProject } from '@/lib/kpi'

// Төрт бөлек сома (ТТ 8.7): мәлімделген, ниет құжаты бойынша, ресми шарт бойынша, нақты түскен.
// Олар ешқашан қосылмайды; нақты түскен сома тек дәлел файлымен.

describe('validateFourAmounts: төрт сома өрісін тексеру', () => {
  it('төрт сома: мәлімделген, ниет, шарт, нақты түскен', () => {
    expect(amountFields).toEqual(['declared', 'loi', 'contract', 'received'])
  })

  it('бос нысан дұрыс', () => {
    expect(validateFourAmounts({})).toEqual({ ok: true, errors: [] })
  })

  it('дәлел файлымен толтырылған төрт сома қабылданады', () => {
    const amounts: FourAmounts = {
      declared: 120,
      loi: 80,
      contract: 60,
      received: 15,
      receivedEvidenceFiles: 2,
      associationContribution: 'direct',
    }
    expect(validateFourAmounts(amounts)).toEqual({ ok: true, errors: [] })
  })

  it('дәлел файлынсыз нақты түскен сома қабылданбайды', () => {
    expect(validateFourAmounts({ received: 50 })).toEqual({
      ok: false,
      errors: [{ code: 'received-without-evidence', field: 'received' }],
    })
  })

  it('дәлел файлдарының саны 0 болса да нақты түскен сома қабылданбайды', () => {
    const result = validateFourAmounts({ received: 50, receivedEvidenceFiles: 0 })
    expect(result.errors).toEqual([{ code: 'received-without-evidence', field: 'received' }])
  })

  it('нақты түскен сома 0 болса, дәлелсіз де болады', () => {
    expect(validateFourAmounts({ received: 0 }).ok).toBe(true)
  })

  it('мәлімделген, ниет және шарт сомалары нақты түскен соманың дәлелі бола алмайды', () => {
    const result = validateFourAmounts({ declared: 500, loi: 300, contract: 200, received: 100 })
    expect(result.errors).toEqual([{ code: 'received-without-evidence', field: 'received' }])
  })

  it.each(amountFields)('теріс сома қабылданбайды: %s', (field) => {
    const result = validateFourAmounts({ [field]: -1, receivedEvidenceFiles: 1 })
    expect(result.errors).toEqual([{ code: 'amount-negative', field }])
  })

  it('санға жатпайтын мән (NaN, Infinity) қабылданбайды', () => {
    const result = validateFourAmounts({ declared: Number.NaN, loi: Number.POSITIVE_INFINITY })
    expect(result.errors).toEqual([
      { code: 'amount-not-a-number', field: 'declared' },
      { code: 'amount-not-a-number', field: 'loi' },
    ])
  })

  it('Қауымдастықтың үлесі: direct, indirect немесе бос ғана', () => {
    for (const associationContribution of ['direct', 'indirect', null, undefined] as const) {
      expect(validateFourAmounts({ associationContribution }).ok).toBe(true)
    }
    const result = validateFourAmounts({
      associationContribution: 'partner' as unknown as FourAmounts['associationContribution'],
    })
    expect(result.errors).toEqual([
      { code: 'invalid-association-contribution', field: 'associationContribution' },
    ])
  })

  it('бірнеше қате бірге жиналады', () => {
    const result = validateFourAmounts({ contract: -10, received: 5 })
    expect(result.ok).toBe(false)
    expect(result.errors).toHaveLength(2)
  })
})

const solar: KpiProject = {
  amounts: {
    declared: 120,
    loi: 80,
    contract: 60,
    received: 15,
    receivedEvidenceFiles: 2,
    associationContribution: 'direct',
  },
}
const port: KpiProject = {
  amounts: { declared: 300, loi: 150, contract: 0, received: null, associationContribution: 'indirect' },
}
/** Нақты түскен сома көрсетілген, бірақ банк құжаты жоқ */
const agro: KpiProject = {
  amounts: { declared: 45.5, loi: null, contract: null, received: 10, receivedEvidenceFiles: 0 },
}

describe('aggregateKpi: әр санат бөлек қосылады', () => {
  it('әр санат өз қосындысын алады, санаттар араласпайды', () => {
    const result = aggregateKpi([solar, port, agro])
    expect(result.declared).toBe(465.5)
    expect(result.loi).toBe(230)
    expect(result.contract).toBe(60)
    expect(result.received).toBe(15)
  })

  it('бір жобаның төрт сомасы бір санға қосылмайды', () => {
    const result = aggregateKpi([
      { amounts: { declared: 10, loi: 20, contract: 30, received: 40, receivedEvidenceFiles: 1 } },
    ])
    expect(result).toMatchObject({ declared: 10, loi: 20, contract: 30, received: 40 })
  })

  it('нақты түскен қосындыға тек дәлелі бар жазбалар кіреді', () => {
    const result = aggregateKpi([solar, agro])
    expect(result.received).toBe(15)
    expect(result.receivedCount).toBe(1)
    expect(result.unverifiedReceivedCount).toBe(1)
  })

  it('мәлімделген сома нақты түскен қосындыға әсер етпейді', () => {
    const modest = aggregateKpi([{ amounts: { declared: 10, received: 5, receivedEvidenceFiles: 1 } }])
    const inflated = aggregateKpi([
      { amounts: { declared: 5_000_000, received: 5, receivedEvidenceFiles: 1 } },
    ])
    expect(inflated.received).toBe(modest.received)
    expect(aggregateKpi([{ amounts: { declared: 1_000_000 } }]).received).toBe(0)
  })

  it('ниет және шарт сомалары да нақты түскенге әсер етпейді', () => {
    const result = aggregateKpi([{ amounts: { loi: 400, contract: 300 } }])
    expect(result).toMatchObject({ loi: 400, contract: 300, received: 0 })
  })

  it('нәтиже кілттері дәл төрт санат пен санауыштар; total, sum, overall кілті жоқ', () => {
    const keys = Object.keys(aggregateKpi([solar, port, agro])).sort()
    expect(keys).toEqual([
      'contract',
      'declared',
      'loi',
      'projectCount',
      'received',
      'receivedCount',
      'unverifiedReceivedCount',
    ])
    expect(keys.filter((key) => /total|sum|overall|combined/i.test(key))).toEqual([])
  })

  it('біріккен жалпы сан қайтарылмайды: ешбір мән төрт санаттың қосындысына тең емес', () => {
    const result = aggregateKpi([solar, port, agro])
    const combined = result.declared + result.loi + result.contract + result.received
    expect(combined).toBe(770.5)
    expect(Object.values(result)).not.toContain(combined)
  })

  it('жобалар жоқ болса, барлық мән 0', () => {
    expect(aggregateKpi([])).toEqual({
      declared: 0,
      loi: 0,
      contract: 0,
      received: 0,
      projectCount: 0,
      receivedCount: 0,
      unverifiedReceivedCount: 0,
    })
  })

  it('сомасыз жоба санауышқа кіреді, бірақ ештеңе қоспайды', () => {
    const result = aggregateKpi([{}, { amounts: null }])
    expect(result.projectCount).toBe(2)
    expect(result).toMatchObject({ declared: 0, loi: 0, contract: 0, received: 0 })
  })

  it('теріс және жарамсыз сомалар есепке алынбайды', () => {
    const result = aggregateKpi([
      {
        amounts: {
          declared: -50,
          loi: Number.NaN,
          contract: Number.POSITIVE_INFINITY,
          received: -5,
          receivedEvidenceFiles: 1,
        },
      },
    ])
    expect(result).toMatchObject({ declared: 0, loi: 0, contract: 0, received: 0 })
    expect(result.receivedCount).toBe(0)
  })

  it('ондық сомалар дәл қосылады (0.1 + 0.2 = 0.3)', () => {
    const result = aggregateKpi([{ amounts: { declared: 0.1 } }, { amounts: { declared: 0.2 } }])
    expect(result.declared).toBe(0.3)
  })

  it('кіріс деректерді өзгертпейді', () => {
    const projects = [solar, port, agro]
    const before = structuredClone(projects)
    aggregateKpi(projects)
    expect(projects).toEqual(before)
  })
})

describe('funnelCounts: воронканың бөлек санауыштары', () => {
  it('бес бөлек санауыш қайтарады', () => {
    const counts = funnelCounts({
      investors: 30,
      screened: 10,
      negotiating: 4,
      contracted: 2,
      received: 1,
    })
    expect(counts).toEqual({ investors: 30, screened: 10, negotiating: 4, contracted: 2, received: 1 })
    expect(Object.keys(counts)).toHaveLength(5)
  })

  it('сан орнына тізім берілсе, ұзындығы алынады', () => {
    const counts = funnelCounts({
      investors: ['inv-1', 'inv-2', 'inv-3'],
      screened: ['inv-1', 'inv-2'],
      negotiating: ['inv-1'],
      contracted: [],
      received: null,
    })
    expect(counts).toEqual({ investors: 3, screened: 2, negotiating: 1, contracted: 0, received: 0 })
  })

  it('теріс, жарамсыз немесе жоқ мән 0 болады, бөлшек төмен қарай дөңгелектенеді', () => {
    const counts = funnelCounts({
      investors: -4,
      screened: Number.NaN,
      negotiating: undefined,
      contracted: 3.7,
      received: Number.POSITIVE_INFINITY,
    })
    expect(counts).toEqual({ investors: 0, screened: 0, negotiating: 0, contracted: 3, received: 0 })
  })

  it('воронка кезеңдері қосылмайды: total, sum кілті де, қосынды мәні де жоқ', () => {
    const counts = funnelCounts({ investors: 30, screened: 10, negotiating: 4, contracted: 2, received: 1 })
    expect(Object.keys(counts).filter((key) => /total|sum|combined|overall/i.test(key))).toEqual([])
    expect(Object.values(counts)).not.toContain(47)
  })
})

describe('экспорттар: төрт санатты біріктіретін функция жоқ', () => {
  it('amounts және kpi экспорттарының атында total, sum, combined, overall жоқ', () => {
    const names = [...Object.keys(amountsModule), ...Object.keys(kpiModule)]
    expect(names).toEqual(
      expect.arrayContaining(['validateFourAmounts', 'hasReceivedEvidence', 'aggregateKpi', 'funnelCounts']),
    )
    expect(names.filter((name) => /total|sum|combined|overall/i.test(name))).toEqual([])
  })
})
