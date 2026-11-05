import { createHash } from 'node:crypto'

import { expect, type Page, test } from '@playwright/test'

import { totpCode } from '../../src/lib/security/totp'
import { shot } from './helpers/shot'

// 6-кезең: тіркелу, кіру, 2FA, формалар (Zod, келісім, ALTCHA), қауіпсіздік. Уақытша әкімші барлығын тексеріп, соңында тазалайды.

const runId = `${Date.now()}`
const password = `Pw-${Math.random().toString(36).slice(2)}-${runId}Aa1`
const testEmail = `e2e-user-${runId}@example.test`
const testName = 'Тест Пайдаланушы'

let adminToken = ''
let adminId: string | number = ''
let skipReason = ''
const createdSubmissionRefs: string[] = []

const auth = () => ({ Authorization: `JWT ${adminToken}` })

/** Әр тест өз «IP»-ін алады: rate limit тесттер арасында бөлісілмейді (тақырып тек dev/test ортасында ескеріледі) */
async function isolate(page: Page, name: string) {
  await page.context().setExtraHTTPHeaders({ 'x-test-client-ip': `e2e-${runId}-${name}` })
}

function solve(challenge: { salt: string; challenge: string; algorithm: string; signature: string; maxnumber: number }) {
  for (let number = 0; number <= challenge.maxnumber; number++) {
    if (createHash('sha256').update(`${challenge.salt}${number}`).digest('hex') === challenge.challenge) {
      return Buffer.from(
        JSON.stringify({ algorithm: challenge.algorithm, challenge: challenge.challenge, number, salt: challenge.salt, signature: challenge.signature }),
      ).toString('base64')
    }
  }
  throw new Error('unsolved')
}

