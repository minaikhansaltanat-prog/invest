import { describe, expect, it } from 'vitest'

import {
  type AssessmentRecord,
  canEvaluate,
  canFinalizeAssessment,
  type CoiDeclaration,
  hasConflictOfInterest,
  isReassessmentDue,
  REASSESSMENT_MONTHS,
} from '@/lib/scoring/evaluators'

// Бағалаушылар: екі тұлғаның бағасы (ТТ 8.2), мүдделер қақтығысы (ТТ 14.3), қайта бағалау (ТТ 8.2).

const expert = (evaluatorId: string): AssessmentRecord => ({ evaluatorId, role: 'expert' })
const member = (evaluatorId: string): AssessmentRecord => ({
  evaluatorId,
  role: 'committee-member',
})

describe('canFinalizeAssessment: баға екі тұлғамен қойылады', () => {
  it('сарапшы мен комитет мүшесі әртүрлі адам болса, баға бекітіледі', () => {
    expect(canFinalizeAssessment([expert('e-1'), member('c-1')])).toEqual({ ok: true, missing: [] })
  })

  it('тек сарапшы бағаласа, комитет мүшесі жетіспейді', () => {
    expect(canFinalizeAssessment([expert('e-1')])).toEqual({
      ok: false,
      missing: ['committee-member'],
    })
  })

  it('тек комитет мүшесі бағаласа, сарапшы жетіспейді', () => {
    expect(canFinalizeAssessment([member('c-1')])).toEqual({ ok: false, missing: ['expert'] })
  })

  it('баға жоқ болса, екі рөл де жетіспейді', () => {
    expect(canFinalizeAssessment([])).toEqual({ ok: false, missing: ['expert', 'committee-member'] })
  })

  it('сарапшы мен комитет мүшесі бір адам болса, баға бекітілмейді', () => {
    expect(canFinalizeAssessment([expert('u-5'), member('u-5')])).toEqual({
      ok: false,
      missing: ['distinct-evaluators'],
    })
  })

  it('бір адам екі рөлде жазылса да, басқа комитет мүшесі бар болса, баға бекітіледі', () => {
    const result = canFinalizeAssessment([expert('u-5'), member('u-5'), member('c-2')])
    expect(result.ok).toBe(true)
  })

  it('бір сарапшының екі жазбасы екі тұлға болып есептелмейді', () => {
    expect(canFinalizeAssessment([expert('e-1'), expert('e-1')])).toEqual({
      ok: false,
      missing: ['committee-member'],
    })
  })

  it('evaluatorId бос жазба есепке алынбайды', () => {
    expect(canFinalizeAssessment([expert(''), member('c-1')])).toEqual({
      ok: false,
      missing: ['expert'],
    })
  })
})

const declarations: CoiDeclaration[] = [
  { evaluatorId: 'e-1', investorId: 'inv-7' },
  { evaluatorId: 'e-1', projectId: 'p-3' },
  { evaluatorId: 'e-2', organizationId: 'org-9' },
]

describe('hasConflictOfInterest: мүдделер қақтығысы (ТТ 14.3)', () => {
  it('инвестор бойынша декларациясы бар сарапшыда қақтығыс бар', () => {
    expect(hasConflictOfInterest('e-1', { investorId: 'inv-7' }, declarations)).toBe(true)
  })

  it('жоба бойынша декларациясы бар сарапшыда қақтығыс бар', () => {
    expect(hasConflictOfInterest('e-1', { projectId: 'p-3' }, declarations)).toBe(true)
  })

  it('ұйым бойынша декларация сол ұйымның инвесторы мен жобасын қамтиды', () => {
    const subject = { investorId: 'inv-20', projectId: 'p-30', organizationId: 'org-9' }
    expect(hasConflictOfInterest('e-2', subject, declarations)).toBe(true)
  })

  it('басқа сарапшының декларациясы әсер етпейді', () => {
    expect(hasConflictOfInterest('e-3', { investorId: 'inv-7' }, declarations)).toBe(false)
  })

  it('декларация басқа объектіге қатысты болса, қақтығыс жоқ', () => {
    expect(hasConflictOfInterest('e-1', { investorId: 'inv-8', projectId: 'p-4' }, declarations)).toBe(
      false,
    )
  })

  it('декларациялар жоқ болса, қақтығыс жоқ', () => {
    expect(hasConflictOfInterest('e-1', { investorId: 'inv-7' }, [])).toBe(false)
  })

  it('бос id-лер бір-біріне сәйкес келмейді (undefined === undefined қатесі жоқ)', () => {
    expect(hasConflictOfInterest('e-5', {}, [{ evaluatorId: 'e-5' }])).toBe(false)
    expect(
      hasConflictOfInterest('e-5', { investorId: null }, [{ evaluatorId: 'e-5', investorId: null }]),
    ).toBe(false)
  })
})

