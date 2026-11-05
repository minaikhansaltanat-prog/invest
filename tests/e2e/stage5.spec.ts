import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

import { newsSeed, projectsSeed, servicesSeed } from '../../content/seed/data'
import { allPagesSeed } from '../../content/seed/pages'
import { navSections } from '../../src/lib/nav'
import { settle, shot } from './helpers/shot'

// 5-кезең: ішкі беттер. Барлық бет ашылады, мобильдіде көлденең айналдыру жоқ, қолжетімділік, аудармасы жоқ бетті бағыттау.

const baseURL = `http://localhost:${process.env.PORT ?? 3000}`

const staticPaths = allPagesSeed.map((page) => page.path)
const detailPaths = [
  ...servicesSeed.map((service) => `/services/${service.slug}`),
  ...projectsSeed.map((project) => `/projects/${project.slug}`),
  ...newsSeed.map((item) => `/media/news/${item.slug}`),
]
const allPaths = [...staticPaths, ...detailPaths]

// Көлденең айналдыру матрицасы: әдепкіде 16 өкілдік бет, толық матрица: FULL_MATRIX=1 npm run test:e2e
const quickPaths = [
  '/about/mission',
  '/about/governance',
  '/about/people',
  '/services',
  '/services/investor-vetting',
  '/investors',
  '/investors/handbook',
  '/projects',
  '/projects/levels',
  '/membership',
  '/membership/terms',
  '/media/news',
  '/contacts',
  '/legal/privacy',
  `/projects/${projectsSeed[0].slug}`,
  `/media/news/${newsSeed[0].slug}`,
]
const matrixPaths = process.env.FULL_MATRIX ? allPaths : quickPaths

