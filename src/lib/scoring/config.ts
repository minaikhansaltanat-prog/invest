// 100 балдық бағалау баптауы: таза деректер түрі, әдепкі мән және тексеру (ТТ 8.2).
// Нақты өлшемдер мен салмақтар Payload-тағы `scoringConfig` global-ында сақталады (кодқа қатаң
// жазылмайды). Бұл модуль сол деректі қабылдайды; `defaultScoringConfig` тек әдепкі мән әрі
// тесттерге арналған (ол `content/seed/data.ts` ішіндегі scoringSeed-пен сәйкес).
//
// Болжам: деңгей шектері бүтін сан, көрші деңгей арасы дәл 1 балл (80 және 79). Бөлшек балл
//   (мысалы 79.5) төменгі деңгейге жатады: бұл `gradeFor` ішінде шешіледі (score.ts).
// Болжам: төрт деңгей (A, B, C, D) бір реттен болуы тиіс, A ең жоғары аралықты алады
//   (Payload-та деңгей жолдары дәл 4).
// Болжам: салмағы 0 өлшемге рұқсат (Payload-та min: 0), бірақ салмақ қосындысы 100 болуы тиіс.

export const gradeKeys = ['A', 'B', 'C', 'D'] as const
export type GradeKey = (typeof gradeKeys)[number]

export type ScoringDimension = { key: string; weight: number }
export type ScoringGrade = { key: GradeKey; min: number; max: number }

export type ScoringConfigData = {
  dimensions: readonly ScoringDimension[]
  grades: readonly ScoringGrade[]
}

const dimension = (key: string, weight: number): ScoringDimension =>
  Object.freeze({ key, weight })

const grade = (key: GradeKey, min: number, max: number): ScoringGrade =>
  Object.freeze({ key, min, max })

/** Әдепкі баптау (ТТ 8.2 кестесі). Қате өзгертілмеуі үшін мұздатылған. */
export const defaultScoringConfig: ScoringConfigData = Object.freeze({
  dimensions: Object.freeze([
    dimension('financialPotential', 25),
    dimension('intentAndAuthority', 15),
    dimension('sectorExperience', 15),
    dimension('reputation', 15),
    dimension('localContribution', 10),
    dimension('complianceRisk', 10),
    dimension('planReadiness', 10),
  ]),
  grades: Object.freeze([
    grade('A', 80, 100),
    grade('B', 65, 79),
    grade('C', 50, 64),
    grade('D', 0, 49),
  ]),
})

const EPSILON = 1e-9
const roundForMessage = (value: number): number => Math.round(value * 1e6) / 1e6

function validateDimensions(dimensions: readonly ScoringDimension[]): string[] {
  const errors: string[] = []
  if (dimensions.length === 0) errors.push('Кемінде бір өлшем болуы тиіс')

  const seen = new Set<string>()
  const repeated = new Set<string>()
  let weightTotal = 0
  for (const { key, weight } of dimensions) {
    if (typeof key !== 'string' || key.trim() === '') {
      errors.push('Өлшем кілті бос болмауы тиіс')
    } else if (seen.has(key)) {
      repeated.add(key)
    } else {
      seen.add(key)
    }

    if (!Number.isFinite(weight) || weight < 0) {
      errors.push(`Өлшем «${key}»: салмақ 0-ден кем емес сан болуы тиіс`)
    } else {
      weightTotal += weight
    }
  }
  for (const key of repeated) errors.push(`Өлшем кілті қайталанады: ${key}`)

  if (Math.abs(weightTotal - 100) > EPSILON) {
    errors.push(
      `Өлшем салмақтарының қосындысы 100 болуы тиіс, қазір ${roundForMessage(weightTotal)}`,
    )
  }
  return errors
}

function validateGrades(grades: readonly ScoringGrade[]): string[] {
  const errors: string[] = []

  const keys = grades.map((item) => item.key)
  const lettersOk =
    grades.length === gradeKeys.length &&
    gradeKeys.every((letter) => keys.filter((key) => key === letter).length === 1)
  if (!lettersOk) errors.push('Деңгейлер A, B, C, D болуы тиіс, әрқайсысы бір реттен')

  let boundsOk = grades.length > 0
  for (const { key, min, max } of grades) {
    const integers = Number.isInteger(min) && Number.isInteger(max)
    if (!integers || min < 0 || max > 100 || min > max) {
      errors.push(
        `Деңгей ${key}: шектер 0-100 аралығындағы бүтін сан болуы тиіс, төменгі шек жоғарғыдан үлкен болмауы тиіс`,
      )
      boundsOk = false
    }
  }
  if (!boundsOk) return errors

  const sorted = [...grades].sort((a, b) => a.min - b.min)
  if (sorted[0].min !== 0) errors.push('Ең төменгі деңгей 0 баллдан басталуы тиіс')
  if (sorted[sorted.length - 1].max !== 100) errors.push('Ең жоғарғы деңгей 100 баллмен аяқталуы тиіс')

  for (let i = 1; i < sorted.length; i += 1) {
    const lower = sorted[i - 1]
    const upper = sorted[i]
    if (upper.min <= lower.max) {
      errors.push(`Деңгейлер ${lower.key} және ${upper.key} қабаттасады`)
    } else if (upper.min > lower.max + 1) {
      errors.push(
        `Деңгейлер ${lower.key} және ${upper.key} арасында бос аралық бар: ${lower.max + 1}-${upper.min - 1}`,
      )
    }
  }

  const expectedOrder = [...gradeKeys].reverse().join('')
  if (lettersOk && sorted.map((item) => item.key).join('') !== expectedOrder) {
    errors.push('Деңгей әріптері баллға сәйкес болуы тиіс: A ең жоғары, D ең төмен')
  }
  return errors
}

/**
 * Баптауды тексереді. Бос тізім қайтса, баптау жарамды. Хабарламалар қазақша,
 * әкімшілік панельдегі `beforeValidate` hook-ы оларды `Error` ретінде лақтыра алады.
 * Тексеріледі: салмақ қосындысы 100, өлшем кілттері бірегей, деңгей шектері 0-100 аралығын
 * үзіліссіз әрі қабаттаспай жабады.
 */
export function validateScoringConfig(config: ScoringConfigData): string[] {
  return [
    ...validateDimensions(config.dimensions ?? []),
    ...validateGrades(config.grades ?? []),
  ]
}
