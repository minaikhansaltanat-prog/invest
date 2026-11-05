import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

import { settle, shot } from './helpers/shot'

// 2-кезең: басты бет (14 блок), бургер мәзір, Zh фотосы, мобильді бейімдеу.

const locales = ['kk', 'ru', 'en', 'zh'] as const
const widths = [360, 390, 768, 1080, 1440]

async function openHome(page: Page, locale: string, reduced = true) {
  if (reduced) await page.emulateMedia({ reducedMotion: 'reduce' })
  const response = await page.goto(`/${locale}`, { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
}

test.describe('басты бет', () => {
  for (const locale of locales) {
    test(`/${locale}: жүктеледі, консоль қатесіз, сыртқы доменсіз, ⟦кілт⟧ жоқ`, async ({ page }) => {
      const errors: string[] = []
      const external: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
      page.on('request', (request) => {
        const host = new URL(request.url()).hostname
        if (!['localhost', '127.0.0.1'].includes(host) && !request.url().startsWith('data:')) external.push(request.url())
      })
      await openHome(page, locale)
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('section')).toHaveCount(11)
      expect(await page.locator('body').innerText()).not.toContain('⟦')
      expect(external).toEqual([])
      expect(errors).toEqual([])
    })
  }

  for (const locale of locales) {
    test(`көлденең айналдыру жоқ (${locale}): 360, 390, 768, 1080, 1440`, async ({ page }) => {
      test.setTimeout(240_000)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })
        await settle(page)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${locale} ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('Zh фотосы басшылық карточкасында: 4:5, AVIF/WebP, монограмма емес', async ({ page }) => {
    await openHome(page, 'kk')
    await page.setViewportSize({ width: 1440, height: 900 })
    const photo = page.locator('img[alt*="Ғалым Жанар"]')
    await photo.scrollIntoViewIfNeeded()
    await expect(photo).toBeVisible()
    await settle(page)
    const info = await photo.evaluate((img: HTMLImageElement) => ({
      loaded: img.complete && img.naturalWidth > 0,
      current: img.currentSrc,
      box: img.parentElement!.getBoundingClientRect().width / img.parentElement!.getBoundingClientRect().height,
    }))
    expect(info.loaded).toBe(true)
    expect(info.current).toContain('/_next/image')
    expect(info.box).toBeCloseTo(0.8, 1)
    // монограмма көрінбейді
    await expect(page.getByText('ҒЖ', { exact: true })).toHaveCount(0)
  })

  test('axe: WCAG 2.2 AA (kk, zh)', async ({ page }) => {
    for (const locale of ['kk', 'zh'] as const) {
      await openHome(page, locale)
      await settle(page)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      const summary = results.violations.map(
        (v) => `${locale} ${v.id} (${v.impact}): ${v.nodes.length} орын, мысалы ${v.nodes[0]?.target.join(' ')}`,
      )
      expect(summary).toEqual([])
    }
  })

  test('мобильді: мәтін 16 px-тен кем емес, басылатын элемент 44x44', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await openHome(page, 'kk')
    await settle(page)
    const report = await page.evaluate(() => {
      const small: string[] = []
      document.querySelectorAll('p').forEach((p) => {
        const size = parseFloat(getComputedStyle(p).fontSize)
        if (size < 15.99 && p.textContent?.trim()) small.push(`${size}px: ${p.textContent.trim().slice(0, 40)}`)
      })
      const tiny: string[] = []
      document.querySelectorAll<HTMLElement>('a, button').forEach((el) => {
        if (el.closest('.skip-link') || el.classList.contains('skip-link')) return
        const rect = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        if (rect.width === 0 || rect.height === 0 || style.visibility === 'hidden') return
        if (el.closest('[hidden]')) return
        if (rect.width < 43.5 || rect.height < 43.5) {
          tiny.push(`${Math.round(rect.width)}x${Math.round(rect.height)} ${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}"`)
        }
      })
      return { small, tiny }
    })
    expect(report.small, 'p мәтіні 16 px-тен кіші').toEqual([])
    expect(report.tiny, 'басылатын элемент 44x44-тен кіші').toEqual([])
  })

  test('скриншоттар: 4 тіл x (1440, 390), kk x (360, 768)', async ({ page }) => {
    test.setTimeout(420_000)
    for (const locale of locales) {
      await openHome(page, locale)
      await shot(page, `stage-2-home-${locale}`, [1440, 390])
    }
    await openHome(page, 'kk')
    await shot(page, 'stage-2-home-kk', [360, 768])
  })
})

test.describe('бургер мәзір (390 px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/kk', { waitUntil: 'networkidle' })
  })

  test('1080 px-тен төмен: десктоп мәзірі жасырын, бургер көрінеді; 1080-де керісінше', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Негізгі мәзір' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Мәзірді ашу' })).toBeVisible()
    await page.setViewportSize({ width: 1080, height: 800 })
    await expect(page.getByRole('navigation', { name: 'Негізгі мәзір' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Мәзірді ашу' })).toBeHidden()
  })

  test('ашу, X-пен жабу, aria және фокус', async ({ page }) => {
    const burger = page.getByRole('button', { name: 'Мәзірді ашу' })
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
    await burger.click()

    const panel = page.getByRole('dialog', { name: 'Мәзір' })
    await expect(panel).toBeVisible()
    await expect(page.locator('#site-root')).toHaveAttribute('inert', '')
    await expect(page.getByRole('button', { name: 'Мәзірді жабу' }).first()).toBeVisible()
    // фокус панельдің ішінде
    expect(await page.evaluate(() => document.getElementById('mobile-menu')!.contains(document.activeElement))).toBe(true)
    // бет айналдыру құлыпталған
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden')
    // фон #071631
    const bg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).toBe('rgb(7, 22, 49)')
    // X түймесі кемінде 44x44, панельдің жоғарғы оң жағында
    const close = panel.getByRole('button', { name: 'Мәзірді жабу' })
    const box = (await close.boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.x + box.width).toBeGreaterThan(390 - 40)
    expect(box.y).toBeLessThan(60)
    await shot(page, 'stage-2-burger-open-kk', [390], { fullPage: false })

    await close.click()
    await expect(panel).toBeHidden()
    await expect(page.locator('#site-root')).not.toHaveAttribute('inert', '')
    await expect(burger).toBeFocused()
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  test('Esc жабады, фокус бургерге оралады', async ({ page }) => {
    const burger = page.getByRole('button', { name: 'Мәзірді ашу' })
    await burger.click()
    await expect(page.getByRole('dialog', { name: 'Мәзір' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Мәзір' })).toBeHidden()
    await expect(burger).toBeFocused()
  })

  test('focus trap: Tab панельден шықпайды', async ({ page }) => {
    await page.getByRole('button', { name: 'Мәзірді ашу' }).click()
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() => document.getElementById('mobile-menu')!.contains(document.activeElement))
      expect(inside, `Tab #${i + 1}`).toBe(true)
    }
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Shift+Tab')
      const inside = await page.evaluate(() => document.getElementById('mobile-menu')!.contains(document.activeElement))
      expect(inside).toBe(true)
    }
  })

  test('ішкі бөлімдер аккордеон: ашылады, сілтеме басқанда мәзір жабылады', async ({ page }) => {
    await page.getByRole('button', { name: 'Мәзірді ашу' }).click()
    const toggle = page.getByRole('button', { name: /Бөлімді ашу: Инвесторларға/ })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await page.getByRole('dialog').getByRole('link', { name: 'Өтініш формасы' }).click()
    await expect(page).toHaveURL(/\/kk\/investors\/apply/)
    await expect(page.getByRole('dialog', { name: 'Мәзір' })).toBeHidden()
  })

  test('панельдегі тіл ауыстырғыш: RU-ға ауысады, мәзір жабылады, aria-label орысша', async ({ page }) => {
    await page.getByRole('button', { name: 'Мәзірді ашу' }).click()
    const lang = page.getByRole('dialog').getByRole('navigation', { name: 'Тілді таңдау' })
    await expect(lang.getByRole('link')).toHaveCount(4)
    await lang.getByRole('link', { name: 'Русский' }).click()
    await expect(page).toHaveURL(/\/ru$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeVisible()
    const cookies = await page.context().cookies()
    expect(cookies.find((c) => c.name === 'NEXT_LOCALE')?.value).toBe('ru')
  })

  test('4 тілдегі aria-label: ашу және жабу', async ({ page }) => {
    const labels: Record<string, [string, string]> = {
      kk: ['Мәзірді ашу', 'Мәзірді жабу'],
      ru: ['Открыть меню', 'Закрыть меню'],
      en: ['Open menu', 'Close menu'],
      zh: ['打开菜单', '关闭菜单'],
    }
    for (const [locale, [open, close]] of Object.entries(labels)) {
      await page.goto(`/${locale}`, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: open }).click()
      await expect(page.getByRole('dialog').getByRole('button', { name: close })).toBeVisible()
      await page.keyboard.press('Escape')
    }
  })
})
