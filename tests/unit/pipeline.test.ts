import { describe, expect, it } from 'vitest'

import { canAdvanceStage, overdueSteps, type PipelineStep } from '@/lib/investment/pipeline'
import type { ProjectRecord } from '@/lib/investment/projectRules'
import { projectStages, type ProjectStageValue } from '@/lib/taxonomy'

// 8 кезеңдік цикл (ТТ 8.4): өту шарттары, кезеңді өткізіп жіберуге болмайды, мерзімі өткен қадамдар.

const base: ProjectRecord = {
  stage: '1',
  owner: { id: 'org-17', name: 'ТОО «Нұр-Энерго Инвест»' },
  purpose: '100 МВт күн электр стансасын салу',
  need: 'Желіге қосылу және жабдық үшін стратегиялық инвестор қажет',
  region: 'turkistan',
}

const at = (stage: ProjectStageValue, extra: ProjectRecord = {}): ProjectRecord => ({
  ...base,
  stage,
  ...extra,
})

/** Барлық өту шарты орындалған жоба */
const complete: ProjectRecord = {
  ...base,
  secretariatChecklistApproved: true,
  committeeDecision: 'approved',
  interestedInvestorCount: 2,
  intentProtocolSigned: true,
  contractSigned: true,
  productionStarted: true,
}

describe('canAdvanceStage: кезеңнен келесіге өту шарттары (ТТ 8.4)', () => {
  it('1 -> 2: міндетті өрістер толтырылса, өтеді', () => {
    expect(canAdvanceStage(at('1'), '2')).toEqual({ ok: true, missing: [] })
  })

  it('1 -> 2: қажеттілігі жазылмаса, өтпейді', () => {
    expect(canAdvanceStage(at('1', { need: '  ' }), '2')).toEqual({ ok: false, missing: ['need'] })
  })

  it('1 -> 2: барлық міндетті өріс бос болса, бәрі жетіспейтін талап ретінде көрсетіледі', () => {
    const empty = at('1', { owner: null, purpose: null, region: null, need: null })
    expect(canAdvanceStage(empty, '2').missing).toEqual(['owner', 'location', 'purpose', 'need'])
  })

  it('2 -> 3: хатшылық чек-листі бекітілмесе, өтпейді', () => {
    expect(canAdvanceStage(at('2'), '3')).toEqual({ ok: false, missing: ['secretariatChecklist'] })
    expect(canAdvanceStage(at('2', { secretariatChecklistApproved: true }), '3').ok).toBe(true)
  })

  it('3 -> 4: комитет шешімі оң болмаса, өтпейді', () => {
    expect(canAdvanceStage(at('3'), '4').missing).toEqual(['committeeApproval'])
    expect(canAdvanceStage(at('3', { committeeDecision: 'pending' }), '4').ok).toBe(false)
    expect(canAdvanceStage(at('3', { committeeDecision: 'rejected' }), '4').ok).toBe(false)
    expect(canAdvanceStage(at('3', { committeeDecision: 'approved' }), '4').ok).toBe(true)
  })

  it('4 -> 5: кем дегенде 1 инвестор қызығушылық білдірмесе, өтпейді', () => {
    expect(canAdvanceStage(at('4'), '5').missing).toEqual(['investorInterest'])
    expect(canAdvanceStage(at('4', { interestedInvestorCount: 0 }), '5').ok).toBe(false)
    expect(canAdvanceStage(at('4', { interestedInvestorCount: 1 }), '5').ok).toBe(true)
  })

  it('5 -> 6: ниет хаттамасы немесе терм-шит болса өтеді, екеуі де жоқ болса өтпейді', () => {
    expect(canAdvanceStage(at('5'), '6').missing).toEqual(['intentProtocolOrTermSheet'])
    expect(canAdvanceStage(at('5', { intentProtocolSigned: true }), '6').ok).toBe(true)
    expect(canAdvanceStage(at('5', { termSheetSigned: true }), '6').ok).toBe(true)
  })

  it('6 -> 7: ресми шартқа қол қойылмаса, өтпейді', () => {
    expect(canAdvanceStage(at('6'), '7').missing).toEqual(['contractSigned'])
    expect(canAdvanceStage(at('6', { contractSigned: true }), '7').ok).toBe(true)
  })

  it('7 -> 8: сынақтан өндіріс басталмаса, өтпейді', () => {
    expect(canAdvanceStage(at('7'), '8').missing).toEqual(['productionStarted'])
    expect(canAdvanceStage(at('7', { productionStarted: true }), '8').ok).toBe(true)
  })

  it('барлық шарт орындалса, 1-ден 8-ге дейін әр кезең келесіге өтеді', () => {
    const values = projectStages.map((item) => item.value)
    for (let i = 0; i < values.length - 1; i += 1) {
      const result = canAdvanceStage({ ...complete, stage: values[i] }, values[i + 1])
      expect(result, `${values[i]} -> ${values[i + 1]}`).toEqual({ ok: true, missing: [] })
    }
  })
})