async function overflowOf(page: Page) {
  return page.evaluate(() => {
    const over = document.documentElement.scrollWidth - window.innerWidth
    if (over <= 0) return { over, offenders: [] as string[] }
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && getComputedStyle(el).position !== 'fixed')
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`)
    return { over, offenders }
  })
}

test.describe('барлық ішкі бет', () => {
  test(`kk: ${allPaths.length} бет 200 қайтарады, h1 бір, ⟦кілт⟧ жоқ, консоль қатесіз, сыртқы доменсіз`, async ({ page }) => {
    test.setTimeout(420_000)
    const errors: string[] = []
    const external: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
    page.on('request', (request) => {
      const host = new URL(request.url()).hostname
      if (!['localhost', '127.0.0.1'].includes(host) && !request.url().startsWith('data:')) external.push(request.url())
    })
    for (const path of allPaths) {
      const response = await page.goto(`/kk${path}`, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), path).toBe(200)
      await expect(page.locator('h1'), path).toHaveCount(1)
      expect(await page.locator('body').innerText(), path).not.toContain('⟦')
    }
    expect(external).toEqual([])
    expect(errors).toEqual([])
  })

  test('404: бар емес бет қазақша 404 көрсетеді', async ({ page }) => {
    const response = await page.goto('/kk/bar-emes-bet')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Бет табылмады' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Басты бетке оралу' })).toBeVisible()
  })
})

test.describe('көлденең айналдыру жоқ', () => {
  const combos: [string, number][] = [
    ['kk', 360],
    ['kk', 1440],
    ['ru', 390],
    ['zh', 390],
    ['en', 768],
    ['ru', 1080],
  ]
  for (const [locale, width] of combos) {
    test(`${locale} ${width}px: ${matrixPaths.length} бет`, async ({ browser }) => {
      test.setTimeout(480_000)
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      const failures: string[] = []
      try {
        const chunk = 4
        for (let i = 0; i < matrixPaths.length; i += chunk) {
          await Promise.all(
            matrixPaths.slice(i, i + chunk).map(async (path) => {
              const page = await context.newPage()
              try {
                await page.goto(`${baseURL}/${locale}${path}`, { waitUntil: 'domcontentloaded' })
                await page.waitForLoadState('load')
                await page.waitForTimeout(300)
                const { over, offenders } = await overflowOf(page)
                if (over > 0) failures.push(`${path}: +${over}px (${offenders.join(', ')})`)
              } finally {
                await page.close()
              }
            }),
          )
        }
      } finally {
        await context.close()
      }
      expect(failures).toEqual([])
    })
  }
})

test.describe('қолжетімділік', () => {
  const samples: [string, string][] = [
    ['kk', '/about/mission'],
    ['kk', '/legal/privacy'],
    ['ru', '/services/investor-vetting'],
    ['ru', '/projects'],
    ['en', '/membership/terms'],
    ['zh', '/investors/handbook'],
    ['kk', '/media/news'],
    ['kk', '/about/people'],
  ]
  test('axe: WCAG 2.2 AA таңдамалы беттерде', async ({ page }) => {
    test.setTimeout(300_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const [locale, path] of samples) {
      await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' })
      await settle(page)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      const summary = results.violations.map(
        (v) => `${locale}${path} ${v.id} (${v.impact}): ${v.nodes.length} орын, мысалы ${v.nodes[0]?.target.join(' ')}`,
      )
      expect(summary).toEqual([])
    }
  })

  test('мобильді: p мәтіні 16 px-тен кем емес, басылатын элемент 44x44', async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const [locale, path] of [
      ['kk', '/about/mission'],
      ['ru', '/services'],
      ['en', '/projects'],
      ['zh', '/contacts'],
      ['kk', '/media/news'],
    ] as const) {
      await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' })
      await settle(page)
      const report = await page.evaluate(() => {
        const small: string[] = []
        document.querySelectorAll('main p').forEach((p) => {
          if (p.getClientRects().length === 0) return // жасырын (display:none) элемент есептелмейді
          const size = parseFloat(getComputedStyle(p).fontSize)
          if (size < 15.99 && p.textContent?.trim()) small.push(`${size}px: ${p.textContent.trim().slice(0, 40)}`)
        })
        const tiny: string[] = []
        document.querySelectorAll<HTMLElement>('a, button').forEach((el) => {
          if (el.closest('.skip-link') || el.classList.contains('skip-link')) return
          const rect = el.getBoundingClientRect()
          const style = getComputedStyle(el)
          if (rect.width === 0 || rect.height === 0 || style.visibility === 'hidden' || el.closest('[hidden]')) return
          if (rect.width < 43.5 || rect.height < 43.5) {
            tiny.push(`${Math.round(rect.width)}x${Math.round(rect.height)} ${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}"`)
          }
        })
        return { small, tiny }
      })
      expect(report.small, `${locale}${path} p < 16px`).toEqual([])
      expect(report.tiny, `${locale}${path} басылатын элемент < 44x44`).toEqual([])
    }
  })
})

test.describe('мазмұн және навигация', () => {
  test('барлық мәзір сілтемесі жұмыс істейді (kk): 404 жоқ', async ({ page }) => {
    test.setTimeout(240_000)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/kk', { waitUntil: 'domcontentloaded' })
    const fromPage = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll<HTMLAnchorElement>('header a[href^="/kk"], footer a[href^="/kk"]')].map((a) => a.getAttribute('href')!.split('#')[0]))],
    )
    const fromConfig = navSections.flatMap((section) => [section.href, ...(section.children ?? []).map((child) => child.href)]).map((href) => `/kk${href}`)
    // /account (жеке кабинет) 6-кезеңде қосылады: сол кезде бұл сүзгі алынады
    const hrefs = [...new Set([...fromPage, ...fromConfig])].filter((href) => !href.startsWith('/kk/account'))
    expect(hrefs.length).toBeGreaterThan(30)
    for (const href of hrefs) {
      const response = await page.request.get(href)
      expect(response.status(), href).toBe(200)
    }
  })

  test('қызмет беті: блоктар, мазмұн тізімі (TOC) және CTA', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/kk/services/investor-vetting', { waitUntil: 'networkidle' })
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('main section').first()).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Осы бетте' })).toBeVisible()
    // якорь сілтемесі мақсатты бөлімге апарады
    const first = page.getByRole('navigation', { name: 'Осы бетте' }).getByRole('link').first()
    const href = await first.getAttribute('href')
    expect(href).toMatch(/^#section-/)
    expect(await page.locator(href!).count()).toBe(1)
  })

  test('аккордеон (FAQ) пернетақтамен ашылады', async ({ page }) => {
    await page.goto('/ru/investors/handbook', { waitUntil: 'networkidle' })
    const button = page.locator('main button[aria-expanded]').first()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  test('жобалар каталогы: сала сүзгісі және жоба беті NDA ескертуімен', async ({ page }) => {
    await page.goto('/en/projects', { waitUntil: 'networkidle' })
    const cards = page.getByTestId('project-card')
    const total = await cards.count()
    expect(total).toBeGreaterThanOrEqual(3)
    await page.getByRole('link', { name: 'Energy' }).click()
    await expect(page).toHaveURL(/sector=energy/)
    await expect(page.getByTestId('project-card')).not.toHaveCount(total)
    await page.getByTestId('project-card').first().getByRole('link').click()
    await expect(page).toHaveURL(/\/en\/projects\/[a-z0-9-]+$/)
    await expect(page.getByText('The full passport opens after an NDA')).toBeVisible()
  })
})

