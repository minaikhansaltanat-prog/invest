import { ruTranslations } from '@payloadcms/translations/languages/ru'
import { describe, expect, it } from 'vitest'

import { kk as adminKk } from '@/i18n/admin-kk'
import { defaultLocale, isLocale, localeMeta, locales } from '@/i18n/config'
import { alternatesFor, localizedPath } from '@/lib/seo'
import { missingTranslationUrl, sectionPath } from '@/lib/translation-notice'

describe('тіл конфигурациясы (3.4)', () => {
  it('төрт тіл: kk, ru, en, zh; әдепкі kk', () => {
    expect([...locales]).toEqual(['kk', 'ru', 'en', 'zh'])
    expect(defaultLocale).toBe('kk')
  })

  it('isLocale тек қолдау көрсетілетін кодтарды қабылдайды', () => {
    expect(isLocale('zh')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })

  it('zh үшін html lang мен hreflang: zh-CN', () => {
    expect(localeMeta.zh.htmlLang).toBe('zh-CN')
    expect(localeMeta.zh.hreflang).toBe('zh-CN')
  })
})

describe('canonical және hreflang (alternatesFor)', () => {
  it('localizedPath тіл префиксін қосады, түбірде артық / жоқ', () => {
    expect(localizedPath('kk', '/')).toBe('/kk')
    expect(localizedPath('zh', '/news/forum')).toBe('/zh/news/forum')
  })

  it('canonical өз тіліне, languages төрт тілді және x-default (kk) қамтиды', () => {
    const alt = alternatesFor('ru', '/investors')
    expect(alt.canonical).toMatch(/\/ru\/investors$/)
    const languages = alt.languages as Record<string, string>
    expect(Object.keys(languages).sort()).toEqual(['en', 'kk', 'ru', 'x-default', 'zh-CN'])
    expect(languages.kk).toMatch(/\/kk\/investors$/)
    expect(languages['zh-CN']).toMatch(/\/zh\/investors$/)
    expect(languages['x-default']).toBe(languages.kk)
  })

  it('түбір бет үшін де жол дұрыс', () => {
    const languages = alternatesFor('en', '/').languages as Record<string, string>
    expect(languages.en).toMatch(/\/en$/)
  })
})

describe('аудармасы жоқ бетті бағыттау', () => {
  it('sectionPath соңғы сегментті (slug) алып тастайды', () => {
    expect(sectionPath('/news/forum-2026')).toBe('/news')
    expect(sectionPath('/investors/projects/abc')).toBe('/investors/projects')
    expect(sectionPath('/news')).toBe('/')
    expect(sectionPath('/')).toBe('/')
  })

  it('missingTranslationUrl тіл префиксін және notice параметрін қосады', () => {
    expect(missingTranslationUrl('en', '/news/forum-2026')).toBe('/en/news?notice=no-translation')
    expect(missingTranslationUrl('zh', '/news')).toBe('/zh?notice=no-translation')
  })
})

describe('әкімшілік интерфейсінің қазақша аудармасы', () => {
  const groups = Object.keys(ruTranslations) as Array<keyof typeof ruTranslations>

  it('орыс аудармасының барлық топтары мен кілттері бар (жетпейтін кілт жоқ)', () => {
    for (const group of groups) {
      const ru = ruTranslations[group] as Record<string, string>
      const kk = adminKk.translations[group] as Record<string, string>
      expect(Object.keys(kk).sort(), group).toEqual(Object.keys(ru).sort())
    }
  })

  it('нақты қазақша жолдар бар және әдепкі кілт емес', () => {
    expect(adminKk.translations.general.thisLanguage).toBe('Қазақша')
    expect(adminKk.translations.authentication.login).toBe('Кіру')
    expect(adminKk.translations.general.save).toBe('Сақтау')
  })

  it('қазақша жолдарда em dash (U+2014) жоқ', () => {
    const text = JSON.stringify(adminKk.translations)
    expect(text.includes('—')).toBe(false)
  })
})
