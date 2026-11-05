import { describe, expect, it } from 'vitest'

import { locales } from '@/i18n/config'
import { noticeTones, pageBlocks, pageIcons } from '@/blocks/pageBlocks'
import { pageSections } from '@/collections/Pages'
import { serviceIconNames, uiIconNames } from '@/components/ui/icons'
import { allPagesSeed, servicesDetailSeed } from '@content/seed/pages'
import { pagePrefix, toPayloadBlocks, toPayloadCta } from '@content/seed/pages/payload'
import type { SeedBlock } from '@content/seed/pages/types'

// 4-кезең: Payload блок схемасы мен сидтің сәйкестігі, қатар id-лерінің тұрақтылығы, иконкалар.

const seedTypes: SeedBlock['type'][] = ['paragraphs', 'cards', 'steps', 'facts', 'faq', 'table', 'notice', 'links']

describe('блок схемасы', () => {
  it('Payload блоктары сид түрлерімен бірдей (8 түр)', () => {
    expect(pageBlocks().map((block) => block.slug).sort()).toEqual([...seedTypes].sort())
  })

  it('иконкалар рендерлеуге қолжетімді (ui не service жиынында)', () => {
    const known = new Set<string>([...uiIconNames, ...serviceIconNames])
    for (const icon of pageIcons) expect(known.has(icon), icon).toBe(true)
  })

  it('сидтегі иконкалар, ескертпе түрлері және бөлімдер схемада бар', () => {
    const icons = new Set<string>(pageIcons)
    const tones = new Set<string>(noticeTones)
    const sections = new Set<string>(pageSections)
    const blocks = [...allPagesSeed.flatMap((page) => page.blocks), ...Object.values(servicesDetailSeed).flatMap((d) => d.blocks)]
    for (const page of allPagesSeed) expect(sections.has(page.section), page.path).toBe(true)
    for (const block of blocks) {
      if (block.type === 'cards') for (const item of block.items) if (item.icon) expect(icons.has(item.icon), item.icon).toBe(true)
      if (block.type === 'notice') expect(tones.has(block.tone)).toBe(true)
    }
  })
})

describe('toPayloadBlocks', () => {
  const pages = [
    ...allPagesSeed.map((page) => ({ key: page.path, blocks: page.blocks, prefix: pagePrefix(page.path) })),
    ...Object.entries(servicesDetailSeed).map(([slug, detail]) => ({ key: slug, blocks: detail.blocks, prefix: `s-${slug}` })),
  ]

  const collectIds = (value: unknown, out: string[] = []): string[] => {
    if (Array.isArray(value)) value.forEach((item) => collectIds(item, out))
    else if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>
      if (typeof record.id === 'string') out.push(record.id)
      Object.values(record).forEach((child) => collectIds(child, out))
    }
    return out
  }

  it('қатар id-лері бір беттің ішінде бірегей', () => {
    for (const page of pages) {
      const ids = collectIds(toPayloadBlocks(page.blocks, 'kk', page.prefix))
      expect(new Set(ids).size, page.key).toBe(ids.length)
    }
  })

  it('id-лер барлық тілде бірдей: тілдер бір қатарға жазылады', () => {
    for (const page of pages) {
      const reference = collectIds(toPayloadBlocks(page.blocks, 'kk', page.prefix))
      for (const locale of locales) {
        expect(collectIds(toPayloadBlocks(page.blocks, locale, page.prefix)), `${page.key} ${locale}`).toEqual(reference)
      }
    }
  })

  it('кестеде әр жолдағы ұяшық саны баған санына тең', () => {
    for (const page of pages) {
      for (const block of toPayloadBlocks(page.blocks, 'en', page.prefix)) {
        if (block.blockType !== 'table') continue
        const columns = (block.columns as unknown[]).length
        for (const row of block.rows as { cells: unknown[] }[]) expect(row.cells.length, page.key).toBe(columns)
      }
    }
  })

  it('міндетті мәтіндер төрт тілде де бос емес', () => {
    for (const page of allPagesSeed) {
      for (const locale of locales) {
        expect(page.title[locale].trim(), `${page.path} title ${locale}`).not.toBe('')
        for (const block of toPayloadBlocks(page.blocks, locale, pagePrefix(page.path))) {
          if (block.blockType === 'paragraphs' || block.blockType === 'notice') {
            expect(String(block.text).trim(), `${page.path} ${block.id} ${locale}`).not.toBe('')
          }
        }
      }
    }
  })

  it('CTA пішімі: 4 өріс, href тіл префиксісіз жол', () => {
    for (const page of allPagesSeed) {
      const cta = toPayloadCta(page.cta, 'ru')
      if (!cta) continue
      expect(Object.keys(cta).sort()).toEqual(['href', 'label', 'text', 'title'])
      expect(String(cta.href).startsWith('/')).toBe(true)
    }
  })
})
