import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { shot } from './helpers/shot'

// 1-кезең: дизайн жүйесі. /styleguide бетінде барлық компоненттер, self-host қаріптер, қолжетімділік.

const locales = ['kk', 'ru', 'en', 'zh'] as const

test.describe('styleguide', () => {
  for (const locale of locales) {
    test(`/${locale}/styleguide: жүктеледі, консоль қатесіз, сыртқы доменсіз`, async ({ page }) => {
      const errors: string[] = []
      const external: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      page.on('request', (request) => {
        const host = new URL(request.url()).hostname
        if (!['localhost', '127.0.0.1'].includes(host) && !request.url().startsWith('data:')) external.push(request.url())
      })

      const response = await page.goto(`/${locale}/styleguide`, { waitUntil: 'networkidle' })
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)

      expect(external, 'сыртқы сұраныс жоқ (ТТ 11.3)').toEqual([])
      expect(errors, 'консоль қатесі жоқ').toEqual([])
    })
  }

  test('self-host қаріптер жүктеледі (Cormorant, Golos)', async ({ page }) => {
    await page.goto('/kk/styleguide', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const families = await page.evaluate(() =>
      [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family.replace(/"/g, '')),
    )
    expect(families).toContain('Cormorant Garamond')
    expect(families).toContain('Golos Text')
  })

  test('zh: Noto SC қаріптері unicode-range бөліктерімен жүктеледі', async ({ page }) => {
    await page.goto('/zh/styleguide', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family.replace(/"/g, '')),
    )
    expect(loaded.some((family) => family.startsWith('Noto S'))).toBe(true)
  })

  test('көлденең айналдыру жоқ: 360, 390, 768, 1080, 1440', async ({ page }) => {
    for (const width of [360, 390, 768, 1080, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/kk/styleguide')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${width}px: көлденең айналдыру`).toBeLessThanOrEqual(0)
    }
  })

  test('axe: WCAG 2.2 AA бұзушылығы жоқ (kk)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/kk/styleguide', { waitUntil: 'networkidle' })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} орын, мысалы ${v.nodes[0]?.target.join(' ')}`)
    expect(summary).toEqual([])
  })

  test('интерактив: чип, аккордеон, модаль (Esc), toast, форма қатесі', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/ru/styleguide')

    // чип
    const chips = page.getByRole('group', { name: 'Chip' }).getByRole('button')
    await chips.nth(1).click()
    await expect(chips.nth(1)).toHaveAttribute('aria-pressed', 'true')
    await expect(chips.nth(0)).toHaveAttribute('aria-pressed', 'false')

    // аккордеон
    const acc = page.getByRole('button', { name: /Привлечение международных инвестиций/ }).first()
    await acc.scrollIntoViewIfNeeded()
    await expect(acc).toHaveAttribute('aria-expanded', 'true')
    await acc.click()
    await expect(acc).toHaveAttribute('aria-expanded', 'false')

    // модаль
    await page.getByRole('button', { name: 'Открыть модальное окно' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    // toast
    await page.getByRole('button', { name: 'Показать уведомление' }).click()
    await expect(page.getByRole('status')).toContainText('Заявка успешно отправлена')

    // форма: бос жіберу қателерді көрсетеді, чекбокс алдын ала белгіленбеген
    const consent = page.getByLabel('Согласен на обработку персональных данных')
    await expect(consent).not.toBeChecked()
    await page.locator('#interactive').getByRole('button', { name: 'Отправить' }).click()
    await expect(page.getByText('Неверный формат электронной почты')).toBeVisible()
    await expect(page.getByText('Для продолжения требуется согласие')).toBeVisible()
  })

  test('скриншоттар: 1440 және 390', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/kk/styleguide', { waitUntil: 'networkidle' })
    await shot(page, 'stage-1-styleguide-kk', [1440, 390])
    await page.goto('/zh/styleguide', { waitUntil: 'networkidle' })
    await shot(page, 'stage-1-styleguide-zh', [1440])
  })
})
