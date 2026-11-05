import { enTranslations } from '@payloadcms/translations/languages/en'
import { ruTranslations } from '@payloadcms/translations/languages/ru'
import { describe, expect, it } from 'vitest'

import { kk } from '@/i18n/admin-kk'

// Әкімші интерфейсінің қазақша аудармасы (Payload-та kk жоқ, негізі орысша): барлық кілт аударылғанын және
// интерполяция белгілері бұзылмағанын тексереді. Мәтіндер түнгі жоба: ана тілді тілші тексеруі қажет.
type Bundle = Record<string, Record<string, string>>
const ru = ruTranslations as unknown as Bundle
const en = enTranslations as unknown as Bundle
const kz = kk.translations as unknown as Bundle

// Екі тілде бірдей жазылатын сөздер: аударылмай қалуы қате емес
const sameInBoth = new Set(['authentication.account', 'general.export', 'general.import', 'general.layout'])

// Белгілер жиыны (қайталануы есепке алынбайды: тілге қарай {{label}} бір немесе екі рет келуі мүмкін)
const placeholders = (text: string) =>
  [...new Set((text.match(/\{\{\s*\w+\s*\}\}|<\/?\d+>|<a [^>]*>|<\/a>|<br\s*\/?>/g) ?? []).map((token) => token.replace(/\s+/g, '')))].sort()

// Белгілердің дереккөзі ағылшынша жинақ (орысшасында кейде түсіп қалады), ол жерде жоқ кілт (_many, _none) үшін орысша
const entries = Object.keys(ru).flatMap((group) =>
  Object.keys(ru[group]).map((key) => ({
    id: `${group}.${key}`,
    ru: ru[group][key],
    source: en[group]?.[key] ?? ru[group][key],
    kk: kz[group]?.[key],
  })),
)

describe('Әкімші интерфейсінің қазақша аудармасы', () => {
  it('түпнұсқадағы әр кілттің қазақша мәні бар', () => {
    const missing = entries.filter((entry) => typeof entry.kk !== 'string' || entry.kk.length === 0).map((entry) => entry.id)
    expect(missing).toEqual([])
  })

  it('интерполяция белгілері ({{...}}, <0>, <a>, <br>) түпнұсқадағыдай: жол бұзылмайды', () => {
    const broken = entries.filter((entry) => JSON.stringify(placeholders(entry.source)) !== JSON.stringify(placeholders(entry.kk))).map((entry) => entry.id)
    expect(broken).toEqual([])
  })

  it('орысша қалған кілттер тек екі тілде бірдей жазылатын сөздер', () => {
    const leftovers = entries
      .filter((entry) => entry.kk === entry.ru && /[а-яё]/i.test(entry.ru) && !sameInBoth.has(entry.id))
      .map((entry) => `${entry.id} = ${entry.ru.slice(0, 50)}`)
    expect(leftovers).toEqual([])
  })

  it('мәтіндерде em dash жоқ және артық бос орын жоқ', () => {
    const problems = entries.filter((entry) => entry.kk.includes('—') || entry.kk !== entry.kk.trim()).map((entry) => entry.id)
    expect(problems).toEqual([])
  })
})
