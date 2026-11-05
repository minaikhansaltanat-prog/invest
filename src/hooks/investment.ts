import {
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type PayloadRequest,
  ValidationError,
} from 'payload'

import { hasAdminRole } from '@/access'
import { validateFourAmounts } from '@/lib/investment/amounts'
import { canAdvanceStage } from '@/lib/investment/pipeline'
import { canPromoteToLevel, canPublishToCatalog } from '@/lib/investment/projectRules'
import { type ProjectDoc, toProjectRecord, toScoringConfig } from '@/lib/investment/records'
import type { ProjectLevelValue, ProjectStageValue } from '@/lib/taxonomy'
import { computeScore } from '@/lib/scoring/score'
import { canFinalizeAssessment, hasConflictOfInterest, isReassessmentDue } from '@/lib/scoring/evaluators'
import { isMatchableGrade, isVetoActive, resolveInvestorStatus } from '@/lib/scoring/status'

// Бизнес-ережелер сервер жағында (ТТ 8): UI-ды айналып өтуге болмайды. Ережелердің өзі `src/lib/{scoring,investment}` ішінде.
// ЕРЕЖЕ: hook ішіндегі Local API шақыруына `req` берілуі тиіс (әйтпесе бөлек транзакция құлыптан deadlock жасайды).

type Doc = Record<string, unknown>
type Issue = { path: string; message: string }

const idOf = (value: unknown): string | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return String((value as { id?: unknown }).id ?? '')
  return String(value)
}

const fail = (collection: string, errors: Issue[]): never => {
  throw new ValidationError({ collection, errors })
}

const rule = (path: string, codes: string[]): Issue => ({ path, message: `rule: ${codes.join(', ')}` })

const isServerApply = (req: PayloadRequest) => req.context?.internalApply === true

/** Бастапқы сид (мысал деректер) ережелерден босатылады: тек `payload run` сидінен, REST арқылы бұл контекст берілмейді */
const isSeed = (req: PayloadRequest) => req.context?.seed === true || req.context?.skipRules === true

// ---------- Жобалар: деңгей, жариялау, кезең, төрт сома (ТТ 8.3, 8.4, 8.7) ----------

const mergeProject = (original: Doc | undefined, incoming: Doc | undefined): ProjectDoc => {
  const base = (original ?? {}) as ProjectDoc
  const next = (incoming ?? {}) as ProjectDoc
  return {
    ...base,
    ...next,
    internal: {
      ...(base.internal ?? {}),
      ...(next.internal ?? {}),
      amounts: { ...(base.internal?.amounts ?? {}), ...(next.internal?.amounts ?? {}) },
    },
  }
}

export const projectBusinessRules: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  if (isSeed(req)) return data
  const merged = mergeProject(originalDoc as Doc | undefined, data as Doc)
  const next = toProjectRecord(merged)
  const prev = originalDoc ? toProjectRecord(originalDoc as ProjectDoc) : null
  const chair = hasAdminRole(req, 'chair')
  const errors: Issue[] = []

  // Деңгей: жаңа жоба 1-деңгейден басталады; көтеру тек келесі деңгейге және шарттар орындалса; төмендету тек төраға
  if (operation === 'create') {
    if (next.level && next.level !== '1') errors.push(rule('level', ['level-skip']))
    if (next.stage && next.stage !== '1') errors.push(rule('stage', ['stage-skip']))
  } else if (prev?.level && next.level && next.level !== prev.level) {
    if (Number(next.level) > Number(prev.level)) {
      const check = canPromoteToLevel({ ...next, level: prev.level }, next.level as ProjectLevelValue)
      if (!check.ok) errors.push(rule('level', check.missing))
    } else if (!chair) errors.push(rule('level', ['level-downgrade-not-allowed']))
  }

  // Жариялау: ашық каталогқа тек ережеге сай жоба. Нақты қосу талабы қате береді, шарт кейін бұзылса, автоматты түрде алынады
  if (next.publishToCatalog) {
    const check = canPublishToCatalog(next)
    if (!check.ok) {
      if (!prev?.publishToCatalog) errors.push(rule('publishToCatalog', check.missing))
      else (data as Doc).publishToCatalog = false
    }
  }

  // Кезең: өткізіп жіберуге болмайды, артқа тек төраға
  const stageChanged = Boolean(prev?.stage && next.stage && next.stage !== prev.stage)
  if (stageChanged && prev) {
    const check = canAdvanceStage({ ...next, stage: prev.stage }, next.stage as ProjectStageValue, { allowRollback: chair })
    if (!check.ok) errors.push(rule('stage', check.missing))
  }

  // Төрт сома: теріс емес, «түскен» тек дәлелмен
  const amounts = validateFourAmounts(next.amounts ?? {})
  for (const error of amounts.errors) errors.push(rule(`internal.amounts.${error.field}`, [error.code]))

  if (errors.length > 0) fail('projects', errors)

  // Кезеңдер тарихы: әрқашан серверде құрылады
  const history = ((originalDoc as ProjectDoc | undefined)?.internal as { stageHistory?: unknown[] } | undefined)?.stageHistory ?? []
  const entry = operation === 'create' || stageChanged ? [{ stage: next.stage ?? '1', at: new Date().toISOString(), by: String(req.user?.id ?? 'system') }] : []
  ;(data as Doc).internal = { ...(((data as Doc).internal as object) ?? {}), stageHistory: [...history, ...entry] }
  return data
}