test.describe.serial('формалар, тіркелу, 2FA (6-кезең)', () => {
  test.beforeAll(async ({ request }) => {
    const adminPassword = `Adm-${Math.random().toString(36).slice(2)}-${runId}Aa1!`
    const response = await request.post('/api/admins/first-register', {
      data: { email: `e2e6-admin-${runId}@example.test`, password: adminPassword, name: 'E2E Stage 6', roles: ['content-manager'] },
    })
    if (!response.ok()) {
      skipReason = `Әкімші бар немесе first-register жабық (${response.status()}): 6-кезең тесттері өткізілмеді`
      return
    }
    const body = (await response.json()) as { token: string; user: { id: string | number } }
    adminToken = body.token
    adminId = body.user.id
  })

  test.afterAll(async ({ request }) => {
    if (!adminToken) return
    // тест деректерін тазалау: өтініштер, пайдаланушылар, әкімші
    const subs = await request.get('/api/submissions?limit=100&depth=0&where[email][like]=example.test', { headers: auth() })
    if (subs.ok()) {
      const { docs } = (await subs.json()) as { docs: { id: number | string }[] }
      for (const doc of docs) await request.delete(`/api/submissions/${doc.id}`, { headers: auth() })
    }
    const users = await request.get('/api/users?limit=100&depth=0&where[email][like]=example.test', { headers: auth() })
    if (users.ok()) {
      const { docs } = (await users.json()) as { docs: { id: number | string }[] }
      for (const doc of docs) await request.delete(`/api/users/${doc.id}`, { headers: auth() })
    }
    await request.delete(`/api/admins/${adminId}`, { headers: auth() })
  })

  test.beforeEach(() => test.skip(Boolean(skipReason), skipReason))

  test('байланыс формасы (kk): келісімсіз жіберілмейді, келісіммен өтеді, өтініш әкімші панелінде', async ({ page, request }) => {
    test.setTimeout(120_000)
    await isolate(page, 'contact')
    await page.goto('/kk/contacts', { waitUntil: 'networkidle' })
    const form = page.locator('form[aria-label]')
    await form.locator('input[name="contactName"]').fill(testName)
    await form.locator('input[name="email"]').fill(`e2e-contact-${runId}@example.test`)
    await form.locator('select[name="topic"]').selectOption('investor')
    await form.locator('textarea[name="message"]').fill('Қауымдастық қызметі туралы сұрағым бар, хабарласыңыздар.')

    // келісімсіз: қате көрінеді, сұрау кетпейді
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
    createdSubmissionRefs.push(ref)
    await shot(page, 'stage-6-contact-success-kk', [1440, 390], { fullPage: false })

    const stored = await request.get(`/api/submissions?where[reference][equals]=${ref}&depth=0`, { headers: auth() })
    const { docs } = (await stored.json()) as { docs: Record<string, unknown>[] }
    expect(docs).toHaveLength(1)
    expect(docs[0]).toMatchObject({ kind: 'contact', status: 'new', locale: 'kk', contactName: testName })
    const consent = docs[0].consent as { version: string; at: string; ipHash: string }
    expect(consent.version).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(consent.ipHash).toHaveLength(16)
    expect(JSON.stringify(docs[0])).not.toContain('e2e-' + runId + '-contact') // IP өзі сақталмайды
  })

  test('инвестор формасы (ru): 3 қадам, клиенттік тексеру, жіберу', async ({ page, request }) => {
    test.setTimeout(150_000)
    await isolate(page, 'investor')
    await page.goto('/ru/investors/apply', { waitUntil: 'networkidle' })
    const form = page.locator('form[aria-label]')

    // 1-қадам: бос жіберсе, қате жиынтығы
    await form.getByRole('button', { name: 'Далее' }).click()
    await expect(page.getByText('Проверьте форму')).toBeVisible()
    await expect(page.getByText('Это поле обязательно').first()).toBeVisible()

    await form.locator('input[name="companyName"]').fill('Example Capital Ltd')
    await form.locator('input[name="country"]').fill('Singapore')
    await form.locator('input[name="registrationNumber"]').fill('201912345K')
    await form.locator('input[name="beneficiary"]').fill('John Smith')
    await form.locator('input[name="representativeName"]').fill('Jane Doe')
    await form.getByRole('button', { name: 'Далее' }).click()

    // 2-қадам
    await expect(page.getByText('Шаг 2 из 3')).toBeVisible()
    await form.getByText('Энергетика', { exact: true }).click()
    await form.locator('select[name="decisionTimeline"]').selectOption('m3-6')
    await form.locator('textarea[name="experience"]').fill('Десять лет инвестиций в возобновляемую энергетику Азии.')
    await form.locator('input[name="amountMinMusd"]').fill('10')
    await form.locator('input[name="amountMaxMusd"]').fill('5')
    await form.getByRole('button', { name: 'Далее' }).click()
    await expect(page.getByText('не должно превышать').first()).toBeVisible() // range қатесі
    await form.locator('input[name="amountMaxMusd"]').fill('50')
    await form.getByRole('button', { name: 'Далее' }).click()

    // 3-қадам
    await expect(page.getByText('Шаг 3 из 3')).toBeVisible()
    await form.locator('input[name="contactName"]').fill('Jane Doe')
    await form.locator('input[name="email"]').fill(`e2e-investor-${runId}@example.test`)
    await form.locator('select[name="contactLanguage"]').selectOption('en')
    await page.getByText('Я согласен на сбор и обработку моих персональных данных').click()
    await expect(page.getByText('Проверка безопасности пройдена')).toBeVisible({ timeout: 45_000 })
    await form.getByRole('button', { name: 'Отправить' }).click()
    const reference = page.getByTestId('submission-reference')
    await expect(reference).toBeVisible({ timeout: 30_000 })
    const ref = (await reference.innerText()).trim()
    expect(ref).toMatch(/^KF-\d{2}-INV-/)

    const stored = await request.get(`/api/submissions?where[reference][equals]=${ref}&depth=0`, { headers: auth() })
    const { docs } = (await stored.json()) as { docs: { kind: string; data: { sectors: string[]; amountMaxMusd: string; companyName: string } }[] }
    expect(docs[0].kind).toBe('investor')
    expect(docs[0].data.sectors).toEqual(['energy'])
    expect(docs[0].data.companyName).toBe('Example Capital Ltd')
  })

  test('форма API: валидация, ALTCHA, replay, honeypot', async ({ request }) => {
    const ip = { 'x-test-client-ip': `e2e-${runId}-api` }
    const valid = { contactName: 'API Тест', email: `e2e-api-${runId}@example.test`, phone: '', topic: 'other', message: 'API арқылы тексеру хабарламасы.' }

    const invalid = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: { ...valid, email: 'жоқ' }, consent: true, altcha: 'x', locale: 'kk' } })
    expect(invalid.status()).toBe(400)
    expect(((await invalid.json()) as { fields: Record<string, string> }).fields.email).toBe('email')

    const noConsent = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: valid, consent: false, altcha: 'x', locale: 'kk' } })
    expect(noConsent.status()).toBe(400)

    const honeypot = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: valid, consent: true, altcha: 'x', locale: 'kk', hp: 'bot' } })
    expect(honeypot.status()).toBe(400)

    const badCaptcha = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: valid, consent: true, altcha: Buffer.from('{}').toString('base64'), locale: 'kk' } })
    expect(badCaptcha.status()).toBe(403)

    const unknown = await request.post('/api/portal/forms/hack', { headers: ip, data: {} })
    expect(unknown.status()).toBe(404)

    const challenge = (await (await request.get('/api/portal/altcha', { headers: ip })).json()) as Parameters<typeof solve>[0]
    const altcha = solve(challenge)
    const ok = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: valid, consent: true, altcha, locale: 'ru' } })
    expect(ok.status()).toBe(201)
    const replay = await request.post('/api/portal/forms/contact', { headers: ip, data: { data: valid, consent: true, altcha, locale: 'ru' } })
    expect(replay.status()).toBe(403)
    expect(((await replay.json()) as { reason: string }).reason).toBe('replay')
  })

  test('жария API: өтініштер мен пайдаланушылар жабық, жасау мүмкін емес', async ({ request }) => {
    for (const url of ['/api/submissions', '/api/users', '/api/admins']) {
      const response = await request.get(url)
      expect([401, 403], url).toContain(response.status())
    }
    const create = await request.post('/api/submissions', { data: { reference: 'X', kind: 'contact', data: {}, consent: { at: new Date().toISOString(), version: 'x' } } })
    expect([401, 403]).toContain(create.status())
    const createUser = await request.post('/api/users', { data: { email: 'x@example.test', password: 'Aa1-long-password-x', name: 'x', roles: ['investor'] } })
    expect([401, 403]).toContain(createUser.status())
  })

  test('тіркелу: әлсіз құпия сөз қабылданбайды, дұрысымен аккаунт ашылады', async ({ page }) => {
    test.setTimeout(150_000)
    await isolate(page, 'register')
    await page.goto('/en/account/register', { waitUntil: 'networkidle' })
    const form = page.locator('form')
    await form.locator('input[name="name"]').fill(testName)
    await form.locator('input[name="email"]').fill(testEmail)
    await form.locator('input[name="password"]').fill('short')
    await form.locator('input[name="passwordConfirm"]').fill('different')
    await form.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByText('At least 12 characters, with letters and digits').first()).toBeVisible()
    await expect(page.getByText('Passwords do not match')).toBeVisible()
    await expect(page.getByText('This field is required').first()).toBeVisible() // рөл

    await form.locator('input[name="password"]').fill(password)
    await form.locator('input[name="passwordConfirm"]').fill(password)
    await form.getByText('Investor', { exact: true }).click()
    await page.getByText('I consent to the collection and processing of my personal data').click()
    await expect(page.getByText('Security check passed')).toBeVisible({ timeout: 45_000 })
    await form.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByText('Registration complete. You can now sign in.')).toBeVisible({ timeout: 30_000 })
    await shot(page, 'stage-6-register-done-en', [1440, 390], { fullPage: false })
  })

  test('кіру, кабинет, 2FA қосу, шығу, кодпен қайта кіру', async ({ page }) => {
    test.setTimeout(180_000)
    await isolate(page, 'login')

    // қате құпия сөз
    await page.goto('/en/account/login', { waitUntil: 'networkidle' })
    await page.locator('input[name="email"]').fill(testEmail)
    await page.locator('input[name="password"]').fill('Wrong-password-123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Incorrect email or password')).toBeVisible()

    // дұрыс кіру
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/en\/account$/)
    await expect(page.getByText(`Welcome, ${testName}`).first()).toBeVisible()
    await expect(page.getByText('2FA is off')).toBeVisible()
    await shot(page, 'stage-6-account-en', [1440, 390], { fullPage: false })

    // cookie қауіпсіздігі: HttpOnly, SameSite, құпия өрістер қайтарылмайды
    const cookies = await page.context().cookies()
    const session = cookies.find((c) => c.name === 'payload-token')
    expect(session?.httpOnly).toBe(true)
    expect(session?.sameSite).toBe('Lax')
    const me = await page.request.get('/api/users/me')
    const meBody = (await me.json()) as { user: Record<string, unknown> }
    expect(meBody.user).toMatchObject({ email: testEmail })
    expect(meBody.user).not.toHaveProperty('totpSecret')
    expect(meBody.user).not.toHaveProperty('totpPending')
    expect(meBody.user).not.toHaveProperty('hash')

    // құқық көтеру мүмкін емес: рөл мен мәртебені пайдаланушы өзгерте алмайды
    const id = meBody.user.id as number
    await page.request.patch(`/api/users/${id}`, { data: { roles: ['member', 'owner'], status: 'blocked', name: 'Өзгертілген' } })
    const after = await page.request.get('/api/users/me')
    const afterBody = (await after.json()) as { user: { roles: string[]; status: string; name: string } }
    expect(afterBody.user.roles).toEqual(['investor'])
    expect(afterBody.user.status).toBe('active')
    expect(afterBody.user.name).toBe('Өзгертілген') // өз атын өзгерте алады
    await page.request.patch(`/api/users/${id}`, { data: { name: testName } })

    // 2FA қосу
    await page.goto('/en/account/2fa', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Turn on 2FA' }).click()
    const secret = (await page.getByTestId('twofa-secret').innerText()).trim()
    expect(secret).toMatch(/^[A-Z2-7]{32}$/)
    await page.locator('input[name="code"]').fill('000001')
    await page.getByRole('button', { name: 'Confirm and turn on' }).click()
    await expect(page.getByText('The code is incorrect or expired')).toBeVisible()
    await page.locator('input[name="code"]').fill(totpCode(secret))
    await page.getByRole('button', { name: 'Confirm and turn on' }).click()
    await expect(page.getByTestId('twofa-state')).toContainText('2FA is on', { timeout: 20_000 })
    expect((await page.context().cookies()).some((c) => c.name === 'kfca-2fa' && c.httpOnly)).toBe(true)

    // құпия кілт 2FA қосылғаннан кейін де API-да көрінбейді
    const meAfter = await page.request.get('/api/users/me')
    expect(JSON.stringify(await meAfter.json())).not.toContain(secret)

    // шығу: сессия мен 2FA белгісі тазаланады
    await page.goto('/en/account', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/en\/account\/login$/)
    expect((await page.context().cookies()).some((c) => c.name === 'kfca-2fa' && c.value !== '')).toBe(false)

    // Payload-тың өз REST кіруі де кодсыз сессия бермейді (2FA айналып өтілмейді)
    const raw = await page.request.post('/api/users/login', { data: { email: testEmail, password } })
    expect(raw.status()).toBe(401)
    expect(JSON.stringify(await raw.json())).toContain('totp-required')
    expect((await page.context().cookies()).some((c) => c.name === 'payload-token' && c.value !== '')).toBe(false)

    // кодсыз кіру мүмкін емес: код өрісі шығады
    await page.locator('input[name="email"]').fill(testEmail)
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Verification required')).toBeVisible()
    await expect(page.locator('input[name="totp"]')).toBeVisible()
    await expect(page).toHaveURL(/\/en\/account\/login$/)

    // қате код
    await page.locator('input[name="totp"]').fill('000002')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Incorrect 2FA code')).toBeVisible()

    // дұрыс код
    await page.locator('input[name="totp"]').fill(totpCode(secret))
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/en\/account$/, { timeout: 20_000 })
    await expect(page.getByText('2FA is on').first()).toBeVisible()
    await expect(page.getByText('Verified in this session')).toBeVisible()
  })

  test('жеке деректер: жүктеп алу мен жою сұранысы', async ({ page, request }) => {
    test.setTimeout(120_000)
    const email = `e2e-data-${runId}@example.test`
    // 2FA-сыз жеке пайдаланушы (әкімші API арқылы): бұл тест тек деректер әрекеттерін тексереді
    const created = await request.post('/api/users', { headers: auth(), data: { email, password, name: 'Data Test', roles: ['member'] } })
    expect(created.ok()).toBe(true)

    await isolate(page, 'data')
    await page.goto('/en/account/login', { waitUntil: 'networkidle' })
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/en\/account$/, { timeout: 20_000 })

    const exported = await page.request.get('/api/portal/account')
    expect(exported.status()).toBe(200)
    expect(exported.headers()['content-disposition']).toContain('attachment')
    const body = (await exported.json()) as { profile: Record<string, unknown> }
    expect(body.profile.email).toBe(email)
    expect(JSON.stringify(body)).not.toMatch(/totpSecret|"hash"|"salt"/)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Request account deletion' }).click()
    await expect(page.getByText('Request sent')).toBeVisible()
  })
})
