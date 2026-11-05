import { expect, test } from '@playwright/test'

import { shot } from './helpers/shot'

// 3-кезең: төрт тіл. Ауыстырғыш, cookie, hreflang/canonical, zh қаріптері, аударма жоқ хабарламасы, әкімшіліктің қазақша интерфейсі.

const baseURL = `http://localhost:${process.env.PORT ?? 3000}`

test.describe('тіл ауыстырғыш және cookie', () => {
  test('десктоп ауыстырғышы: KK → RU → EN → 中文, URL, html lang және NEXT_LOCALE', async ({ page, context }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/kk')
    const expected = [
      { name: 'РУС', url: /\/ru$/, lang: 'ru', cookie: 'ru' },
      { name: 'ENG', url: /\/en$/, lang: 'en', cookie: 'en' },
      { name: '中文', url: /\/zh$/, lang: 'zh-CN', cookie: 'zh' },
      { name: 'ҚАЗ', url: /\/kk$/, lang: 'kk', cookie: 'kk' },
    ]
    for (const step of expected) {
      await page.locator('nav[aria-label] a:visible', { hasText: step.name }).first().click()
      await expect(page).toHaveURL(step.url)
      await expect(page.locator('html')).toHaveAttribute('lang', step.lang)
      const cookies = await context.cookies()
      expect(cookies.find((c) => c.name === 'NEXT_LOCALE')?.value).toBe(step.cookie)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('cookie бар болса, түбір / сол тілге бағыттайды', async ({ page, context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: 'zh', url: baseURL }])
    await page.goto('/')
    await expect(page).toHaveURL(/\/zh$/)
  })

  test('URL-дағы тіл cookie-ден басым: /ru ашылады, cookie жаңарады', async ({ page, context }) => {
    await context.addCookies([{ name: 'NEXT_LOCALE', value: 'zh', url: baseURL }])
    await page.goto('/ru')
    await expect(page).toHaveURL(/\/ru$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    const cookies = await context.cookies()
    expect(cookies.find((c) => c.name === 'NEXT_LOCALE')?.value).toBe('ru')
  })
})

test.describe('SEO: canonical және hreflang', () => {
  for (const locale of ['kk', 'ru', 'en', 'zh'] as const) {
    test(`/${locale}: canonical өз тіліне, hreflang kk/ru/en/zh-CN/x-default`, async ({ page }) => {
      await page.goto(`/${locale}`)
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toMatch(new RegExp(`/${locale}$`))
      const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((nodes) =>
        nodes.map((node) => [node.getAttribute('hreflang'), node.getAttribute('href')] as const),
      )
      const map = new Map(alternates)
      expect([...map.keys()].sort()).toEqual(['en', 'kk', 'ru', 'x-default', 'zh-CN'])
      expect(map.get('zh-CN')).toMatch(/\/zh$/)
      expect(map.get('x-default')).toBe(map.get('kk'))
    })
  }
})

test.describe('zh қаріптері', () => {
  test('zh бетте Noto Sans SC / Noto Serif SC қолданылады, өз серверімізден жүктеледі', async ({ page }) => {
    const external: string[] = []
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (!['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol.startsWith('http')) external.push(request.url())
    })
    await page.goto('/zh')
    await expect(page.locator('h1')).toBeVisible()
    const fonts = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      h1: getComputedStyle(document.querySelector('h1')!).fontFamily,
    }))
    expect(fonts.body).toContain('Noto Sans SC')
    expect(fonts.h1).toContain('Noto Serif SC')
    expect(external, `сыртқы сұраулар: ${external.join(', ')}`).toEqual([])
  })
})

test.describe('аударма жоқ хабарламасы', () => {
  test('?notice=no-translation: toast көрінеді, параметр URL-дан кетеді', async ({ page }) => {
    await page.goto('/ru?notice=no-translation')
    const toast = page.getByRole('status').filter({ hasText: 'Перевода этой страницы пока нет' })
    await expect(toast).toBeVisible()
    await expect(page).toHaveURL(/\/ru$/)
  })

  test('параметрсіз ашқанда хабарлама жоқ', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('status').filter({ hasText: 'Перевода этой страницы' })).toHaveCount(0)
  })
})

test.describe('әкімшілік интерфейсі', () => {
  test.use({ locale: 'kk-KZ', extraHTTPHeaders: { 'Accept-Language': 'kk' } })

  test('kk әдепкі тіл: кіру/бірінші әкімші формасы қазақша', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('form').first()).toBeVisible({ timeout: 60_000 })
    const text = await page.locator('body').innerText()
    expect(text).toMatch(/Электрондық пошта|Құпия сөз|Алғашқы пайдаланушы/)
    await shot(page, 'stage-3-admin-kk', [1440, 390])
  })

  test('payload-lng cookie тілді ауыстырады (ru)', async ({ page, context }) => {
    await context.addCookies([{ name: 'payload-lng', value: 'ru', url: baseURL }])
    await page.goto('/admin')
    await expect(page.locator('form').first()).toBeVisible({ timeout: 60_000 })
    await expect(page.locator('body')).toContainText(/Новый пароль|Пароль|Email/)
    await expect(page.locator('body')).not.toContainText('Құпия сөз')
  })
})
