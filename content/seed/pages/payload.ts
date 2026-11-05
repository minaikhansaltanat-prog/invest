import { pick, type SeedLocale, type T } from '../lib'
import type { SeedBlock, SeedCta } from './types'

// Сид блоктарын Payload `blocks` өрісінің пішініне келтіреді (бір тіл үшін).
// Әр қатар (блок, элемент, баған, ұяшық) тұрақты id алады: тілдер бір қатарға жазылады, қайта егу қатарларды көбейтпейді.

type Row = Record<string, unknown>

const text = (value: T | undefined, locale: SeedLocale) => (value ? pick(value, locale) : undefined)

export function toPayloadBlocks(blocks: SeedBlock[], locale: SeedLocale, prefix: string): Row[] {
  return blocks.map((block, index) => {
    const id = `${prefix}-b${index}`
    const base = { id, blockType: block.type }
    switch (block.type) {
      case 'paragraphs':
        return {
          ...base,
          heading: text(block.heading, locale),
          lead: text(block.lead, locale),
          text: pick(block.text, locale),
        }
      case 'cards':
        return {
          ...base,
          heading: text(block.heading, locale),
          lead: text(block.lead, locale),
          columns: String(block.columns ?? 3),
          items: block.items.map((item, i) => ({
            id: `${id}-i${i}`,
            title: pick(item.title, locale),
            text: pick(item.text, locale),
            icon: item.icon,
            href: item.href,
            badge: text(item.badge, locale),
          })),
        }
      case 'steps':
        return {
          ...base,
          heading: text(block.heading, locale),
          lead: text(block.lead, locale),
          items: block.items.map((item, i) => ({
            id: `${id}-i${i}`,
            title: pick(item.title, locale),
            text: pick(item.text, locale),
            meta: text(item.meta, locale),
          })),
        }
      case 'facts':
        return {
          ...base,
          heading: text(block.heading, locale),
          items: block.items.map((item, i) => ({
            id: `${id}-i${i}`,
            label: pick(item.label, locale),
            value: pick(item.value, locale),
          })),
        }
      case 'faq':
        return {
          ...base,
          heading: text(block.heading, locale),
          items: block.items.map((item, i) => ({
            id: `${id}-i${i}`,
            q: pick(item.q, locale),
            a: pick(item.a, locale),
          })),
        }
      case 'table':
        return {
          ...base,
          heading: text(block.heading, locale),
          caption: pick(block.caption, locale),
          columns: block.columns.map((column, c) => ({ id: `${id}-c${c}`, text: pick(column, locale) })),
          rows: block.rows.map((cells, r) => ({
            id: `${id}-r${r}`,
            cells: cells.map((cell, c) => ({ id: `${id}-r${r}-c${c}`, text: pick(cell, locale) })),
          })),
        }
      case 'notice':
        return { ...base, tone: block.tone, title: text(block.title, locale), text: pick(block.text, locale) }
      case 'links':
        return {
          ...base,
          heading: text(block.heading, locale),
          items: block.items.map((item, i) => ({
            id: `${id}-i${i}`,
            label: pick(item.label, locale),
            href: item.href,
            text: text(item.text, locale),
          })),
        }
    }
  })
}

export function toPayloadCta(cta: SeedCta | undefined, locale: SeedLocale): Row | undefined {
  if (!cta) return undefined
  return { title: pick(cta.title, locale), text: pick(cta.text, locale), label: pick(cta.label, locale), href: cta.href }
}

/** '/about/mission' → 'about-mission' (қатар id-лерінің префиксі) */
export const pagePrefix = (path: string) => `p${path.replace(/\//g, '-')}`
