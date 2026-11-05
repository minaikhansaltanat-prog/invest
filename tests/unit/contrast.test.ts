import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { type TokenName, tokenContrast, tokens } from '@/lib/contrast'

const css = fs.readFileSync(path.join(process.cwd(), 'src/app/(site)/[locale]/globals.css'), 'utf8')

describe('дизайн токендері (ТТ 12.1)', () => {
  it('contrast.ts және globals.css ішіндегі түстер бірдей', () => {
    for (const [name, hex] of Object.entries(tokens)) {
      const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))
      expect(match, `--color-${name} globals.css ішінде жоқ`).not.toBeNull()
      expect(match![1].toUpperCase(), name).toBe(hex.toUpperCase())
    }
  })

  it('Tailwind әдепкі палитрасы өшірілген', () => {
    expect(css).toContain('--color-*: initial')
  })
})

describe('WCAG 2.2 AA контрасты (ТТ 12.6)', () => {
  // [мәтін түсі, фон түсі, ең аз қатынас]
  const pairs: Array<[TokenName, TokenName, number]> = [
    ['ink', 'ivory', 4.5],
    ['ink', 'paper', 4.5],
    ['ink', 'sand', 4.5],
    ['muted', 'ivory', 4.5],
    ['muted', 'paper', 4.5],
    ['muted', 'sand', 4.5],
    ['navy-900', 'paper', 4.5],
    ['navy-700', 'paper', 4.5],
    ['navy-700', 'ivory', 4.5],
    ['paper', 'navy-900', 4.5],
    ['paper', 'navy-950', 4.5],
    ['gold-300', 'navy-900', 4.5],
    ['gold-300', 'navy-950', 4.5],
    ['gold-400', 'navy-950', 4.5],
    // ашық фондағы кіші алтын мәтін (eyebrow, белгі): gold-700 міндетті
    ['gold-700', 'ivory', 4.5],
    ['gold-700', 'paper', 4.5],
    ['gold-700', 'sand', 4.5],
    // алтын түйме: нави мәтін
    ['navy-950', 'gold-400', 4.5],
    ['navy-950', 'gold-500', 4.5],
    // мәртебе белгілері
    ['success', 'success-bg', 4.5],
    ['navy-700', 'info-bg', 4.5],
    ['danger', 'paper', 4.5],
    ['danger', 'danger-bg', 4.5],
    ['warn-ink', 'warn-bg', 4.5],
    // үлкен мәтін (24 px+) үшін 3:1 жеткілікті
    ['gold-600', 'ivory', 3],
    ['gold-600', 'paper', 3],
  ]

  for (const [fg, bg, min] of pairs) {
    it(`${fg} / ${bg} кемінде ${min}:1`, () => {
      expect(tokenContrast(fg, bg)).toBeGreaterThanOrEqual(min)
    })
  }

  it('gold-600 кіші мәтінге жарамсыз екені құжатталған (4.5:1-ден аз)', () => {
    expect(tokenContrast('gold-600', 'ivory')).toBeLessThan(4.5)
  })
})