// ---------- Инвесторлар: вето, мәртебе (ТТ 8.2) ----------

export const investorRules: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const original = (originalDoc ?? {}) as Doc & { veto?: { active?: boolean; reason?: string } }
  const incoming = data as Doc & { veto?: { active?: boolean; reason?: string; setBy?: unknown; setAt?: string } }
  const veto = { active: false, ...(original.veto ?? {}), ...(incoming.veto ?? {}) } as { active: boolean; reason?: string }

  if (veto.active && !String(veto.reason ?? '').trim()) fail('investors', [rule('veto.reason', ['veto-reason-required'])])

  // Баға мен мәртебені тек бағалау бекітілгенде сервер өзгертеді; қолмен берілген мән ескерілмейді
  if (!isServerApply(req)) {
    for (const key of ['totalScore', 'grade', 'lastAssessedAt'] as const) incoming[key] = original[key]
  }
  const total = typeof incoming.totalScore === 'number' ? incoming.totalScore : null

  if (Boolean(veto.active) !== Boolean(original.veto?.active)) {
    incoming.veto = { ...veto, setBy: req.user?.id, setAt: new Date().toISOString() }
  }

  const config = toScoringConfig((await req.payload.findGlobal({ slug: 'scoringConfig', overrideAccess: true, req })) as never)
  if (total === null) {
    incoming.status = isVetoActive(veto) ? 'stopped' : 'unassessed'
    incoming.grade = null
  } else {
    const result = resolveInvestorStatus({ total, config, veto })
    incoming.status = result.status
    incoming.grade = result.grade
  }
  return incoming
}

// ---------- Scorecard: есептеу, мүдделер қақтығысы, бекіту (ТТ 8.2, 14.3) ----------

type Entry = { dimension?: string; points?: number; evidenceText?: string; evidenceFiles?: unknown[] | null }
type Assessment = { evaluator?: unknown; role?: 'expert' | 'committee-member' }