test.describe('скриншоттар', () => {
  test('негізгі беттер, 4 тіл, 1440 және 390', async ({ page }) => {
    test.setTimeout(480_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const targets: [string, string, string][] = [
      ['kk', '/about/mission', 'about-mission'],
      ['kk', '/services', 'services'],
      ['ru', '/services/investor-vetting', 'service-detail'],
      ['en', '/projects', 'projects'],
      ['en', '/projects/solar-power-plant-turkistan', 'project-detail'],
      ['zh', '/legal/privacy', 'legal-privacy'],
      ['kk', '/media/news', 'media-news'],
      ['kk', '/about/people', 'about-people'],
      ['ru', '/contacts', 'contacts'],
      ['kk', '/investors/handbook', 'handbook'],
      ['kk', '/bar-emes-bet', 'not-found'],
    ]
    for (const [locale, path, name] of targets) {
      await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' })
      await shot(page, `stage-5-${name}-${locale}`, [1440, 390])
    }
  })
})

test.describe.serial('аудармасы жоқ бет (әкімші API)', () => {
  const path = '/e2e-no-translation'
  let token = ''
  let adminId: string | number = ''
  let pageId: string | number = ''
  let skip = ''
  const auth = () => ({ Authorization: `JWT ${token}` })

  test.beforeAll(async ({ request }) => {
    const password = `Tmp-${Math.random().toString(36).slice(2)}-${Date.now()}Aa1!`
    const response = await request.post('/api/admins/first-register', {
      data: { email: `e2e5-${Date.now()}@example.test`, password, name: 'E2E Stage 5', roles: ['content-manager'] },
    })
    if (!response.ok()) {
      skip = `Әкімші бар немесе first-register жабық (${response.status()}): тест өткізілмеді`
      return
    }
    const body = (await response.json()) as { token: string; user: { id: string | number } }
    token = body.token
    adminId = body.user.id
    const created = await request.post('/api/pages?locale=kk', {
      headers: auth(),
      data: {
        path,
        section: 'about',
        title: 'E2E аударма тесті',
        _status: 'published',
        translationStatus: { kk: 'approved', ru: 'none', en: 'none', zh: 'none' },
      },
    })
    if (created.ok()) pageId = ((await created.json()) as { doc: { id: string | number } }).doc.id
  })

  test.afterAll(async ({ request }) => {
    if (!token) return
    if (pageId !== '') await request.delete(`/api/pages/${pageId}?force=true`, { headers: auth() })
    await request.delete(`/api/admins/${adminId}`, { headers: auth() })
  })

  test('kk ашылады, ru-да аударма жоқ: басты бетке бағытталады да, хабарлама көрсетіледі', async ({ page }) => {
    test.skip(Boolean(skip), skip)
    expect(pageId).not.toBe('')
    const kk = await page.goto(`/kk${path}`)
    expect(kk?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText('E2E аударма тесті')

    await page.goto(`/ru${path}`)
    await expect(page).toHaveURL(/\/ru$/)
    await expect(page.getByRole('status').filter({ hasText: 'Перевода этой страницы пока нет' })).toBeVisible()
  })
})
