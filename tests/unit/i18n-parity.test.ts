import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { defaultLocale, locales } from '@/i18n/config'

const root = process.cwd()
const messagesDir = path.join(root, 'messages')

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

const load = (locale: string): Json =>
  JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf8')) as Json

/** Кілттерді `a.b.c` түрінде жазып шығады, массив элементтері a.b.0 болады */
function flatten(value: Json, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      Object.assign(out, flatten(child, prefix ? `${prefix}.${key}` : key))
    }
  } else {
    out[prefix] = String(value)
  }
  return out
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort()

describe('interface messages: kk, ru, en, zh', () => {
  const base = flatten(load(defaultLocale))

  it('төрт тілдің файлы бар', () => {
    for (const locale of locales) {
      expect(fs.existsSync(path.join(messagesDir, `${locale}.json`)), `${locale}.json`).toBe(true)
    }
  })

  for (const locale of locales.filter((code) => code !== defaultLocale)) {
    it(`${locale}: кілттер ${defaultLocale} файлымен бірдей`, () => {
      const other = flatten(load(locale))
      const missing = Object.keys(base).filter((key) => !(key in other))
      const extra = Object.keys(other).filter((key) => !(key in base))
      expect({ missing, extra }).toEqual({ missing: [], extra: [] })
    })

    it(`${locale}: бос мән жоқ және ICU placeholder-лер сәйкес`, () => {
      const other = flatten(load(locale))
      const empty = Object.entries(other)
        .filter(([, text]) => text.trim() === '')
        .map(([key]) => key)
      expect(empty).toEqual([])
      const mismatched = Object.keys(base).filter(
        (key) => key in other && placeholders(base[key]).join() !== placeholders(other[key]).join(),
      )
      expect(mismatched).toEqual([])
    })
  }

  it('қытайша файлда қытай иероглифтері бар', () => {
    const zh = Object.values(flatten(load('zh'))).join('')
    expect(/[一-鿿]/.test(zh)).toBe(true)
  })
})
