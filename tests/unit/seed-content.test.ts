import { describe, expect, it } from 'vitest'

import { kpiSeed, newsSeed, peopleSeed, projectsSeed, scoringSeed, servicesSeed, settingsSeed } from '@content/seed/data'
import { homeSeed } from '@content/seed/home'
import { collectEmpty, pick, T } from '@content/seed/lib'

// Seed контентінің сапасы: төрт тілдің бәрі толтырылған, тілдер араласып кетпеген (ТТ 11.2, NIGHT_TASK 3.4).

const all = { homeSeed, servicesSeed, newsSeed, projectsSeed, scoringSeed, settingsSeed, kpiSeed, peopleSeed }

/** Объект ішіндегі барлық T мәндерін [жол, T] түрінде жинайды */
function collect(value: unknown, trail = ''): Array<[string, T]> {
  if (value instanceof T) return [[trail, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => collect(item, `${trail}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => collect(child, `${trail}.${key}`))
  }
  return []
}

const kazakhOnly = /[әғқңөұүһӘҒҚҢӨҰҮҺ]/
const han = /[一-鿿]/
const cyrillic = /[Ѐ-ӿ]/

describe('seed контенті: толықтық', () => {
  for (const [name, seed] of Object.entries(all)) {
    it(`${name}: бос жол жоқ (kk, ru, en, zh)`, () => {
      expect(collectEmpty(seed)).toEqual([])
    })
  }

  it('басты бет: барлық массивтердің мөлшері ТТ-ға сәйкес', () => {
    expect(homeSeed.hero.facts).toHaveLength(3)
    expect(homeSeed.audience.cards).toHaveLength(3)
    expect(homeSeed.results.cells).toHaveLength(4)
    expect(homeSeed.lifecycle.steps).toHaveLength(8)
    expect(homeSeed.lifecycle.levels).toHaveLength(4)
    expect(homeSeed.membership.categories).toHaveLength(5)
    expect(servicesSeed).toHaveLength(8)
    expect(scoringSeed.dimensions).toHaveLength(7)
    expect(scoringSeed.grades).toHaveLength(4)
  })

  it('бағалау өлшемдерінің салмағы 100 балл (ТТ 8.2)', () => {
    const total = scoringSeed.dimensions.reduce((sum, d) => sum + d.weight, 0)
    expect(total).toBe(100)
    expect(scoringSeed.dimensions.map((d) => d.weight)).toEqual([25, 15, 15, 15, 10, 10, 10])
  })

  it('A/B/C/D шектері үзіліссіз 0-100 аралығын жабады', () => {
    const grades = [...scoringSeed.grades].sort((a, b) => a.min - b.min)
    expect(grades[0].min).toBe(0)
    expect(grades[grades.length - 1].max).toBe(100)
    for (let i = 1; i < grades.length; i++) expect(grades[i].min).toBe(grades[i - 1].max + 1)
  })

  it('массив қатарларының id-лері бірегей (4 тілде бірдей қатарға жазылады)', () => {
    const ids: string[] = []
    const walk = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value === 'object' && !(value instanceof T)) {
        const record = value as Record<string, unknown>
        if (typeof record.id === 'string') ids.push(record.id)
        Object.values(record).forEach(walk)
      }
    }
    walk(homeSeed)
    walk(scoringSeed)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('seed контенті: тілдер араласпаған', () => {
  const content = [
    ...collect(homeSeed, 'home'),
    ...collect(servicesSeed, 'services'),
    ...collect(newsSeed, 'news'),
    ...collect(projectsSeed, 'projects'),
  ]
  // Латын әріптермен ғана жазылатын рұқсат етілген жолдар (аббревиатура, тіл тізімі)
  const latinOk = new Set(['KZ · RU · EN · 中文'])

  it('қытайша мәтін қытай иероглифтерін қамтиды', () => {
    const offenders = content.filter(([, t]) => !latinOk.has(t.zh) && !han.test(t.zh)).map(([path]) => path)
    expect(offenders).toEqual([])
  })

  it('қытайша мәтінде кириллица жоқ', () => {
    const offenders = content.filter(([, t]) => cyrillic.test(t.zh)).map(([path]) => path)
    expect(offenders).toEqual([])
  })

  it('орысша мәтінде қазақ әріптері жоқ (қазақша мәтін fallback болмауы)', () => {
    const offenders = content.filter(([, t]) => kazakhOnly.test(t.ru)).map(([path]) => path)
    expect(offenders).toEqual([])
  })

  it('ағылшынша мәтінде кириллица мен иероглиф жоқ', () => {
    const offenders = content.filter(([, t]) => (cyrillic.test(t.en) || han.test(t.en)) && !latinOk.has(t.en)).map(([path]) => path)
    expect(offenders).toEqual([])
  })

  it('қазақша мәтін кириллицада, ал қазақ әріптері кездеседі', () => {
    const kk = content.map(([, t]) => t.kk).join(' ')
    expect(cyrillic.test(kk)).toBe(true)
    expect(kazakhOnly.test(kk)).toBe(true)
  })

  it('ұзын сызықша (U+2014) жоқ: сан аралықтары дефиспен', () => {
    const text = JSON.stringify(pick(all, 'kk')) + JSON.stringify(pick(all, 'ru')) + JSON.stringify(pick(all, 'en')) + JSON.stringify(pick(all, 'zh'))
    expect(text.includes('—')).toBe(false)
  })
})
