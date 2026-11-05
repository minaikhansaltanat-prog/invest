import { describe, expect, it } from 'vitest'

import { collectEmpty, T } from '@content/seed/lib'
import { servicesSeed } from '@content/seed/data'
import { pagesA, servicesDetailSeed } from '@content/seed/pages/group-a'
import { pagesB } from '@content/seed/pages/group-b'
import { pagesC } from '@content/seed/pages/group-c'
import type { SeedBlock, SeedPage } from '@content/seed/pages/types'

// Ішкі беттердің seed контентін тексереді (ТТ 7, 11, 17.1): толықтық, тілдердің тазалығы, сілтемелер, міндетті беттер.

const required = {
  A: [
    '/about',
    '/about/mission',
    '/about/governance',
    '/about/ethics',
    '/services',
    '/legal/privacy',
    '/legal/terms',
    '/legal/consent',
    '/legal/cookies',
    '/legal/disclaimer',
  ],
  B: [
    '/investors',
    '/investors/china',
    '/investors/gulf',
    '/investors/global',
    '/investors/climate',
    '/investors/handbook',
    '/investors/apply',
    '/projects',
    '/projects/levels',
    '/projects/submit',
    '/membership',
    '/membership/benefits',
    '/membership/terms',
    '/membership/apply',
    '/membership/registry',
  ],
  C: [
    '/results',
    '/partners',
    '/media',
    '/media/news',
    '/media/events',
    '/media/video',
    '/media/photo',
    '/media/press',
    '/media/analytics',
    '/contacts',
    '/about/people',
    '/about/documents',
    '/about/reports',
  ],
} as const

const sections = ['about', 'services', 'investors', 'projects', 'membership', 'results', 'partners', 'media', 'contacts', 'legal']

const kazakhOnly = /[әғқңөұүһӘҒҚҢӨҰҮҺ]/
const han = /[一-鿿]/
const cyrillic = /[Ѐ-ӿ]/

function collect(value: unknown, trail = ''): Array<[string, T]> {
  if (value instanceof T) return [[trail, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => collect(item, `${trail}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => collect(child, `${trail}.${key}`))
  }
  return []
}

const hrefs = (blocks: SeedBlock[]): string[] =>
  blocks.flatMap((block) => {
    if (block.type === 'cards') return block.items.map((item) => item.href).filter((h): h is string => Boolean(h))
    if (block.type === 'links') return block.items.map((item) => item.href)
    return []
  })

const allPages: SeedPage[] = [...pagesA, ...pagesB, ...pagesC]
const knownPaths = new Set([...required.A, ...required.B, ...required.C, '/account', '/contacts', '/investors/apply'])
const knownPrefixes = ['/services/', '/projects/', '/media/news/', '/media/events/', '/about/people/']

function checkGroup(name: 'A' | 'B' | 'C', pages: SeedPage[]) {
  describe(`топ ${name}: ішкі беттер`, () => {
    it('барлық міндетті беттер бар', () => {
      const paths = pages.map((page) => page.path)
      const missing = required[name].filter((path) => !paths.includes(path))
      expect(missing).toEqual([])
    })

    it('жолдар бірегей, тілсіз және дұрыс форматта', () => {
      const seen = new Set<string>()
      for (const page of pages) {
        expect(page.path, page.path).toMatch(/^\/[a-z0-9\-/]*[a-z0-9]$/)
        expect(page.path.startsWith('/kk') || page.path.startsWith('/ru') || page.path.startsWith('/en') || page.path.startsWith('/zh')).toBe(false)
        expect(seen.has(page.path), `${page.path} қайталанды`).toBe(false)
        seen.add(page.path)
        expect(sections, page.path).toContain(page.section)
      }
    })

    it('әр бетте тақырып, сипаттама және кемінде 2 блок бар, төрт тіл де толтырылған', () => {
      expect(collectEmpty(pages)).toEqual([])
      for (const page of pages) {
        expect(page.blocks.length, `${page.path}: блоктар`).toBeGreaterThanOrEqual(2)
        expect(page.title.kk.length, page.path).toBeGreaterThan(2)
        expect(page.description.kk.length, `${page.path}: сипаттама`).toBeGreaterThan(20)
      }
    })

    it('тілдер араласпаған: zh иероглифті, ru мен en қазақ әріптерінсіз, en кириллицасыз', () => {
      const texts = pages.flatMap((page) => collect(page, page.path))
      expect(texts.filter(([, t]) => !han.test(t.zh)).map(([p]) => p)).toEqual([])
      expect(texts.filter(([, t]) => cyrillic.test(t.zh)).map(([p]) => p)).toEqual([])
      expect(texts.filter(([, t]) => kazakhOnly.test(t.ru)).map(([p]) => p)).toEqual([])
      expect(texts.filter(([, t]) => cyrillic.test(t.en) || han.test(t.en)).map(([p]) => p)).toEqual([])
      expect(texts.filter(([, t]) => !cyrillic.test(t.kk)).map(([p]) => p)).toEqual([])
    })

    it('ішкі сілтемелердің барлығы бар бетке немесе динамикалық бөлімге апарады', () => {
      const bad = pages.flatMap((page) =>
        [...hrefs(page.blocks), ...(page.cta ? [page.cta.href] : [])]
          .filter((href) => !knownPaths.has(href) && !knownPrefixes.some((prefix) => href.startsWith(prefix)))
          .map((href) => `${page.path} -> ${href}`),
      )
      expect(bad).toEqual([])
    })

    it('ұзын сызықша (U+2014) жоқ', () => {
      const text = collect(pages).map(([, t]) => `${t.kk}${t.ru}${t.en}${t.zh}`).join('')
      expect(text.includes('—')).toBe(false)
    })
  })
}

checkGroup('A', pagesA)
checkGroup('B', pagesB)
checkGroup('C', pagesC)

describe('қызмет беттерінің толық мазмұны (топ A)', () => {
  it('8 қызметтің барлығында мазмұн бар (slug-тар seed-пен сәйкес)', () => {
    expect(Object.keys(servicesDetailSeed).sort()).toEqual(servicesSeed.map((service) => service.slug).sort())
  })

  it('әр қызметте кемінде 4 блок, ескертпе (жауапкершілік шекарасы) және бос мәтін жоқ', () => {
    expect(collectEmpty(servicesDetailSeed)).toEqual([])
    for (const [slug, detail] of Object.entries(servicesDetailSeed)) {
      expect(detail.blocks.length, slug).toBeGreaterThanOrEqual(4)
      expect(detail.blocks.some((block) => block.type === 'notice'), `${slug}: жауапкершілік шекарасы`).toBe(true)
      expect(detail.blocks.some((block) => block.type === 'steps'), `${slug}: жұмыс кезеңдері`).toBe(true)
    }
  })

  it('қызмет мәтіндерінде тілдер араласпаған', () => {
    const texts = collect(servicesDetailSeed)
    expect(texts.filter(([, t]) => !han.test(t.zh)).map(([p]) => p)).toEqual([])
    expect(texts.filter(([, t]) => kazakhOnly.test(t.ru)).map(([p]) => p)).toEqual([])
    expect(texts.filter(([, t]) => cyrillic.test(t.en) || han.test(t.en)).map(([p]) => p)).toEqual([])
  })
})

describe('барлық бет', () => {
  it('барлық топтарда path бірегей', () => {
    const paths = allPages.map((page) => page.path)
    expect(new Set(paths).size).toBe(paths.length)
  })
})