describe('canAdvanceStage: кезеңді өткізіп жіберуге болмайды', () => {
  it('1 -> 3 өтпейді (барлық шарт орындалса да)', () => {
    expect(canAdvanceStage({ ...complete, stage: '1' }, '3')).toEqual({
      ok: false,
      missing: ['stage-skip'],
    })
  })

  it('2 -> 8 өтпейді', () => {
    expect(canAdvanceStage({ ...complete, stage: '2' }, '8').missing).toEqual(['stage-skip'])
  })

  it('әр кезеңнен екі қадам алға секіру жабық', () => {
    const values = projectStages.map((item) => item.value)
    for (let i = 0; i < values.length - 2; i += 1) {
      const result = canAdvanceStage({ ...complete, stage: values[i] }, values[i + 2])
      expect(result.ok, `${values[i]} -> ${values[i + 2]}`).toBe(false)
    }
  })

  it('allowRollback алға секіруге рұқсат бермейді', () => {
    const result = canAdvanceStage({ ...complete, stage: '2' }, '5', { allowRollback: true })
    expect(result).toEqual({ ok: false, missing: ['stage-skip'] })
  })

  it('кезеңі жоқ жоба тек 1-кезеңге кіре алады', () => {
    expect(canAdvanceStage({ stage: null }, '1')).toEqual({ ok: true, missing: [] })
    expect(canAdvanceStage({ stage: null }, '2').missing).toEqual(['stage-skip'])
  })
})

describe('canAdvanceStage: артқа қайту және қате кіріс', () => {
  it('артқа қайту allowRollback болмаса жабық', () => {
    expect(canAdvanceStage(at('5'), '3')).toEqual({ ok: false, missing: ['rollback-not-allowed'] })
    expect(canAdvanceStage(at('5'), '3', { allowRollback: false }).ok).toBe(false)
  })

  it('allowRollback: true болса, алдыңғы кезеңге қайтуға болады', () => {
    expect(canAdvanceStage(at('5'), '4', { allowRollback: true })).toEqual({ ok: true, missing: [] })
    expect(canAdvanceStage(at('8'), '1', { allowRollback: true }).ok).toBe(true)
  })

  it('сол кезеңге қайта өту жоқ', () => {
    expect(canAdvanceStage(at('3'), '3')).toEqual({ ok: false, missing: ['same-stage'] })
    expect(canAdvanceStage(at('3'), '3', { allowRollback: true }).ok).toBe(false)
  })

  it('сан түрінде берілген кезең де танылады', () => {
    expect(canAdvanceStage(at('1'), 2 as unknown as ProjectStageValue).ok).toBe(true)
    expect(canAdvanceStage(at('1'), 3 as unknown as ProjectStageValue).missing).toEqual([
      'stage-skip',
    ])
  })

  it('жарамсыз кезең қабылданбайды', () => {
    expect(canAdvanceStage(at('3'), '9' as ProjectStageValue)).toEqual({
      ok: false,
      missing: ['invalid-stage'],
    })
  })
})

