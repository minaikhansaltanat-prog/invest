// Жоба деңгейлері мен ашық каталог ережелері (ТТ 8.3, 7.4).
//
// | Деңгей | Кіру шарты (ТТ 8.3)                                        | Ашық каталогта |
// | 1      | Иесі, орны, мақсаты жазылған                                | жоқ            |
// | 2      | Құжаттар, жер мәртебесі, бастапқы тәуекелдер тексерілді      | иә             |
// | 3      | Комитет бекітті, паспорт пен алдын ала ТЭН дайын             | иә             |
// | 4      | Қаражаттың түсуі құжатпен расталды                          | жоқ (нәтиже)   |
//
// Болжам: 1-деңгейдегі «орны» = `region` өрісі, «иесі» = `owner.id` немесе `owner.name`.
// Болжам: деңгейге көтергенде төменгі деңгейлердің шарттары да қайта тексеріледі (жинақталған),
//   сондықтан тексерілмеген жоба 3-деңгейге көтерілмейді. Деңгейді өткізіп секіруге болмайды.
// Болжам: 2-деңгей шарты «тексерілді» белгілері (documentsVerified, landStatusVerified,
//   initialRisksVerified); 3-деңгейде `committeeDecision === 'approved'` (бекіту), паспорт және ТЭН
//   белгілері; 4-деңгейде `amounts.received > 0` және кемінде бір дәлел файлы.
// Болжам: каталогқа шығаруда 2-деңгей үшін тек рұқсат белгісі қаралады (ТТ), 3-деңгей үшін
//   комитет шешімі қосымша. Деңгей `canPromoteToLevel` арқылы ғана өзгереді деп есептеледі.
// Болжам: ашық проекцияға `slug` кірмейді (ТТ тізімі нақты 8 өріс); сілтеме керек болса
//   шақырушы өзі қосады. Жауапты менеджерден тек аты шығады (пошта мен рөл емес).

import type {
  ProjectLevelValue,
  ProjectModelValue,
  ProjectStageValue,
  RegionValue,
  SectorValue,
} from '@/lib/taxonomy'

import { type FourAmounts, hasReceivedEvidence } from './amounts'

export type CommitteeDecision = 'pending' | 'approved' | 'rejected'

/**
 * Ережелер оқитын жоба деректері. Payload құжатын осы түрге келтіреді: барлық өріс міндетті емес,
 * жетіспейтін дерек әрқашан қауіпсіз жағына (рұқсат бермеуге) ауытқиды.
 */
export type ProjectRecord = {
  // Ашық карточка өрістері (ТТ 7.4)
  title?: string | null
  summary?: string | null
  sector?: SectorValue | null
  region?: RegionValue | null
  amountMusd?: number | null
  model?: ProjectModelValue | null
  level?: ProjectLevelValue | null
  responsibleManager?: { name?: string | null } | null
  /** «Ашық каталогқа шығару» белгісі */
  publishToCatalog?: boolean | null

  // Ішкі деректер: ашық проекцияға ешқашан шықпайды
  owner?: { id?: string | null; name?: string | null } | null
  purpose?: string | null
  /** Жобаның қажеттілігі (1-кезеңде тіркеледі) */
  need?: string | null
  documentsVerified?: boolean | null
  landStatusVerified?: boolean | null
  initialRisksVerified?: boolean | null
  committeeDecision?: CommitteeDecision | null
  passportReady?: boolean | null
  /** Алдын ала ТЭН */
  feasibilityStudyReady?: boolean | null
  amounts?: FourAmounts | null

  // 8 кезеңдік цикл (pipeline.ts)
  stage?: ProjectStageValue | null
  secretariatChecklistApproved?: boolean | null
  interestedInvestorCount?: number | null
  intentProtocolSigned?: boolean | null
  termSheetSigned?: boolean | null
  contractSigned?: boolean | null
  productionStarted?: boolean | null
}

export type RuleCheck = { ok: boolean; missing: string[] }

const isFilled = (value: string | null | undefined): boolean =>
  typeof value === 'string' && value.trim() !== ''

/** Тексеруден өтпеген талаптардың кодтары */
const failed = (checks: ReadonlyArray<readonly [code: string, passed: unknown]>): string[] =>
  checks.filter(([, passed]) => !passed).map(([code]) => code)

/** 1-деңгей талабы (ТТ 8.3): иесі, орны, мақсаты. Кодтар: 'owner', 'location', 'purpose'. */
export function missingConceptFields(project: ProjectRecord): string[] {
  return failed([
    ['owner', isFilled(project.owner?.id) || isFilled(project.owner?.name)],
    ['location', Boolean(project.region)],
    ['purpose', isFilled(project.purpose)],
  ])
}