export const scorecardRules: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const merged = { ...((originalDoc ?? {}) as Doc), ...(data as Doc) } as Doc & { entries?: Entry[]; assessments?: Assessment[]; investor?: unknown }
  const config = toScoringConfig((await req.payload.findGlobal({ slug: 'scoringConfig', overrideAccess: true, req })) as never)

  const score = computeScore(
    config,
    (merged.entries ?? []).map((entry) => ({
      dimension: String(entry.dimension ?? ''),
      points: Number(entry.points),
      evidenceText: entry.evidenceText,
      evidenceFiles: Array.isArray(entry.evidenceFiles) ? entry.evidenceFiles.length : 0,
    })),
  )

  // Мүдделер қақтығысы: қақтығысы бар сарапшы баға қоя алмайды
  const investorId = idOf(merged.investor)
  const errors: Issue[] = []
  if (investorId) {
    const investor = (await req.payload.findByID({ collection: 'investors', id: investorId, overrideAccess: true, depth: 0, req })) as unknown as Doc
    const organizationId = idOf(investor.organization)
    const declarations = await req.payload.find({
      collection: 'coiDeclarations',
      where: { or: [{ investor: { equals: investorId } }, ...(organizationId ? [{ organization: { equals: organizationId } }] : [])] },
      overrideAccess: true,
      depth: 0,
      limit: 200,
      req,
    })
    const mapped = declarations.docs.map((doc) => ({
      evaluatorId: idOf(doc.person) ?? '',
      investorId: idOf(doc.investor),
      projectId: idOf(doc.project),
      organizationId: idOf(doc.organization),
    }))
    for (const [index, assessment] of (merged.assessments ?? []).entries()) {
      const evaluatorId = idOf(assessment.evaluator)
      if (evaluatorId && hasConflictOfInterest(evaluatorId, { investorId, organizationId }, mapped)) {
        errors.push(rule(`assessments.${index}.evaluator`, ['conflict-of-interest']))
      }
    }
  }
  if (errors.length > 0) fail('scorecards', errors)

  const finalizable = canFinalizeAssessment(
    (merged.assessments ?? []).flatMap((item) => (item.evaluator && item.role ? [{ evaluatorId: idOf(item.evaluator) ?? '', role: item.role }] : [])),
  )
  const finalized = score.complete && finalizable.ok
  const out = data as Doc
  out.total = score.total
  out.grade = score.grade
  out.complete = score.complete
  out.finalized = finalized
  out.finalizedAt = finalized ? ((originalDoc as Doc | undefined)?.finalizedAt ?? new Date().toISOString()) : null
  return out
}

/** Бекітілген баға инвесторға түседі: жалпы балл, деңгей, мәртебе, соңғы бағалау күні */
export const applyScorecardToInvestor: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!doc.finalized) return doc
  const investorId = idOf(doc.investor)
  if (!investorId) return doc
  await req.payload.update({
    collection: 'investors',
    id: investorId,
    data: { totalScore: doc.total, lastAssessedAt: doc.finalizedAt ?? new Date().toISOString() },
    overrideAccess: true,
    depth: 0,
    req,
    context: { internalApply: true },
  })
  return doc
}

// ---------- Сәйкестендіру: тек жарамды инвестор ұсынылады, қызығушылық саны жаңарады (ТТ 8.5) ----------

export const matchRules: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const merged = { ...((originalDoc ?? {}) as Doc), ...(data as Doc) } as Doc & { investor?: unknown }
  const investorId = idOf(merged.investor)
  if (!investorId) return data
  const investor = (await req.payload.findByID({ collection: 'investors', id: investorId, overrideAccess: true, depth: 0, req })) as unknown as Doc & {
    grade?: 'A' | 'B' | 'C' | 'D' | null
    veto?: { active: boolean }
    lastAssessedAt?: string | null
  }
  const missing: string[] = []
  if (!isMatchableGrade(investor.grade)) missing.push('grade-too-low')
  if (isVetoActive(investor.veto)) missing.push('veto-active')
  if (isReassessmentDue(investor.lastAssessedAt, new Date())) missing.push('assessment-outdated')
  if (missing.length > 0) fail('matches', [rule('investor', missing)])
  return data
}

export const refreshInterestedCount: CollectionAfterChangeHook = async ({ doc, req }) => {
  const projectId = idOf(doc.project)
  if (!projectId) return doc
  const { totalDocs } = await req.payload.count({
    collection: 'matches',
    where: { and: [{ project: { equals: projectId } }, { status: { in: ['interested', 'negotiating'] } }] },
    overrideAccess: true,
    req,
  })
  await req.payload.update({
    collection: 'projects',
    id: projectId,
    data: { internal: { interestedInvestorCount: totalDocs } },
    overrideAccess: true,
    depth: 0,
    req,
    // санауыш жаңартуы ереже тексеруін қайта іске қоспайды (деңгей/кезең өзгермейді)
    context: { internalApply: true, skipRules: true },
  })
  return doc
}
