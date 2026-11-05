// 8 кезеңдік цикл (pipeline) және мерзімі өткен қадамдар (ТТ 8.4).
//
// | Қайдан -> қайда | Өту шарты (ТТ 8.4)                           | Код                          |
// | 1 -> 2          | Міндетті өрістер толтырылды                   | owner, purpose, location, need |
// | 2 -> 3          | Хатшылық чек-листі бекітілді                  | secretariatChecklist         |
// | 3 -> 4          | Комитет шешімі                                | committeeApproval            |
// | 4 -> 5          | Кем дегенде 1 инвестор қызығушылық білдірді   | investorInterest             |
// | 5 -> 6          | Ниет хаттамасы немесе терм-шит                | intentProtocolOrTermSheet    |
// | 6 -> 7          | Ресми шартқа қол қойылды                      | contractSigned               |
// | 7 -> 8          | Сынақтан өндіріс басталды                     | productionStarted            |
//
// Болжам: «міндетті өрістер» (1 -> 2) = иесі, мақсаты, орны (region), қажеттілігі; ТТ 8.4 кестесінің
//   1-кезеңдегі «не тіркеледі» бағанынан алынды.
// Болжам: 3 -> 4 өту үшін комитет шешімі оң болуы тиіс ('approved'); қабылданбаған жоба
//   сәйкестендіруге өтпейді.
// Болжам: 8-кезең соңғы. «Жылдық есепке енеді» келесі кезеңге өту шарты емес, аяқтау белгісі.
// Болжам: кезеңі жоқ жоба тек 1-кезеңге кіре алады (шартсыз). Деңгей (ТТ 8.3) мен кезең бір-біріне
//   тәуелсіз тексеріледі.
// Болжам: артқа қайту кез келген алдыңғы кезеңге `allowRollback: true` болғанда ғана рұқсат;
//   бұл кезеңді өткізіп жіберуге рұқсат бермейді.
// Болжам: Атқарушы директорға ескертпе `chair` рөлі арқылы жіберіледі (ТТ 10.1: «Төраға /
//   Атқарушы директор» бір рөл); нақты пайдаланушыларды хабарлама қабаты рөлден табады.
// Болжам: қадам мерзімі қатаң: `now` мерзімнен кейін болса ғана кешікті (дәл мерзім сәті емес).

import { type DateInput, DAY_MS, toTimestamp } from '@/lib/scoring/dates'
import type { ProjectStageValue } from '@/lib/taxonomy'

import { missingConceptFields, type ProjectRecord, type RuleCheck } from './projectRules'

const stageOrder: readonly ProjectStageValue[] = ['1', '2', '3', '4', '5', '6', '7', '8']
/** 1-8; белгісіз немесе жоқ кезең үшін 0. Сан түрінде келген мән да танылады. */
const stageRank = (stage: string | number | null | undefined): number =>
  stageOrder.indexOf(String(stage) as ProjectStageValue) + 1

const failed = (checks: ReadonlyArray<readonly [code: string, passed: unknown]>): string[] =>
  checks.filter(([, passed]) => !passed).map(([code]) => code)

/** Кезеңнен келесіге өту шарты: өту алдында орындалмаған талаптардың кодтары */
const stageGates: Record<number, (project: ProjectRecord) => string[]> = {
  1: (project) => [
    ...missingConceptFields(project),
    ...failed([['need', typeof project.need === 'string' && project.need.trim() !== '']]),
  ],
  2: (project) => failed([['secretariatChecklist', project.secretariatChecklistApproved]]),
  3: (project) => failed([['committeeApproval', project.committeeDecision === 'approved']]),
  4: (project) => failed([['investorInterest', (project.interestedInvestorCount ?? 0) >= 1]]),
  5: (project) =>
    failed([['intentProtocolOrTermSheet', project.intentProtocolSigned || project.termSheetSigned]]),
  6: (project) => failed([['contractSigned', project.contractSigned]]),
  7: (project) => failed([['productionStarted', project.productionStarted]]),
}

