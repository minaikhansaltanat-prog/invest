// Күн-уақыт көмекшілері (барлығы UTC бойынша). Дерекқордан күн көбіне ISO жол болып келеді,
// сондықтан Date де, жол да, миллисекунд та қабылданады. Бұл файл scoring және investment
// модульдерінің ортақ негізі: басқа модульге тәуелді емес.

export type DateInput = Date | string | number

export const DAY_MS = 86_400_000

/** Миллисекунд. Бос немесе жарамсыз мән үшін NaN қайтады: шешімді шақырушы қабылдайды. */
export function toTimestamp(value: DateInput | null | undefined): number {
  if (value === null || value === undefined || value === '') return Number.NaN
  return value instanceof Date ? value.getTime() : new Date(value).getTime()
}

/** Күн қосады (UTC, 24 сағаттық тәулік). */
export function addDaysUtc(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

/** Күнтізбелік ай қосады. Айдың соңғы күні сақталады: 29.02.2024 + 12 ай = 28.02.2025. */
export function addMonthsUtc(date: Date, months: number): Date {
  const result = new Date(date.getTime())
  const day = result.getUTCDate()
  result.setUTCDate(1)
  result.setUTCMonth(result.getUTCMonth() + months)
  const lastDay = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate()
  result.setUTCDate(Math.min(day, lastDay))
  return result
}