const levelOrder: readonly ProjectLevelValue[] = ['1', '2', '3', '4']
/** 1-4; белгісіз немесе жоқ деңгей үшін 0. Сан түрінде келген мән ('3' орнына 3) де танылады. */
const levelRank = (level: string | number | null | undefined): number =>
  levelOrder.indexOf(String(level) as ProjectLevelValue) + 1

const hasEvidencedReceipt = (amounts: FourAmounts | null | undefined): boolean =>
  !!amounts &&
  typeof amounts.received === 'number' &&
  amounts.received > 0 &&
  hasReceivedEvidence(amounts)

const levelRequirements: Record<ProjectLevelValue, (project: ProjectRecord) => string[]> = {
  '1': missingConceptFields,
  '2': (project) =>
    failed([
      ['documents', project.documentsVerified],
      ['landStatus', project.landStatusVerified],
      ['initialRisks', project.initialRisksVerified],
    ]),
  '3': (project) =>
    failed([
      ['committeeApproval', project.committeeDecision === 'approved'],
      ['passport', project.passportReady],
      ['feasibilityStudy', project.feasibilityStudyReady],
    ]),
  '4': (project) => failed([['fundsReceiptEvidence', hasEvidencedReceipt(project.amounts)]]),
}

/**
 * Жобаны `target` деңгейіне көтеруге бола ма. Тек келесі деңгейге көтеріледі (1-ден тікелей 3-ке
 * жоқ), сонымен бірге 1-деңгейден `target`-ке дейінгі барлық шарт орындалуы тиіс.
 * `missing` кодтары: 'level-skip', 'target-not-higher', 'invalid-level', 'owner', 'location',
 * 'purpose', 'documents', 'landStatus', 'initialRisks', 'committeeApproval', 'passport',
 * 'feasibilityStudy', 'fundsReceiptEvidence'.
 */
export function canPromoteToLevel(project: ProjectRecord, target: ProjectLevelValue): RuleCheck {
  const targetRank = levelRank(target)
  if (targetRank === 0) return { ok: false, missing: ['invalid-level'] }

  const currentRank = levelRank(project.level)
  if (targetRank <= currentRank) return { ok: false, missing: ['target-not-higher'] }
  if (targetRank > currentRank + 1) return { ok: false, missing: ['level-skip'] }

  const missing = levelOrder
    .slice(0, targetRank)
    .flatMap((level) => levelRequirements[level](project))
  return { ok: missing.length === 0, missing }
}

/**
 * Ашық каталогқа шығаруға бола ма (ТТ 8.3, 7.4): тек 2 және 3 деңгей, жариялауға рұқсат белгісі
 * бар; 3-деңгей үшін комитет шешімі қосымша. 1-деңгей ешқашан.
 * `missing` кодтары: 'level-not-publishable', 'publish-permission', 'committeeApproval'.
 */
export function canPublishToCatalog(project: ProjectRecord): RuleCheck {
  const level = project.level
  const missing = failed([
    ['level-not-publishable', level === '2' || level === '3'],
    ['publish-permission', project.publishToCatalog === true],
    ['committeeApproval', level !== '3' || project.committeeDecision === 'approved'],
  ])
  return { ok: missing.length === 0, missing }
}

/** Ашық карточка (ТТ 7.4). Жоба иесі, құпия деректер, төрт сома және құжаттар мұнда жоқ. */
export type PublicProject = {
  title: string | null
  sector: SectorValue | null
  region: RegionValue | null
  /** Болжамды көлем, млн $ (төрт сома емес) */
  amountMusd: number | null
  model: ProjectModelValue | null
  level: ProjectLevelValue | null
  summary: string | null
  responsibleManager: string | null
}

/**
 * Ашық карточкаға жіберілетін өрістердің АҚ ТІЗІМІ. Нәтиже өрістері бір-бірлеп жазылады
 * (бастапқы объект көшірілмейді), сондықтан жаңадан қосылған құпия өріс өздігінен шықпайды.
 */
export function toPublicProject(project: ProjectRecord): PublicProject {
  const amount = project.amountMusd
  return {
    title: project.title ?? null,
    sector: project.sector ?? null,
    region: project.region ?? null,
    amountMusd: typeof amount === 'number' && Number.isFinite(amount) ? amount : null,
    model: project.model ?? null,
    level: project.level ?? null,
    summary: project.summary ?? null,
    responsibleManager: project.responsibleManager?.name?.trim() || null,
  }
}