describe('overdueSteps: мерзімі өткен қадамдар (ТТ 8.4)', () => {
  const now = new Date('2026-11-05T09:00:00Z')

  const step = (id: string, overrides: Partial<PipelineStep> = {}): PipelineStep => ({
    id,
    projectId: 'p-1',
    nextAction: 'Жер телімінің құжаттарын жинау',
    dueDate: '2026-11-01T00:00:00Z',
    responsibleId: 'm-1',
    ...overrides,
  })

  it('мерзімі өткен қадам табылады, ескертпе жауапты тұлғаға және Атқарушы директорға жіберіледі', () => {
    const result = overdueSteps([step('s-1')], now)
    expect(result.overdue).toHaveLength(1)
    expect(result.overdue[0].step.id).toBe('s-1')
    expect(result.overdue[0].daysOverdue).toBe(4)
    expect(result.overdue[0].recipients).toEqual([
      { type: 'user', id: 'm-1' },
      { type: 'role', role: 'chair' },
    ])
    expect(result.recipients).toEqual([
      { type: 'user', id: 'm-1' },
      { type: 'role', role: 'chair' },
    ])
  })

  it('мерзімі өтпеген қадам тізімге кірмейді', () => {
    expect(overdueSteps([step('s-1', { dueDate: '2026-11-20T00:00:00Z' })], now)).toEqual({
      overdue: [],
      recipients: [],
    })
  })

  it('орындалған қадам мерзімі өтсе де тізімге кірмейді', () => {
    const done = step('s-1', { completedAt: '2026-10-30T12:00:00Z' })
    expect(overdueSteps([done], now).overdue).toEqual([])
  })

  it('мерзімі белгіленбеген қадам кешікпейді', () => {
    const steps = [step('s-1', { dueDate: null }), step('s-2', { dueDate: undefined })]
    expect(overdueSteps(steps, now).overdue).toEqual([])
  })

  it('мерзім дәл қазір болса, қадам әлі кешікпеген', () => {
    expect(overdueSteps([step('s-1', { dueDate: now })], now).overdue).toEqual([])
  })

  it('бірнеше сағат кешіксе де қадам тізімде, daysOverdue = 0', () => {
    const result = overdueSteps([step('s-1', { dueDate: '2026-11-05T06:00:00Z' })], now)
    expect(result.overdue).toHaveLength(1)
    expect(result.overdue[0].daysOverdue).toBe(0)
  })

  it('жауапты тұлға жоқ болса, ескертпе тек Атқарушы директорға жіберіледі', () => {
    const result = overdueSteps([step('s-1', { responsibleId: null })], now)
    expect(result.overdue[0].recipients).toEqual([{ type: 'role', role: 'chair' }])
    expect(result.recipients).toEqual([{ type: 'role', role: 'chair' }])
  })

  it('жалпы алушылар тізімінде қайталану жоқ', () => {
    const result = overdueSteps(
      [
        step('s-1', { responsibleId: 'm-1' }),
        step('s-2', { responsibleId: 'm-1' }),
        step('s-3', { responsibleId: 'm-2' }),
      ],
      now,
    )
    expect(result.overdue).toHaveLength(3)
    expect(result.recipients).toHaveLength(3)
    expect(result.recipients).toContainEqual({ type: 'user', id: 'm-1' })
    expect(result.recipients).toContainEqual({ type: 'user', id: 'm-2' })
    expect(result.recipients).toContainEqual({ type: 'role', role: 'chair' })
  })

  it('ең көп кешіккен қадам алдымен тұрады', () => {
    const result = overdueSteps(
      [
        step('s-1', { dueDate: '2026-11-03T00:00:00Z' }),
        step('s-2', { dueDate: '2026-10-20T00:00:00Z' }),
        step('s-3', { dueDate: '2026-11-01T00:00:00Z' }),
      ],
      now,
    )
    expect(result.overdue.map((item) => item.step.id)).toEqual(['s-2', 's-3', 's-1'])
  })

  it('қадамдар бастапқы объект ретінде қайтады (көшірме жасалмайды)', () => {
    const original = step('s-1')
    expect(overdueSteps([original], now).overdue[0].step).toBe(original)
  })

  it('қадам жоқ немесе now жарамсыз болса, бос нәтиже', () => {
    expect(overdueSteps([], now)).toEqual({ overdue: [], recipients: [] })
    expect(overdueSteps([step('s-1')], 'жарамсыз күн')).toEqual({ overdue: [], recipients: [] })
  })
})
