import { describe, expect, it } from 'vitest'

import { isVisibleInLocale } from '@/fields/translationStatus'
import { locales } from '@/i18n/config'
import { projectLevels, projectModels, projectStages, regions, sectors } from '@/lib/taxonomy'

describe('аударма көрінімділігі (ТТ 11.2): қазақша мәтін fallback болмайды', () => {
  it('«аударма жоқ» (none) және бос мәртебе ешқашан көрінбейді', () => {
    for (const policy of ['allow-draft', 'approved-only'] as const) {
      expect(isVisibleInLocale({ ru: 'none' }, 'ru', policy)).toBe(false)
      expect(isVisibleInLocale({}, 'ru', policy)).toBe(false)
      expect(isVisibleInLocale(null, 'zh', policy)).toBe(false)
      expect(isVisibleInLocale(undefined, 'en', policy)).toBe(false)
    }
  })

  it('жобалама мен тексеруде тек allow-draft саясатында көрінеді', () => {
    for (const status of ['draft', 'review'] as const) {
      expect(isVisibleInLocale({ zh: status }, 'zh', 'allow-draft')).toBe(true)
      expect(isVisibleInLocale({ zh: status }, 'zh', 'approved-only')).toBe(false)
    }
  })

  it('бекітілген аударма әрқашан көрінеді', () => {
    expect(isVisibleInLocale({ en: 'approved' }, 'en', 'approved-only')).toBe(true)
    expect(isVisibleInLocale({ en: 'approved' }, 'en', 'allow-draft')).toBe(true)
  })

  it('бір тілдің мәртебесі басқа тілге әсер етпейді (kk бекітілген, zh жоқ)', () => {
    const status = { kk: 'approved', zh: 'none' } as const
    expect(isVisibleInLocale(status, 'kk')).toBe(true)
    expect(isVisibleInLocale(status, 'zh')).toBe(false)
  })

  it('әдепкі саясат: allow-draft', () => {
    expect(isVisibleInLocale({ ru: 'draft' }, 'ru')).toBe(true)
  })
})

describe('анықтамалықтар: әр белгі 4 тілде', () => {
  const groups = { sectors, regions, projectModels, projectLevels, projectStages }
  for (const [name, items] of Object.entries(groups)) {
    it(`${name}: kk, ru, en, zh белгілері бос емес және мәндер бірегей`, () => {
      const values = new Set<string>()
      for (const item of items) {
        for (const locale of locales) expect(item.label[locale].trim(), `${name}.${item.value}.${locale}`).not.toBe('')
        expect(values.has(item.value), `${name}: ${item.value} қайталанды`).toBe(false)
        values.add(item.value)
      }
    })
  }

  it('Қазақстанның 17 облысы және 3 республикалық маңызды қала бар', () => {
    expect(regions).toHaveLength(20)
  })

  it('жобаның 4 деңгейі және 8 кезеңі бар (ТТ 8.3, 8.4)', () => {
    expect(projectLevels).toHaveLength(4)
    expect(projectStages).toHaveLength(8)
  })
})
