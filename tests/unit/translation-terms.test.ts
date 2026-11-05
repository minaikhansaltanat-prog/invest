import { describe, expect, it } from 'vitest'

import { kpiSeed, newsSeed, peopleSeed, projectsSeed, scoringSeed, servicesSeed, settingsSeed } from '@content/seed/data'
import { homeSeed } from '@content/seed/home'
import { T } from '@content/seed/lib'
import { allPagesSeed, servicesDetailSeed } from '@content/seed/pages'

import { localeMeta } from '@/i18n/config'

import en from '../../messages/en.json'
import kk from '../../messages/kk.json'
import ru from '../../messages/ru.json'
import zh from '../../messages/zh.json'

// Аударма аудитінен (docs/TRANSLATION_GAPS.md) шыққан тұрақты ережелер: түзетілген терминдер қайта оралмауы тиіс.

type Locale = 'kk' | 'ru' | 'en' | 'zh'

function collect(value: unknown, trail: string, out: Array<[string, Record<Locale, string>]>) {
  if (value instanceof T) out.push([trail, { kk: value.kk, ru: value.ru, en: value.en, zh: value.zh }])
  else if (Array.isArray(value)) value.forEach((item, i) => collect(item, `${trail}[${i}]`, out))
  else if (value && typeof value === 'object') for (const [k, child] of Object.entries(value)) collect(child, `${trail}.${k}`, out)
}

function flatten(value: unknown, trail: string, out: Array<[string, string]>) {
  if (value && typeof value === 'object') for (const [k, child] of Object.entries(value)) flatten(child, trail ? `${trail}.${k}` : k, out)
  else out.push([trail, String(value)])
}

const seed: Array<[string, Record<Locale, string>]> = []
for (const [name, data] of Object.entries({ homeSeed, servicesSeed, newsSeed, projectsSeed, scoringSeed, settingsSeed, kpiSeed, peopleSeed, servicesDetailSeed })) collect(data, name, seed)
for (const page of allPagesSeed) collect(page, `page ${page.path}`, seed)

const kkMessages: Array<[string, string]> = []
flatten(kk, '', kkMessages)
const kkTexts: Array<[string, string]> = [...kkMessages.map(([k, v]) => [`messages ${k}`, v] as [string, string]), ...seed.map(([k, v]) => [k, v.kk] as [string, string])]

describe('қазақша терминдер', () => {
  it('«видео» орнына «бейне» қолданылады', () => {
    const offenders = kkTexts.filter(([, text]) => /видео/i.test(text)).map(([where]) => where)
    expect(offenders).toEqual([])
  })

  it('«due diligence» қазақша мәтінде «тиісті тексеру» деп жазылады', () => {
    const offenders = kkTexts.filter(([, text]) => /due diligence/i.test(text)).map(([where]) => where)
    expect(offenders).toEqual([])
  })

  it('басты беттегі тіл тізімі ауыстырғыш белгілеріне сәйкес', () => {
    const fact = homeSeed.hero.facts.find((item) => item.id === 'fact-languages')
    expect(fact?.text.kk).toBe(['ҚАЗ', 'РУС', 'ENG', '中文'].join(' · '))
    expect([localeMeta.kk.short, localeMeta.ru.short, localeMeta.en.short, localeMeta.zh.short]).toEqual(['ҚАЗ', 'РУС', 'ENG', '中文'])
  })
})

describe('тілдер арасындағы интерфейс кілттері', () => {
  const keys = (bundle: unknown) => {
    const out: Array<[string, string]> = []
    flatten(bundle, '', out)
    return out.map(([k]) => k).sort()
  }

  it('ru, en, zh файлдарында kk-дегі барлық кілт бар және артық кілт жоқ', () => {
    const base = keys(kk)
    expect(keys(ru)).toEqual(base)
    expect(keys(en)).toEqual(base)
    expect(keys(zh)).toEqual(base)
  })

  it('бос интерфейс мәні жоқ', () => {
    for (const [name, bundle] of Object.entries({ kk, ru, en, zh })) {
      const out: Array<[string, string]> = []
      flatten(bundle, '', out)
      expect(out.filter(([, v]) => v.trim() === '').map(([k]) => `${name}:${k}`)).toEqual([])
    }
  })

  it('ru мәтінінде ағылшынша «Data room» қалмаған', () => {
    expect(ru.dataroom.pageTitle).not.toBe(en.dataroom.pageTitle)
  })
})
