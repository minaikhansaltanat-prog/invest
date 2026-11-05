import { defaultScoringConfig, type ScoringConfigData, validateScoringConfig } from '@/lib/scoring/config'
import type { GradeKey } from '@/lib/scoring/config'

import type { FourAmounts } from './amounts'
import type { MatchInvestor, MatchProject } from './matching'
import type { NdaRecord } from './dataroom'
import type { ProjectRecord } from './projectRules'

// Payload құжаттарын таза ереже кітапханасының түрлеріне келтіреді (ТТ 8). Бос/жетіспейтін дерек қауіпсіз жағына ауытқиды.
// Түрлер құрылымдық: payload-types генерациясына тәуелді емес (hook-тар мен тесттер бір-біріне кедергі жасамайды).

type Id = string | number | { id: string | number; name?: string | null } | null | undefined
const idOf = (value: Id): string | null =>
  value === null || value === undefined ? null : typeof value === 'object' ? String(value.id) : String(value)
const nameOf = (value: Id): string | null => (value && typeof value === 'object' ? (value.name ?? null) : null)

export type ScoringConfigDoc = {
  dimensions?: { key?: string | null; weight?: number | null }[] | null
  grades?: { key?: string | null; min?: number | null; max?: number | null }[] | null
}

/** Баптау жарамсыз болса (салмақ қосындысы 100 емес т.б.), әдепкі баптау қолданылады: бағалау ешқашан бұзылған конфигпен жүрмейді */
export function toScoringConfig(doc: ScoringConfigDoc | null | undefined): ScoringConfigData {
  const config: ScoringConfigData = {
    dimensions: (doc?.dimensions ?? []).flatMap((item) =>
      item.key && typeof item.weight === 'number' ? [{ key: item.key, weight: item.weight }] : [],
    ),
    grades: (doc?.grades ?? []).flatMap((item) =>
      item.key && typeof item.min === 'number' && typeof item.max === 'number'
        ? [{ key: item.key as GradeKey, min: item.min, max: item.max }]
        : [],
    ),
  }
  return validateScoringConfig(config).length === 0 ? config : defaultScoringConfig
}

export type ProjectDoc = {
  title?: string | null
  summary?: string | null
  sector?: string | null
  region?: string | null
  amountMusd?: number | null
  model?: string | null
  level?: string | null
  stage?: string | null
  publishToCatalog?: boolean | null
  internal?: {
    ownerOrganization?: Id
    ownerName?: string | null
    purpose?: string | null
    need?: string | null
    documentsVerified?: boolean | null
    landStatusVerified?: boolean | null
    initialRisksVerified?: boolean | null
    committeeDecision?: 'pending' | 'approved' | 'rejected' | null
    passportReady?: boolean | null
    feasibilityStudyReady?: boolean | null
    secretariatChecklistApproved?: boolean | null
    interestedInvestorCount?: number | null
    intentProtocolSigned?: boolean | null
    termSheetSigned?: boolean | null
    contractSigned?: boolean | null
    productionStarted?: boolean | null
    responsibleManager?: Id
    riskLevel?: 'low' | 'medium' | 'high' | null
    amounts?: {
      declared?: number | null
      loi?: number | null
      contract?: number | null
      received?: number | null
      receivedEvidence?: unknown[] | null
      associationContribution?: 'direct' | 'indirect' | null
    } | null
  } | null
}

export function toFourAmounts(amounts: NonNullable<ProjectDoc['internal']>['amounts']): FourAmounts {
  return {
    declared: amounts?.declared ?? null,
    loi: amounts?.loi ?? null,
    contract: amounts?.contract ?? null,
    received: amounts?.received ?? null,
    receivedEvidenceFiles: amounts?.receivedEvidence?.length ?? 0,
    associationContribution: amounts?.associationContribution ?? null,
  }
}

export function toProjectRecord(doc: ProjectDoc): ProjectRecord {
  const internal = doc.internal ?? {}
  return {
    title: doc.title,
    summary: doc.summary,
    sector: doc.sector as ProjectRecord['sector'],
    region: doc.region as ProjectRecord['region'],
    amountMusd: doc.amountMusd,
    model: doc.model as ProjectRecord['model'],
    level: doc.level as ProjectRecord['level'],
    stage: doc.stage as ProjectRecord['stage'],
    publishToCatalog: doc.publishToCatalog,
    responsibleManager: internal.responsibleManager ? { name: nameOf(internal.responsibleManager) ?? idOf(internal.responsibleManager) } : null,
    owner: { id: idOf(internal.ownerOrganization), name: internal.ownerName },
    purpose: internal.purpose,
    need: internal.need,
    documentsVerified: internal.documentsVerified,
    landStatusVerified: internal.landStatusVerified,
    initialRisksVerified: internal.initialRisksVerified,
    committeeDecision: internal.committeeDecision,
    passportReady: internal.passportReady,
    feasibilityStudyReady: internal.feasibilityStudyReady,
    amounts: toFourAmounts(internal.amounts),
    secretariatChecklistApproved: internal.secretariatChecklistApproved,
    interestedInvestorCount: internal.interestedInvestorCount,
    intentProtocolSigned: internal.intentProtocolSigned,
    termSheetSigned: internal.termSheetSigned,
    contractSigned: internal.contractSigned,
    productionStarted: internal.productionStarted,
  }
}

export type InvestorDoc = {
  id: string | number
  grade?: string | null
  veto?: { active?: boolean | null; reason?: string | null } | null
  lastAssessedAt?: string | null
  sectors?: string[] | null
  regions?: string[] | null
  models?: string[] | null
  minAmountMusd?: number | null
  maxAmountMusd?: number | null
  riskAppetite?: 'low' | 'medium' | 'high' | null
}

export function toMatchInvestor(doc: InvestorDoc): MatchInvestor {
  return {
    id: String(doc.id),
    grade: (doc.grade as GradeKey | null) ?? null,
    veto: { active: Boolean(doc.veto?.active), reason: doc.veto?.reason ?? null },
    lastAssessedAt: doc.lastAssessedAt ?? null,
    sectors: (doc.sectors ?? []) as MatchInvestor['sectors'],
    regions: (doc.regions ?? []) as MatchInvestor['regions'],
    models: (doc.models ?? []) as MatchInvestor['models'],
    minAmountMusd: doc.minAmountMusd ?? null,
    maxAmountMusd: doc.maxAmountMusd ?? null,
    riskAppetite: doc.riskAppetite ?? null,
  }
}

export function toMatchProject(id: string | number, doc: ProjectDoc): MatchProject {
  return {
    id: String(id),
    sector: doc.sector as MatchProject['sector'],
    region: doc.region as MatchProject['region'],
    model: doc.model as MatchProject['model'],
    amountMusd: doc.amountMusd ?? null,
    riskLevel: doc.internal?.riskLevel ?? null,
  }
}

export type NdaDoc = {
  project?: Id
  investor?: Id
  signedAt?: string | null
  expiresAt?: string | null
  revokedAt?: string | null
}

export function toNdaRecord(doc: NdaDoc | null | undefined): NdaRecord | null {
  if (!doc) return null
  return {
    projectId: idOf(doc.project) ?? '',
    investorId: idOf(doc.investor) ?? '',
    signedAt: doc.signedAt ?? '',
    expiresAt: doc.expiresAt ?? null,
    revokedAt: doc.revokedAt ?? null,
  }
}
