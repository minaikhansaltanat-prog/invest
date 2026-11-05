import { describe, expect, it } from 'vitest'

import { allPagesSeed } from '@content/seed/pages'
import { locales } from '@/i18n/config'
import { parseInline, parseRich } from '@/lib/rich'

describe('parseInline', () => {
  it('**қалың** бөліктерін ажыратады', () => {
    expect(parseInline('a **b** c')).toEqual([
      { text: 'a ', bold: false },
      { text: 'b', bold: true },
      { text: ' c', bold: false },
    ])
  })

  it('белгі жоқ мәтін бір бөлік', () => {
    expect(parseInline('жай мәтін')).toEqual([{ text: 'жай мәтін', bold: false }])
  })
})

describe('parseRich', () => {
  it('бос жол абзацтарды бөледі, ішкі жол үзілімі бір абзацқа біріктіріледі', () => {
    const nodes = parseRich('Бірінші\nжолы.\n\nЕкінші абзац.')
    expect(nodes).toHaveLength(2)
    expect(nodes[0]).toEqual({ type: 'p', inline: [{ text: 'Бірінші жолы.', bold: false }] })
  })

  it('«- » жолдары тізім болады', () => {
    const nodes = parseRich('Кіріспе:\n- бірінші\n- екінші **маңызды**\n\nСоңы.')
    expect(nodes.map((node) => node.type)).toEqual(['p', 'ul', 'p'])
    const list = nodes[1]
    expect(list.type === 'ul' && list.items).toHaveLength(2)
  })

  it('бос мәтін түйін бермейді', () => {
    expect(parseRich('')).toEqual([])
    expect(parseRich('  \n\n  ')).toEqual([])
  })

  it('сидтегі барлық абзацтар HTML тегінсіз және бос түйінсіз өңделеді', () => {
    for (const page of allPagesSeed) {
      for (const block of page.blocks) {
        if (block.type !== 'paragraphs') continue
        for (const locale of locales) {
          const source = block.text[locale]
          expect(source.includes('<'), `${page.path} ${locale}`).toBe(false)
          expect(parseRich(source).length, `${page.path} ${locale}`).toBeGreaterThan(0)
        }
      }
    }
  })
})
