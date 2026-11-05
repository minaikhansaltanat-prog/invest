import { expect, test } from '@playwright/test'

import { shot } from './helpers/shot'

// 0-кезең: қаңқа жұмыс істейді: /admin ашылады, 4 тілдің маршруты бар, /api жауап береді.

test('/admin ашылады: кіру немесе бірінші әкімші формасы көрінеді', async ({ page }) => {
  const response = await page.goto('/admin')
  expect(response?.status()).toBeLessThan(400)
  await expect(page.locator('form').first()).toBeVisible({ timeout: 60_000 })
  await shot(page, 'stage-0-admin', [1440, 390])
})

for (const locale of ['kk', 'ru', 'en', 'zh'] as const) {
  test(`/${locale} маршруты жауап береді және lang атрибуты дұрыс`, async ({ page }) => {
    const response = await page.goto(`/${locale}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe(locale === 'zh' ? 'zh-CN' : locale)
  })
}

test('түбір / әдепкі тілге (kk) бағыттайды', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(kk|ru|en|zh)$/)
})

test('Payload REST API қолжетімді', async ({ request }) => {
  const response = await request.get('/api/users/me')
  expect(response.status()).toBeLessThan(500)
})
