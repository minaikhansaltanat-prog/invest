// 100 балдық бағалауды есептеу (ТТ 8.2). Таза функциялар: дерекқорсыз, серверсіз.
// ТТ 8.2: әр өлшем бойынша балл, дәлелдеме мәтіні және дәлел файлдары міндетті.
//
// Болжам: ауқымнан тыс ұпай есептеуде [0, салмақ] аралығына қысылады, бірақ қате ретінде
//   тізімде қалады (`complete: false`). Сондықтан `total` әрқашан 0-100 аралығында.
// Болжам: дәлелдеме мәтіні мен файлы нөл ұпайлы өлшемде де міндетті (ТТ ерекшелік жасамайды).
// Болжам: белгісіз немесе қайталанған өлшем бөлек қате (`dimension-unknown`, `dimension-duplicate`);
//   қайталанғанда тек бірінші жазба есептеледі.
// Болжам: бөлшек ұпайға рұқсат; бөлшек жалпы балл төменгі деңгейге жатады (79.5 = B).
// Болжам: ұпай жоқ (null, NaN) болса, `points-out-of-range` қатесі және 0 ұпай.

import type { GradeKey, ScoringConfigData } from './config'

export type ScoreEntry = {
  dimension: string
  points: number
  evidenceText?: string | null
  /** Дәлел файлдарының саны */
  evidenceFiles?: number | null
}

export type ScoreErrorCode =
  | 'points-out-of-range'
  | 'evidence-text-missing'
  | 'evidence-files-missing'
  | 'dimension-missing'
  | 'dimension-unknown'
  | 'dimension-duplicate'

export type ScoreError = { code: ScoreErrorCode; dimension: string }

export type ScoreResult = {
  /** 0-100. Қате болса да есептеледі, бірақ `complete: false` */
  total: number
  /** Өлшем кілті -> есептелген ұпай (жетіспейтін өлшем кіре алмайды) */
  byDimension: Record<string, number>
  grade: GradeKey
  errors: ScoreError[]
  /** Қате жоқ, бағалау толық */
  complete: boolean
}

const roundScore = (value: number): number => Math.round(value * 1e6) / 1e6

/**
 * Жалпы баллға сәйкес деңгей. Деңгей = төменгі шегі жалпы баллдан аспайтын ең жоғары деңгей.
 * Баптаудағы деңгей жоқ немесе балл жарамсыз болса, ең төменгі деңгей (қауіпсіз жағы).
 */
export function gradeFor(config: ScoringConfigData, total: number): GradeKey {
  const byMinDescending = [...config.grades].sort((a, b) => b.min - a.min)
  const lowest = byMinDescending[byMinDescending.length - 1]
  if (!lowest) return 'D'
  if (!Number.isFinite(total)) return lowest.key
  const clamped = Math.min(Math.max(total, 0), 100)
  return (byMinDescending.find((item) => clamped >= item.min) ?? lowest).key
}

export function computeScore(config: ScoringConfigData, entries: readonly ScoreEntry[]): ScoreResult {
  const errors: ScoreError[] = []
  const knownKeys = new Set(config.dimensions.map((item) => item.key))
  const counted = new Map<string, ScoreEntry>()

  for (const entry of entries) {
    if (!knownKeys.has(entry.dimension)) {
      errors.push({ code: 'dimension-unknown', dimension: entry.dimension })
    } else if (counted.has(entry.dimension)) {
      errors.push({ code: 'dimension-duplicate', dimension: entry.dimension })
    } else {
      counted.set(entry.dimension, entry)
    }
  }

  const byDimension: Record<string, number> = {}
  let total = 0
  for (const { key, weight } of config.dimensions) {
    const entry = counted.get(key)
    if (!entry) {
      errors.push({ code: 'dimension-missing', dimension: key })
      continue
    }

    const finite = Number.isFinite(entry.points)
    if (!finite || entry.points < 0 || entry.points > weight) {
      errors.push({ code: 'points-out-of-range', dimension: key })
    }
    const points = finite ? Math.min(Math.max(entry.points, 0), weight) : 0
    byDimension[key] = points
    total += points

    if (!entry.evidenceText || entry.evidenceText.trim() === '') {
      errors.push({ code: 'evidence-text-missing', dimension: key })
    }
    if (!(typeof entry.evidenceFiles === 'number' && entry.evidenceFiles >= 1)) {
      errors.push({ code: 'evidence-files-missing', dimension: key })
    }
  }

  const rounded = roundScore(total)
  return {
    total: rounded,
    byDimension,
    grade: gradeFor(config, rounded),
    errors,
    complete: errors.length === 0,
  }
}
