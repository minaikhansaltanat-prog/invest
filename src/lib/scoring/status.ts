// Инвестор мәртебесі: жалпы балл + комплаенс ветосы (ТТ 8.2, 8.5).
//
// КЕЛІСІМ: комплаенс ветосы жалпы баллға қарамастан басым. 95 балл + белсенді вето = 'stopped'.
//
// Болжам: `grade` вето кезінде де баллдан есептеледі (ақпарат үшін), ал `status` 'stopped' болады.
//   Сәйкестендіру мен деректер бөлмесі `grade` пен `veto`-ны бірге тексереді.
// Болжам: вето себебі бос болса да инвестор 'stopped' болады (қауіпсіз жағы) және
//   `veto-reason-required` қатесі қайтады: ТТ 8.2 бойынша себебі міндетті, сондықтан сақтау
//   hook-ы мұндай ветоны қабылдамауы тиіс.
// Болжам: `eligibleForPriorityProjects` = A немесе B және вето жоқ. ТТ 8.5: сәйкестендіруге
//   тек A және B жарайды; B-ға қосымша құжат керек (мәртебесі 'conditional').
// Болжам: жарамсыз жалпы балл (0-100 емес, NaN) ең төменгі деңгейге ('deferred') түсіп,
//   `total-out-of-range` қатесін береді. Әдістемені Басқарма бекітпесе, «жоба» белгісін
//   көрсету интерфейстің міндеті (globals `methodologyApproved`), бұл модульде емес.

import type { GradeKey, ScoringConfigData } from './config'
import { gradeFor } from './score'

export type InvestorStatus = 'stopped' | 'priority' | 'conditional' | 'watch' | 'deferred'

/** Сәйкестендіруге және деректер бөлмесіне жарайтын деңгейлер (ТТ 8.5, 14.1) */
export type MatchableGrade = 'A' | 'B'

export type ComplianceVeto = { active: boolean; reason?: string | null }

export type StatusErrorCode = 'veto-reason-required' | 'total-out-of-range'

export type InvestorStatusResult = {
  grade: GradeKey
  status: InvestorStatus
  eligibleForPriorityProjects: boolean
  errors: StatusErrorCode[]
}

export const matchableGrades: readonly MatchableGrade[] = ['A', 'B']

export function isMatchableGrade(grade: GradeKey | null | undefined): grade is MatchableGrade {
  return grade === 'A' || grade === 'B'
}

/** Вето белсенді ме. Жарамсыз мән белсенді емес деп саналмайды: `active` шын болса ғана. */
export function isVetoActive(veto: ComplianceVeto | null | undefined): boolean {
  return Boolean(veto?.active)
}

const statusByGrade: Record<GradeKey, InvestorStatus> = {
  A: 'priority',
  B: 'conditional',
  C: 'watch',
  D: 'deferred',
}

export function resolveInvestorStatus(input: {
  total: number
  config: ScoringConfigData
  veto?: ComplianceVeto | null
}): InvestorStatusResult {
  const { total, config, veto } = input
  const errors: StatusErrorCode[] = []

  const totalValid = Number.isFinite(total) && total >= 0 && total <= 100
  if (!totalValid) errors.push('total-out-of-range')
  const grade = gradeFor(config, totalValid ? total : 0)

  if (isVetoActive(veto)) {
    if (!veto?.reason || veto.reason.trim() === '') errors.push('veto-reason-required')
    return { grade, status: 'stopped', eligibleForPriorityProjects: false, errors }
  }

  return {
    grade,
    status: statusByGrade[grade],
    eligibleForPriorityProjects: isMatchableGrade(grade),
    errors,
  }
}
