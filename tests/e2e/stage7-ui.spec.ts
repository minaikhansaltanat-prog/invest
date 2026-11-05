import { expect, test } from '@playwright/test'

import { shot } from './helpers/shot'

// 7-кезең (UI): жоба бетіндегі инвестор қадамы және деректер бөлмесінің қорғанысы (сессиясыз пайдаланушы).

test('жоба беті: сессиясыз қонақ NDA туралы ескертуді, «Кіру» мен инвестор өтінішін көреді, толық паспорт жоқ', async ({ page }) => {
  await page.goto('/en/projects/solar-power-plant-turkistan', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: 'The full passport opens after an NDA' })).toBeVisible()
  await expect(page.locator('main').getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(page.locator('main').getByRole('link', { name: 'Investor application' })).toBeVisible()
  await expect(page.locator('main').getByRole('link', { name: 'Open the data room' })).toHaveCount(0)
  // ішкі деректер беттің HTML-інде де жоқ
  const html = await page.content()
  expect(html).not.toMatch(/committeeDecision|documentsVerified|stageHistory|totpSecret/)
  await shot(page, 'stage-7-project-nda-en', [1440, 390], { fullPage: false })
})

test('деректер бөлмесі сессиясыз: кіру бетіне бағытталады; жария API жабық', async ({ page, request }) => {
  await page.goto('/en/account/dataroom/1')
  await expect(page).toHaveURL(/\/en\/account\/login\?next=/)
  expect((await request.get('/api/portal/dataroom/1', { failOnStatusCode: false })).status()).toBe(401)
  expect((await request.get('/api/portal/dataroom/file/1', { failOnStatusCode: false })).status()).toBeGreaterThanOrEqual(401)
  expect((await request.post('/api/portal/nda', { data: { projectId: 1, accept: true, code: '123456' }, failOnStatusCode: false })).status()).toBe(401)
  expect((await request.post('/api/portal/matching', { data: { projectId: 1 }, failOnStatusCode: false })).status()).toBe(403)
})

test('жалған жол: сан емес жоба id-і 404', async ({ page }) => {
  const response = await page.goto('/en/account/dataroom/abc')
  expect(response?.status()).toBe(404)
})
