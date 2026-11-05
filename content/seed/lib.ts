// Seed контентін 4 тілде қатар жазуға арналған көмекші.
// t('қазақша', 'орысша', 'ағылшынша', '中文') ішіндегі әр мән бір рет жазылады, ал seed жүргізгенде
// pick(obj, 'ru') барлық T мәнін сол тілдегі жолға ауыстырады.
export type SeedLocale = 'kk' | 'ru' | 'en' | 'zh'

export class T {
  constructor(
    readonly kk: string,
    readonly ru: string,
    readonly en: string,
    readonly zh: string,
  ) {}
}

export const t = (kk: string, ru: string, en: string, zh: string) => new T(kk, ru, en, zh)

/** T мәндері жол болып ауысқан түрі */
export type Picked<V> = V extends T
  ? string
  : V extends readonly (infer U)[]
    ? Picked<U>[]
    : V extends object
      ? { [K in keyof V]: Picked<V[K]> }
      : V

/** Объект ішіндегі барлық T мәнін көрсетілген тілге ауыстырады (массив пен ішкі объектілерді қоса) */
export function pick<V>(value: V, locale: SeedLocale): Picked<V> {
  return pickValue(value, locale) as Picked<V>
}

function pickValue(value: unknown, locale: SeedLocale): unknown {
  if (value instanceof T) return value[locale]
  if (Array.isArray(value)) return value.map((item) => pickValue(item, locale))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, pickValue(child, locale)]))
  }
  return value
}

/** Seed ішіндегі T мәндерінің толықтығын тексереді: бос жол болмауы тиіс */
export function collectEmpty(value: unknown, trail = ''): string[] {
  if (value instanceof T) {
    return (['kk', 'ru', 'en', 'zh'] as const)
      .filter((locale) => value[locale].trim() === '')
      .map((locale) => `${trail} [${locale}]`)
  }
  if (Array.isArray(value)) return value.flatMap((item, i) => collectEmpty(item, `${trail}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => collectEmpty(child, `${trail}.${key}`))
  }
  return []
}
