import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

import { newsSeed, projectsSeed, servicesSeed } from '../../content/seed/data'
import { allPagesSeed } from '../../content/seed/pages'
import { isHiddenPath } from '../../src/lib/mode'
import { visibleNavSections } from '../../src/lib/nav'
import { isCorporateMode } from './helpers/mode'
import { settle, shot } from './helpers/shot'

// PORTAL_MODE=corporate (docs/CORPORATE_MODE.md): жасырын маршруттар 404, /api/portal/* жабық, мәзірде/футерде/мазмұнда жасырын сілтеме жоқ,
// басты бет инвестициялық блоктарсыз толық, бургер мәзір, байланыс формасы, 4 тіл, 1440 және 390 px, әкімші панелі (төрт топ).
// Бұл спек тек corporate режимінде (npm run test:e2e). Толық нұсқа: npm run test:e2e:full.

const locales = ['kk', 'ru', 'en', 'zh'] as const
const runId = `${Date.now()}`

test.skip(!isCorporateMode, 'corporate режимі ғана (PORTAL_MODE=full кезінде өткізілмейді)')

const seededHidden = allPagesSeed.map((page) => page.path).filter((path) => isHiddenPath(path))
const hiddenPaths = [
  ...seededHidden,
  '/account',
  '/account/login',
  '/account/register',
  '/account/dataroom/1',
  `/projects/${projectsSeed[0].slug}`,
]
const visiblePaths = [
  ...allPagesSeed.map((page) => page.path).filter((path) => !isHiddenPath(path)),
  ...servicesSeed.map((service) => `/services/${service.slug}`),
  ...newsSeed.map((item) => `/media/news/${item.slug}`),
]

async function openHome(page: Page, locale: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const response = await page.goto(`/${locale}`, { waitUntil: 'networkidle' })
  expect(response?.status()).toBe(200)
}

const hrefsOf = (page: Page) => page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''))

/** Ішкі сілтеме жасырын бетке апара ма (тіл префиксін isHiddenPath өзі алып тастайды) */
const internalHidden = (hrefs: string[]) => [...new Set(hrefs.filter((href) => href.startsWith('/') && !href.startsWith('//') && isHiddenPath(href)))]

test.describe('жасырын маршруттар', () => {
  test(`беттер 404: ${hiddenPaths.length} жол (kk), қалған тілдерде таңдамалы`, async ({ request }) => {
    test.setTimeout(240_000)
    for (const path of hiddenPaths) {
      const response = await request.get(`/kk${path}`, { maxRedirects: 0 })
      expect(response.status(), `/kk${path}`).toBe(404)
    }
    for (const locale of ['ru', 'en', 'zh']) {
      for (const path of ['/account', '/account/login', '/investors', '/projects', '/results', '/membership/apply']) {
        expect((await request.get(`/${locale}${path}`, { maxRedirects: 0 })).status(), `/${locale}${path}`).toBe(404)
      }
    }
  })

  test('әкімшінің 2FA беті ашық: сессиясыз әкімші кіруіне бағытталады, кабинет емес', async ({ request }) => {
    const response = await request.get('/kk/account/2fa?next=/admin', { maxRedirects: 0 })
    expect([302, 307, 308]).toContain(response.status())
    expect(response.headers().location ?? '').toContain('/admin')
  })

  test('/api/portal/*: байланыс формасы мен ALTCHA ашық, қалғаны 404', async ({ request }) => {
    for (const path of ['kpi', 'account', 'nda', 'matching', 'register', 'dataroom/1', 'dataroom/file/1', 'reports/projects', 'forms/investor', 'forms/project', 'forms/membership']) {
      for (const method of ['GET', 'POST']) {
        const response = await request.fetch(`/api/portal/${path}`, { method, data: method === 'POST' ? {} : undefined })
        expect(response.status(), `${method} /api/portal/${path}`).toBe(404)
        expect(await response.json()).toEqual({ error: 'not-found' })
      }
    }
    expect((await request.get('/api/portal/altcha')).status()).toBe(200)
    // байланыс формасы маршруты бар: бос дене 404 емес, тексеру қатесін қайтарады
    const contact = await request.post('/api/portal/forms/contact', { data: {}, headers: { 'x-test-client-ip': `corp-${runId}-api` } })
    expect([400, 422]).toContain(contact.status())
  })

  test('жобалар Payload REST арқылы да жария көрінбейді', async ({ request }) => {
    const response = await request.get('/api/projects?limit=1')
    expect([401, 403]).toContain(response.status())
  })

  test('sitemap.xml: жасырын жолдар мен жобалар жоқ, қалған беттер бар', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    expect(xml).toContain('/kk/about')
    expect(xml).toContain('/kk/services')
    expect(xml).toContain('/kk/contacts')
    for (const hidden of ['/investors', '/projects', '/results', '/membership/apply', '/membership/registry', '/account']) {
      expect(xml, hidden).not.toContain(hidden)
    }
  })
})

