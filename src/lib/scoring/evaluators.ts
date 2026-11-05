// Бағалаушылар: екі тұлғаның бағасы, мүдделер қақтығысы, қайта бағалау мерзімі (ТТ 8.2, 14.3).
// Рөл мен тағайындауды (кім қай инвесторды көреді) Payload `access` функциялары тексереді.
// Бұл модуль тек мүдделер қақтығысы мен баға ережелерін шешеді.
//
// Болжам: «баға екі тұлғамен» = кемінде бір 'expert' және бір 'committee-member' жазбасы, ал
//   олардың evaluatorId әртүрлі. Екі бағаны біріктіру (орташа немесе келісу) тәсілі ТТ-да жоқ,
//   сондықтан бұл модульде қарастырылмайды.
// Болжам: декларация объектіге (инвестор, жоба немесе ұйым) id бойынша сәйкес келсе, қақтығыс бар.
//   Шақырушы тек күші бар декларацияларды береді (мерзімі мен кері қайтару мұнда жоқ), ал
//   subject.organizationId жобаның немесе инвестордың ұйымынан толтырылады.
// Болжам: 12 ай = күнтізбелік 12 ай (UTC); дәл 12 ай толған сәттен бастап қайта қарау қажет.
// Болжам: бұрын бағаланбаған немесе күні жарамсыз инвестор үшін қайта қарау қажет (қауіпсіз жағы).

import { addMonthsUtc, type DateInput, toTimestamp } from './dates'

export const REASSESSMENT_MONTHS = 12

export type AssessorRole = 'expert' | 'committee-member'

export type AssessmentRecord = { evaluatorId: string; role: AssessorRole }

export type CoiSubject = {
  investorId?: string | null
  projectId?: string | null
  organizationId?: string | null
}

/** Мүдделер қақтығысы декларациясы (ТТ 13.3 coiDeclarations): адам + байланысты тарап */
export type CoiDeclaration = {
  evaluatorId: string
  investorId?: string | null
  projectId?: string | null
  organizationId?: string | null
}

export type EvaluatorPermissions = { view: boolean; score: boolean; vote: boolean }

/**
 * Баға бекітіле ме. Екі тұлға керек: сарапшы + комитет мүшесі, екеуі әртүрлі адам.
 * `missing` кодтары: 'expert', 'committee-member', 'distinct-evaluators'.
 */
export function canFinalizeAssessment(assessments: readonly AssessmentRecord[]): {
  ok: boolean
  missing: string[]
} {
  const named = assessments.filter(
    (item) => typeof item.evaluatorId === 'string' && item.evaluatorId.trim() !== '',
  )
  const experts = new Set(named.filter((item) => item.role === 'expert').map((item) => item.evaluatorId))
  const members = new Set(
    named.filter((item) => item.role === 'committee-member').map((item) => item.evaluatorId),
  )

  const missing: string[] = []
  if (experts.size === 0) missing.push('expert')
  if (members.size === 0) missing.push('committee-member')
  if (missing.length === 0) {
    const hasDistinctPair = [...experts].some((expertId) =>
      [...members].some((memberId) => memberId !== expertId),
    )
    if (!hasDistinctPair) missing.push('distinct-evaluators')
  }
  return { ok: missing.length === 0, missing }
}

const sameId = (a: string | null | undefined, b: string | null | undefined): boolean =>
  Boolean(a) && Boolean(b) && a === b

/** Бағалаушының осы объектімен мүдделер қақтығысы бар ма (ТТ 14.3) */
export function hasConflictOfInterest(
  evaluatorId: string,
  subject: CoiSubject,
  declarations: readonly CoiDeclaration[],
): boolean {
  return declarations.some(
    (declaration) =>
      declaration.evaluatorId === evaluatorId &&
      (sameId(declaration.investorId, subject.investorId) ||
        sameId(declaration.projectId, subject.projectId) ||
        sameId(declaration.organizationId, subject.organizationId)),
  )
}

/**
 * Мүдделер қақтығысы бар сарапшы объектіні КӨРЕ АЛАДЫ, бірақ баға қоя алмайды және дауыс бере
 * алмайды (ТТ 14.3): `{ view: true, score: false, vote: false }`.
 */
export function canEvaluate(
  evaluatorId: string,
  subject: CoiSubject,
  declarations: readonly CoiDeclaration[],
): EvaluatorPermissions {
  const conflict = hasConflictOfInterest(evaluatorId, subject, declarations)
  return { view: true, score: !conflict, vote: !conflict }
}

/** Баға динамикалық (ТТ 8.2): 12 айда бір немесе жаңа дерек келгенде қайта қаралады. */
export function isReassessmentDue(
  lastAssessedAt: DateInput | null | undefined,
  now: DateInput,
  newDataArrived = false,
): boolean {
  if (newDataArrived) return true
  const last = toTimestamp(lastAssessedAt)
  const current = toTimestamp(now)
  if (Number.isNaN(last) || Number.isNaN(current)) return true
  return current >= addMonthsUtc(new Date(last), REASSESSMENT_MONTHS).getTime()
}
