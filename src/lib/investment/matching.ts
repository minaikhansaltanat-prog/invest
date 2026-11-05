// Сәйкестендіру (matchmaking): жобаға сай инвесторлар тізімі (ТТ 8.5).
// Сүзгі ережелері: сала, көлем аралығы, өңір, модель, тәуекелге дайындығы, деңгей (тек A және B),
// вето белсенді емес, бағасы мерзімі өтпеген.
// Соңғы шешімді менеджер қабылдайды: нәтиже тек ұсыныс, автоматты түрде ештеңе жіберілмейді
// (`requiresManagerDecision: true`).
//
// Болжам: инвесторда қалау көрсетілмесе (бос тізім, көлем шегі жоқ) немесе жобада сол дерек
//   жоқ болса, ол критерий шектеу емес ('unspecified'), бірақ оң сәйкестікке де есептелмейді.
//   Көрсетілген қалау жобаға сәйкес келмесе, инвестор шығарылады.
// Болжам: тәуекелге дайындық үш деңгейлі шкала (low < medium < high); инвестордың дайындығы
//   жоба тәуекелінен кем болмауы тиіс (жоғары тәуекелді жобаға тек 'high' жарайды).
// Болжам: «бағасы мерзімі өтпеген» = `isReassessmentDue(lastAssessedAt, now)` жалған; бағаланбаған
//   инвестор шықпайды.
// Болжам: C, D деңгейлі, вето белсенді немесе бағасының мерзімі өткен инвестор нәтижеде мүлде
//   көрінбейді (шығарылғандар тізімі қайтарылмайды).
// Болжам: тізім тәртібі: оң сәйкестік саны көп алдымен, содан кейін A, сосын B, сосын id бойынша.

import type { GradeKey } from '@/lib/scoring/config'
import type { DateInput } from '@/lib/scoring/dates'
import { isReassessmentDue } from '@/lib/scoring/evaluators'
import {
  type ComplianceVeto,
  isMatchableGrade,
  isVetoActive,
  type MatchableGrade,
} from '@/lib/scoring/status'
import type { ProjectModelValue, RegionValue, SectorValue } from '@/lib/taxonomy'

export type RiskLevel = 'low' | 'medium' | 'high'

export type MatchProject = {
  id: string
  sector?: SectorValue | null
  region?: RegionValue | null
  model?: ProjectModelValue | null
  /** Болжамды көлем, млн $ */
  amountMusd?: number | null
  /** Тәуекелдер тізілімінен алынған жалпы деңгей */
  riskLevel?: RiskLevel | null
}

export type MatchInvestor = {
  id: string
  /** Қазіргі деңгей (A-D); бағаланбаған болса null */
  grade?: GradeKey | null
  veto?: ComplianceVeto | null
  lastAssessedAt?: DateInput | null
  // Қызығушылық (ТТ 8.1)
  sectors?: readonly SectorValue[] | null
  regions?: readonly RegionValue[] | null
  models?: readonly ProjectModelValue[] | null
  minAmountMusd?: number | null
  maxAmountMusd?: number | null
  riskAppetite?: RiskLevel | null
}

export type MatchCriterion = 'sector' | 'amount' | 'region' | 'model' | 'risk'

/** 'match': қалау жобаға сәйкес; 'unspecified': шектеу жоқ немесе дерек жетіспейді */
export type MatchReason = { criterion: MatchCriterion; outcome: 'match' | 'unspecified' }

export type MatchSuggestion = {
  investorId: string
  grade: MatchableGrade
  /** Оң сәйкес келген критерий саны (0-5) */
  matchedCriteria: number
  reasons: MatchReason[]
}

export type MatchResult = {
  suggestions: MatchSuggestion[]
  /** Әрқашан true: тізім тек ұсыныс, жіберуді менеджер шешеді */
  requiresManagerDecision: true
}

const riskRank: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3 }

const finiteOrNull = (value: number | null | undefined): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

/** null қайтса, критерий сәйкес келмейді (инвестор шығарылады) */
type Verdict = MatchReason | null

function matchOneOf<T extends string>(
  criterion: MatchCriterion,
  wanted: readonly T[] | null | undefined,
  actual: T | null | undefined,
): Verdict {
  if (!wanted || wanted.length === 0 || !actual) return { criterion, outcome: 'unspecified' }
  return wanted.includes(actual) ? { criterion, outcome: 'match' } : null
}

function matchAmount(investor: MatchInvestor, project: MatchProject): Verdict {
  const min = finiteOrNull(investor.minAmountMusd)
  const max = finiteOrNull(investor.maxAmountMusd)
  const amount = finiteOrNull(project.amountMusd)
  if (amount === null || (min === null && max === null)) {
    return { criterion: 'amount', outcome: 'unspecified' }
  }
  if ((min !== null && amount < min) || (max !== null && amount > max)) return null
  return { criterion: 'amount', outcome: 'match' }
}

function matchRisk(appetite: RiskLevel | null | undefined, risk: RiskLevel | null | undefined): Verdict {
  if (!appetite || !risk) return { criterion: 'risk', outcome: 'unspecified' }
  return riskRank[appetite] >= riskRank[risk] ? { criterion: 'risk', outcome: 'match' } : null
}

const compareText = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

/**
 * Жобаға сай инвесторларды ұсынады (ТТ 8.5). Кіріс массивтері өзгермейді.
 * Тек A және B, вето жоқ, бағасы `now` бойынша мерзімі өтпеген инвесторлар қарастырылады.
 */
export function matchInvestors(
  project: MatchProject,
  investors: readonly MatchInvestor[],
  now: DateInput,
): MatchResult {
  const suggestions: MatchSuggestion[] = []

  for (const investor of investors) {
    const grade = investor.grade
    if (!isMatchableGrade(grade)) continue
    if (isVetoActive(investor.veto)) continue
    if (isReassessmentDue(investor.lastAssessedAt, now, false)) continue

    const verdicts = [
      matchOneOf('sector', investor.sectors, project.sector),
      matchAmount(investor, project),
      matchOneOf('region', investor.regions, project.region),
      matchOneOf('model', investor.models, project.model),
      matchRisk(investor.riskAppetite, project.riskLevel),
    ]
    const reasons = verdicts.filter((verdict): verdict is MatchReason => verdict !== null)
    if (reasons.length !== verdicts.length) continue

    suggestions.push({
      investorId: investor.id,
      grade,
      matchedCriteria: reasons.filter((reason) => reason.outcome === 'match').length,
      reasons,
    })
  }

  suggestions.sort(
    (a, b) =>
      b.matchedCriteria - a.matchedCriteria ||
      compareText(a.grade, b.grade) ||
      compareText(a.investorId, b.investorId),
  )

  return { suggestions, requiresManagerDecision: true }
}