test.describe('басты бет (инвестициялық блоктарсыз)', () => {
  for (const locale of locales) {
    test(`/${locale}: толық құрам, консоль қатесіз, сыртқы доменсіз, жасырын сілтеме жоқ`, async ({ page }) => {
      const errors: string[] = []
      const external: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
      page.on('request', (request) => {
        const host = new URL(request.url()).hostname
        if (!['localhost', '127.0.0.1'].includes(host) && !request.url().startsWith('data:')) external.push(request.url())
      })
      await openHome(page, locale)
      await settle(page)
      await expect(page.locator('h1')).toBeVisible()
      // hero, қауымдастық туралы, қызметтер, жаңалықтар, серіктестер, басшылық, байланыс
      await expect(page.locator('main > section')).toHaveCount(7)
      await expect(page.locator('main h2')).toHaveCount(5) // about, services, news, partners, contact (басшылық бөлімінде дәйексөз)
      expect(await page.locator('body').innerText()).not.toContain('⟦')
      expect(internalHidden(await hrefsOf(page)), 'жасырын бетке сілтеме').toEqual([])
      expect(external).toEqual([])
      expect(errors).toEqual([])
      // инвестициялық блоктар жоқ: аудитория карточкалары, бағалау деңгейлері, дәліздер, жобалар каталогы
      await expect(page.locator('a[href*="/investors"], a[href*="/projects"], a[href*="/account"], a[href*="/results"], a[href*="/membership/apply"]')).toHaveCount(0)
    })
  }

  test('Zh фотосы басшылық карточкасында: 4:5, монограмма емес', async ({ page }) => {
    await openHome(page, 'kk')
    await page.setViewportSize({ width: 1440, height: 900 })
    const photo = page.locator('img[alt*="Ғалым Жанар"]')
    await photo.scrollIntoViewIfNeeded()
    await expect(photo).toBeVisible()
    await settle(page)
    const info = await photo.evaluate((img: HTMLImageElement) => ({
      loaded: img.complete && img.naturalWidth > 0,
      box: img.parentElement!.getBoundingClientRect().width / img.parentElement!.getBoundingClientRect().height,
    }))
    expect(info.loaded).toBe(true)
    expect(info.box).toBeCloseTo(0.8, 1)
  })

  for (const locale of locales) {
    test(`көлденең айналдыру жоқ (${locale}): 360, 390, 768, 1080, 1440`, async ({ page }) => {
      test.setTimeout(240_000)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      for (const width of [360, 390, 768, 1080, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })
        await settle(page)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${locale} ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('мобильді: p мәтіні 16 px-тен кем емес, басылатын элемент 44x44', async ({ page }) => {
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

  test('axe: WCAG 2.2 AA (kk, zh)', async ({ page }) => {
    for (const locale of ['kk', 'zh'] as const) {
      await openHome(page, locale)
      await settle(page)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      const summary = results.violations.map((v) => `${locale} ${v.id} (${v.impact}): ${v.nodes.length} орын, мысалы ${v.nodes[0]?.target.join(' ')}`)
      expect(summary).toEqual([])
    }
  })

  test('скриншоттар: kk, 1440 және 390', async ({ page }) => {
    test.setTimeout(180_000)
    await openHome(page, 'kk')
    await shot(page, 'corporate-home-kk', [1440, 390])
  })
})

test.describe('мәзір, футер және бургер', () => {
  test('десктоп: мәзірде инвестор/жоба бөлімі жоқ, бір «Байланысу» түймесі, «Жеке кабинет» жоқ', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await openHome(page, 'kk')
    const nav = page.getByRole('navigation', { name: 'Негізгі мәзір' })
    for (const hidden of ['Инвесторларға', 'Жобалар']) await expect(nav.getByText(hidden, { exact: true })).toHaveCount(0)
    for (const shown of ['Қауымдастық', 'Қызметтер', 'Медиа', 'Байланыс']) await expect(nav.getByText(shown, { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Байланысу' }).first()).toHaveAttribute('href', '/kk/contacts')
    await expect(page.getByText('Жеке кабинет')).toHaveCount(0)
    await expect(page.getByText('Өтініш беру')).toHaveCount(0)
  })

  test('мәзір бөлімдері конфигпен сәйкес: жасырын бөлім мен ішкі тармақ жоқ, қалғаны 404 емес', async ({ page }) => {
    test.setTimeout(240_000)
    const hrefs = visibleNavSections().flatMap((section) => [section.href, ...(section.children ?? []).map((child) => child.href)])
    expect(internalHidden(hrefs)).toEqual([])
    for (const href of hrefs) {
      const response = await page.goto(`/kk${href}`, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), href).toBe(200)
    }
  })

  for (const locale of locales) {
    test(`бургер (${locale}, 390 px): ашылады, Esc жабады, жасырын сілтеме жоқ, «Байланысу» түймесі бар`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await openHome(page, locale)
      const burger = page.locator('button[aria-controls="mobile-menu"]')
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
      await burger.click()
      const panel = page.locator('#mobile-menu')
      await expect(panel).toBeVisible()
      await expect(page.locator('#site-root')).toHaveAttribute('inert', '')
      expect(internalHidden(await panel.evaluate((el) => [...el.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '')))).toEqual([])
      await expect(panel.locator(`a[href="/${locale}/contacts"]`).first()).toBeVisible()
      await expect(panel.locator('a[href*="/account"], a[href*="/investors"], a[href*="/projects"]')).toHaveCount(0)
      await page.keyboard.press('Escape')
      await expect(panel).toBeHidden()
      await expect(burger).toBeFocused()
    })
  }

  test('футер: «Қызметтер» және «Медиа» бағандары, инвестор/мүше сілтемелері жоқ', async ({ page }) => {
    await openHome(page, 'kk')
    const footer = page.locator('footer')
    await expect(footer.getByRole('link', { name: 'Барлық қызметтер' })).toHaveAttribute('href', '/kk/services')
    await expect(footer.getByRole('link', { name: 'Серіктестер' })).toHaveAttribute('href', '/kk/partners')
    await expect(footer.locator('a[href*="/investors"], a[href*="/projects"], a[href*="/account"], a[href*="/membership/apply"]')).toHaveCount(0)
  })
})

test.describe('ішкі беттер', () => {
  test(`kk: ${visiblePaths.length} ашық бет 200 қайтарады, h1 бір, ⟦кілт⟧ жоқ, жасырын сілтеме жоқ`, async ({ page }) => {
    test.setTimeout(420_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const problems: string[] = []
    for (const path of visiblePaths) {
      const response = await page.goto(`/kk${path}`, { waitUntil: 'domcontentloaded' })
      if (response?.status() !== 200) {
        problems.push(`${path}: ${response?.status()}`)
        continue
      }
      if ((await page.locator('h1').count()) !== 1) problems.push(`${path}: h1 саны ${await page.locator('h1').count()}`)
      if ((await page.locator('body').innerText()).includes('⟦')) problems.push(`${path}: ⟦кілт⟧`)
      const hidden = internalHidden(await hrefsOf(page))
      if (hidden.length > 0) problems.push(`${path}: жасырын сілтеме ${hidden.join(', ')}`)
    }
    expect(problems).toEqual([])
  })

  test('404: бар емес бет қазақша 404 көрсетеді', async ({ page }) => {
    const response = await page.goto('/kk/bar-emes-bet', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toBeVisible()
  })

  for (const locale of locales) {
    test(`көлденең айналдыру жоқ (${locale}): ішкі беттер 390 және 1440 px`, async ({ page }) => {
      test.setTimeout(240_000)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const path of ['/about/mission', '/services', '/membership', '/media/news', '/partners', '/contacts', '/legal/privacy']) {
          await page.goto(`/${locale}${path}`, { waitUntil: 'domcontentloaded' })
          await settle(page)
          expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${locale} ${width}px ${path}`).toBeLessThanOrEqual(0)
        }
      }
    })
  }
})

test.describe.serial('байланыс формасы және әкімші панелі', () => {
  let adminToken = ''
  let adminId: string | number = ''
  let skipReason = ''
  const email = `e2e-corp-admin-${runId}@example.test`
  const password = `Pw-Corp-${runId}-Aa1!`
  const auth = () => ({ Authorization: `JWT ${adminToken}` })

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/api/admins/first-register', { data: { email, password, name: 'E2E Corporate', roles: ['super-admin'] } })
    if (!response.ok()) {
      skipReason = `Әкімші бар немесе first-register жабық (${response.status()}): тесттер өткізілмеді`
      return
    }
    const body = (await response.json()) as { token: string; user: { id: string | number } }
    adminToken = body.token
    adminId = body.user.id
  })

  test.afterAll(async ({ request }) => {
    if (!adminToken) return
    const subs = await request.get('/api/submissions?limit=100&depth=0&where[email][like]=example.test', { headers: auth() })
    if (subs.ok()) {
      const { docs } = (await subs.json()) as { docs: { id: number | string }[] }
      for (const doc of docs) await request.delete(`/api/submissions/${doc.id}`, { headers: auth() })
    }
    await request.delete(`/api/admins/${adminId}`, { headers: auth() })
  })

  test.beforeEach(() => test.skip(Boolean(skipReason), skipReason))

  test('байланыс формасы (kk): келісімсіз жіберілмейді, ALTCHA өтіп жіберіледі, өтініш әкімшіде', async ({ page, request }) => {
    test.setTimeout(150_000)
    await page.context().setExtraHTTPHeaders({ 'x-test-client-ip': `corp-${runId}-contact` })
    await page.goto('/kk/contacts', { waitUntil: 'networkidle' })
    const form = page.locator('form[aria-label]')
    await form.locator('input[name="contactName"]').fill('Корпоратив Тест')
    await form.locator('input[name="email"]').fill(`e2e-corp-contact-${runId}@example.test`)
    await form.locator('select[name="topic"]').selectOption('investor')
    await form.locator('textarea[name="message"]').fill('Қауымдастық қызметі туралы сұрағым бар, хабарласыңыздар.')
    let posted = false
    page.on('request', (r) => r.url().includes('/api/portal/forms/') && (posted = true))
    await page.getByRole('button', { name: 'Жіберу' }).click()
    await expect(page.getByText('Бұл өріс міндетті').first()).toBeVisible()
    expect(posted).toBe(false)
    await page.getByText('Дербес деректерімді жинауға және өңдеуге келісемін').click()
    await expect(page.getByText('Қауіпсіздік тексеруі өтті')).toBeVisible({ timeout: 45_000 })
    await page.getByRole('button', { name: 'Жіберу' }).click()
    const reference = page.getByTestId('submission-reference')
    await expect(reference).toBeVisible({ timeout: 30_000 })
    const ref = (await reference.innerText()).trim()
    expect(ref).toMatch(/^KF-\d{2}-C-[A-Z0-9]{6}$/)
    const stored = await request.get(`/api/submissions?where[reference][equals]=${ref}&depth=0`, { headers: auth() })
    const { docs } = (await stored.json()) as { docs: Record<string, unknown>[] }
    expect(docs).toHaveLength(1)
    expect(docs[0]).toMatchObject({ kind: 'contact', status: 'new', locale: 'kk' })
  })

  test('әкімші панелі: төрт қазақша топ, инвестициялық жинақтар жасырын, KPI дашборды жоқ', async ({ browser }) => {
    test.setTimeout(240_000)
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'kk-KZ' })
    const page = await context.newPage()
    try {
      await page.goto('/admin', { waitUntil: 'networkidle' })
      await page.locator('input[type="password"]').waitFor({ timeout: 60_000 })
      await page.locator('input[name="email"], #field-email').first().fill(email)
      await page.locator('input[type="password"]').first().fill(password)
      await page.locator('button[type="submit"]').first().click()
      await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 60_000 })
      await page.waitForLoadState('networkidle')

      const groups = await page.evaluate(() =>
        [...document.querySelectorAll('.nav-group')].map((group) => ({
          label: group.querySelector('.nav-group__toggle')?.textContent?.trim() ?? '',
          links: [...group.querySelectorAll('a')].map((a) => a.textContent?.trim() ?? ''),
        })),
      )
      expect(groups.map((group) => group.label)).toEqual(['Мазмұн', 'Медиа', 'Өтініштер', 'Жүйе'])
      const all = groups.flatMap((group) => group.links)
      for (const shown of ['Беттер', 'Жаңалықтар', 'Іс-шаралар', 'Қызметтер', 'Серіктестер', 'Тұлғалар', 'Құжаттар', 'Басты бет', 'Фотоальбомдар', 'Бейнелер', 'Медиафайлдар', 'Өтініштер', 'Әкімшілер', 'Баптаулар']) {
        expect(all, shown).toContain(shown)
      }
      for (const hidden of ['Жобалар', 'Инвесторлар', 'Пайдаланушылар', 'Бағалау карталары', 'Ұйымдар', 'Сәйкестендіру', 'NDA']) {
        expect(all.some((text) => text.includes(hidden)), hidden).toBe(false)
      }
      // басқару дашборды (төрт сома, воронка) жоқ
      await expect(page.getByText('Басқару дашборды')).toHaveCount(0)

      for (const path of ['/admin/collections/projects', '/admin/collections/users', '/admin/collections/investors', '/admin/collections/scorecards', '/admin/collections/ndas', '/admin/globals/scoringConfig', '/admin/globals/kpiTargets']) {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
        expect(response?.status(), path).toBe(404)
      }
      for (const path of ['/admin/collections/pages', '/admin/collections/news', '/admin/collections/submissions', '/admin/collections/admins', '/admin/globals/home', '/admin/globals/settings']) {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
        expect(response?.status(), path).toBe(200)
      }
    } finally {
      await context.close()
    }
  })

  test('жасырын жинақтар дерекқорда және API-да қалды: әкімші REST арқылы оқи алады', async ({ request }) => {
    for (const collection of ['projects', 'investors', 'scorecards', 'organizations']) {
      const response = await request.get(`/api/${collection}?limit=1&depth=0`, { headers: auth() })
      expect(response.status(), collection).toBe(200)
    }
  })
})