/**
 * Жобаны `toStage` кезеңіне өткізуге бола ма. Кезеңді өткізіп жіберуге болмайды; артқа қайту
 * тек `allowRollback: true` арқылы. `missing` кодтары: 'invalid-stage', 'same-stage',
 * 'stage-skip', 'rollback-not-allowed' және кестедегі өту шарттарының кодтары.
 */
export function canAdvanceStage(
  project: ProjectRecord,
  toStage: ProjectStageValue,
  options: { allowRollback?: boolean } = {},
): RuleCheck {
  const target = stageRank(toStage)
  if (target === 0) return { ok: false, missing: ['invalid-stage'] }

  const current = stageRank(project.stage)
  if (target === current) return { ok: false, missing: ['same-stage'] }
  if (target < current) {
    return options.allowRollback === true
      ? { ok: true, missing: [] }
      : { ok: false, missing: ['rollback-not-allowed'] }
  }
  if (target > current + 1) return { ok: false, missing: ['stage-skip'] }

  const missing = current === 0 ? [] : stageGates[current](project)
  return { ok: missing.length === 0, missing }
}

export type PipelineStep = {
  id: string
  projectId?: string | null
  /** Келесі әрекет (ТТ 8.4: электрондық мұрағат) */
  nextAction?: string | null
  dueDate?: DateInput | null
  completedAt?: DateInput | null
  /** Жауапты тұлға (admins id) */
  responsibleId?: string | null
}

/** Ескертпе алушы: нақты пайдаланушы немесе рөл (рөлді хабарлама қабаты шешеді) */
export type NotificationRecipient =
  | { type: 'user'; id: string }
  | { type: 'role'; role: 'chair' }

export type OverdueStep = {
  step: PipelineStep
  /** Толық кешіккен күн саны (бірнеше сағат кешіксе 0) */
  daysOverdue: number
  /** Жауапты тұлға (бар болса) + Атқарушы директор */
  recipients: NotificationRecipient[]
}

export type OverdueResult = {
  /** Ең көп кешіккен қадам алдымен */
  overdue: OverdueStep[]
  /** Барлық кешіккен қадам бойынша қайталанбайтын алушылар тізімі */
  recipients: NotificationRecipient[]
}

const recipientKey = (recipient: NotificationRecipient): string =>
  recipient.type === 'user' ? `user:${recipient.id}` : `role:${recipient.role}`

const compareText = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

/**
 * Мерзімі өткен қадамдар (ТТ 8.4): орындалмаған және мерзімі `now`-дан өткен қадамдар.
 * Ескертпе жауапты тұлғаға және Атқарушы директорға жіберіледі.
 */
export function overdueSteps(steps: readonly PipelineStep[], now: DateInput): OverdueResult {
  const current = toTimestamp(now)
  if (Number.isNaN(current)) return { overdue: [], recipients: [] }

  const overdue: Array<OverdueStep & { dueMs: number }> = []
  for (const step of steps) {
    const dueMs = toTimestamp(step.dueDate)
    if (Number.isNaN(dueMs) || dueMs >= current) continue
    if (!Number.isNaN(toTimestamp(step.completedAt))) continue

    const recipients: NotificationRecipient[] = []
    if (step.responsibleId && step.responsibleId.trim() !== '') {
      recipients.push({ type: 'user', id: step.responsibleId })
    }
    recipients.push({ type: 'role', role: 'chair' })

    overdue.push({
      step,
      dueMs,
      daysOverdue: Math.floor((current - dueMs) / DAY_MS),
      recipients,
    })
  }

  overdue.sort((a, b) => a.dueMs - b.dueMs || compareText(a.step.id, b.step.id))

  const unique = new Map<string, NotificationRecipient>()
  for (const item of overdue) {
    for (const recipient of item.recipients) unique.set(recipientKey(recipient), recipient)
  }

  return {
    overdue: overdue.map(({ step, daysOverdue, recipients }) => ({ step, daysOverdue, recipients })),
    recipients: [...unique.values()],
  }
}