describe('canEvaluate: қақтығысы бар сарапшы көреді, бірақ бағаламайды және дауыс бермейді', () => {
  it('мүдделер қақтығысы бар сарапшы объектіні көре алады, бірақ баға қоя алмайды және дауыс бере алмайды', () => {
    expect(canEvaluate('e-1', { investorId: 'inv-7' }, declarations)).toEqual({
      view: true,
      score: false,
      vote: false,
    })
  })

  it('қақтығысы жоқ сарапшы көреді, бағалайды және дауыс береді', () => {
    expect(canEvaluate('e-3', { investorId: 'inv-7' }, declarations)).toEqual({
      view: true,
      score: true,
      vote: true,
    })
  })

  it('қақтығыс тек сол объектіге қатысты: басқа инвесторды бағалай алады', () => {
    expect(canEvaluate('e-1', { investorId: 'inv-99' }, declarations)).toEqual({
      view: true,
      score: true,
      vote: true,
    })
  })
})

describe('isReassessmentDue: 12 айда бір немесе жаңа дерек келгенде', () => {
  const assessed = '2026-03-15T00:00:00Z'

  it('қайта бағалау кезеңі 12 ай', () => {
    expect(REASSESSMENT_MONTHS).toBe(12)
  })

  it('12 ай толмаса, қайта қараудың қажеті жоқ', () => {
    expect(isReassessmentDue(assessed, '2026-11-05T09:00:00Z')).toBe(false)
    expect(isReassessmentDue(assessed, '2027-03-14T23:59:59Z')).toBe(false)
  })

  it('дәл 12 ай толған сәттен бастап қайта қарау қажет', () => {
    expect(isReassessmentDue(assessed, '2027-03-15T00:00:00Z')).toBe(true)
    expect(isReassessmentDue(assessed, '2027-08-01T00:00:00Z')).toBe(true)
  })

  it('жаңа дерек келсе, 12 ай толмай-ақ қайта қарау қажет', () => {
    expect(isReassessmentDue(assessed, '2026-04-01T00:00:00Z', true)).toBe(true)
    expect(isReassessmentDue(assessed, '2026-04-01T00:00:00Z', false)).toBe(false)
  })

  it('бұрын бағаланбаған инвесторды бағалау қажет', () => {
    expect(isReassessmentDue(null, '2026-11-05T09:00:00Z')).toBe(true)
    expect(isReassessmentDue(undefined, '2026-11-05T09:00:00Z')).toBe(true)
  })

  it('Date, ISO жол және миллисекунд бірдей жұмыс істейді', () => {
    const now = new Date('2026-11-05T09:00:00Z')
    expect(isReassessmentDue(new Date(assessed), now)).toBe(false)
    expect(isReassessmentDue(Date.parse(assessed), now.getTime())).toBe(false)
  })

  it('29 ақпан 2024 + 12 ай = 28 ақпан 2025 (айдың соңғы күні сақталады)', () => {
    const leapDay = '2024-02-29T00:00:00Z'
    expect(isReassessmentDue(leapDay, '2025-02-27T23:59:59Z')).toBe(false)
    expect(isReassessmentDue(leapDay, '2025-02-28T00:00:00Z')).toBe(true)
  })

  it('күн жарамсыз болса, қауіпсіз жағына: қайта қарау қажет', () => {
    expect(isReassessmentDue('күні белгісіз', '2026-11-05T09:00:00Z')).toBe(true)
    expect(isReassessmentDue(assessed, 'жарамсыз')).toBe(true)
  })
})
