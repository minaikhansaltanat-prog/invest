import { describe, expect, it } from 'vitest'

import { locales } from '@/i18n/config'
import { dataSchema, fieldErrors, fieldsOf, formKinds, formSpecs, submissionSchema } from '@/lib/forms/definitions'

// 6-кезең: форма сипаттамасы мен Zod схемалары (ТТ 8.1, 9, 14.2).

const valid = {
  contact: { contactName: 'Асхат Нұрлан', email: 'a@example.com', phone: '', topic: 'investor', message: 'Қызмет туралы сұрағым бар.' },
  investor: {
    companyName: 'Example Capital Ltd',
    country: 'Singapore',
    registrationNumber: '201912345K',
    website: 'https://example.com',
    beneficiary: 'John Smith',
    representativeName: 'Jane Doe',
    sectors: ['energy'],
    regions: [],
    amountMinMusd: '10',
    amountMaxMusd: '50',
    models: [],
    decisionTimeline: 'm3-6',
    experience: 'Ten years of renewable energy investments in Asia.',
    financialNote: '',
    contactName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+65 1234 5678',
    contactLanguage: 'en',
  },
  project: {
    organizationName: 'Тест ЖШС',
    bin: '170140015381',
    ownerName: 'Иванов И.И.',
    projectTitle: 'Күн электр станциясы',
    sector: 'energy',
    region: 'astana',
    location: 'Астана',
    amountMusd: '38',
    model: 'ppp',
    landStatus: 'leased',
    purpose: 'Жергілікті жаңартылатын энергия өндіру.',
    summary: 'Жоба 50 МВт қуатты күн электр станциясын салуды көздейді.',
    contactName: 'Иванов И.И.',
    email: 'ivanov@example.kz',
    phone: '',
    contactLanguage: 'kk',
  },
  membership: {
    organizationName: 'Тест ЖШС',
    bin: '170140015381',
    country: 'Қазақстан',
    website: '',
    category: 'industrial',
    contactName: 'Иванов И.И.',
    position: '',
    email: 'ivanov@example.kz',
    phone: '',
    contactLanguage: 'ru',
    registryConsent: true,
  },
} as const

describe('форма сипаттамалары', () => {
  it('төрт форма бар, өріс аттары бірегей', () => {
    expect([...formKinds].sort()).toEqual(['contact', 'investor', 'membership', 'project'])
    for (const kind of formKinds) {
      const names = fieldsOf(formSpecs[kind]).map((field) => field.name)
      expect(new Set(names).size, kind).toBe(names.length)
    }
  })

  it('барлық жапсырма мен нұсқа 4 тілде толық, em dash жоқ', () => {
    const texts: { where: string; value: string }[] = []
    for (const kind of formKinds) {
      const spec = formSpecs[kind]
      for (const locale of locales) texts.push({ where: `${kind}.title.${locale}`, value: spec.title[locale] })
      for (const step of spec.steps) {
        for (const locale of locales) texts.push({ where: `${kind}.${step.id}.${locale}`, value: step.title[locale] })
        for (const field of step.fields) {
          for (const locale of locales) {
            texts.push({ where: `${kind}.${field.name}.label.${locale}`, value: field.label[locale] })
            if (field.hint) texts.push({ where: `${kind}.${field.name}.hint.${locale}`, value: field.hint[locale] })
            for (const option of field.options ?? []) texts.push({ where: `${kind}.${field.name}.${option.value}.${locale}`, value: option.label[locale] })
          }
        }
      }
    }
    for (const text of texts) {
      expect(text.value.trim(), text.where).not.toBe('')
      expect(text.value.includes('—'), text.where).toBe(false)
    }
  })

  it('select және multiselect өрістерінде нұсқалар бар', () => {
    for (const kind of formKinds) {
      for (const field of fieldsOf(formSpecs[kind])) {
        if (field.type === 'select' || field.type === 'multiselect') expect(field.options?.length, `${kind}.${field.name}`).toBeGreaterThan(1)
      }
    }
  })

  it('инвестор формасы ТТ 8.1 міндетті өрістерін қамтиды', () => {
    const required = fieldsOf(formSpecs.investor).filter((field) => field.required).map((field) => field.name)
    for (const name of ['companyName', 'country', 'registrationNumber', 'beneficiary', 'representativeName', 'sectors', 'decisionTimeline', 'email']) {
      expect(required, name).toContain(name)
    }
  })
})

describe('Zod тексеру', () => {
  for (const kind of formKinds) {
    it(`${kind}: дұрыс дерек өтеді`, () => {
      const result = dataSchema(formSpecs[kind]).safeParse(valid[kind])
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
    })
  }

  it('міндетті өрістің бос мәні required қатесін береді', () => {
    const result = dataSchema(formSpecs.investor).safeParse({ ...valid.investor, companyName: '   ', sectors: [] })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error)).toMatchObject({ companyName: 'required', sectors: 'required' })
  })

  it('пошта, сілтеме, сан және ең аз ұзындық кодтары', () => {
    const result = dataSchema(formSpecs.investor).safeParse({
      ...valid.investor,
      email: 'not-an-email',
      website: 'ftp://x',
      amountMinMusd: 'abc',
      experience: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(fieldErrors(result.error)).toMatchObject({ email: 'email', website: 'url', amountMinMusd: 'number', experience: 'tooShort' })
    }
  })

  it('көлем «бастап» «дейіннен» үлкен болса, range қатесі', () => {
    const result = dataSchema(formSpecs.investor).safeParse({ ...valid.investor, amountMinMusd: '100', amountMaxMusd: '10' })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).amountMaxMusd).toBe('range')
  })

  it('тізімде жоқ мән қабылданбайды', () => {
    const result = dataSchema(formSpecs.project).safeParse({ ...valid.project, sector: 'hacking', region: '' })
    expect(result.success).toBe(false)
    if (!result.success) expect(Object.keys(fieldErrors(result.error))).toEqual(expect.arrayContaining(['sector', 'region']))
  })

  it('тым ұзын мәтін tooLong қатесін береді', () => {
    const result = dataSchema(formSpecs.contact).safeParse({ ...valid.contact, message: 'a'.repeat(3001) })
    expect(result.success).toBe(false)
    if (!result.success) expect(fieldErrors(result.error).message).toBe('tooLong')
  })
})

describe('submissionSchema: келісім, ALTCHA, honeypot, тіл', () => {
  const base = { data: valid.contact, consent: true, altcha: 'payload', locale: 'kk' }

  it('толық сұрау өтеді', () => {
    expect(submissionSchema(formSpecs.contact).safeParse(base).success).toBe(true)
  })

  it('келісімсіз (false не жоқ) қабылданбайды: чекбокс алдын ала қойылмайды', () => {
    expect(submissionSchema(formSpecs.contact).safeParse({ ...base, consent: false }).success).toBe(false)
    const { consent: _omit, ...withoutConsent } = base
    expect(submissionSchema(formSpecs.contact).safeParse(withoutConsent).success).toBe(false)
  })

  it('ALTCHA-сыз, honeypot толтырылған және белгісіз тіл қабылданбайды', () => {
    const schema = submissionSchema(formSpecs.contact)
    expect(schema.safeParse({ ...base, altcha: '' }).success).toBe(false)
    expect(schema.safeParse({ ...base, hp: 'spam' }).success).toBe(false)
    expect(schema.safeParse({ ...base, locale: 'de' }).success).toBe(false)
  })
})
