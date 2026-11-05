import { expect, type APIRequestContext, request as playwrightRequest, test } from '@playwright/test'

// 8-кезең: рөлдер (access функциялары), аудит журналы, KPI дашборд, CSV есептер (ТТ 10, 14.1).
// Әр рөл үшін бөлек аккаунт жасалады; рұқсат матрицасы шын REST жауаптарымен тексеріледі. Соңында барлығы жойылады.

const baseURL = `http://localhost:${process.env.PORT ?? 3000}`
const runId = `${Date.now()}`
const startedAt = new Date().toISOString()
const strong = (tag: string) => `Pw-${tag}-${runId}-Aa1!`
const email = (tag: string) => `e2e8-${tag}-${runId}@example.test`
const authH = (token: string) => ({ Authorization: `JWT ${token}` })

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

const roles = ['chair', 'secretariat', 'expert', 'compliance', 'auditor', 'content-manager', 'translator', 'regional-rep', 'analyst'] as const
type Role = (typeof roles)[number]

type Staff = { id: number; token: string; email: string; password: string }
const staff: Record<string, Staff> = {}
const created: { collection: string; id: number | string }[] = []
let skip = ''
const track = (collection: string, id: number | string) => created.push({ collection, id })

async function api(request: APIRequestContext, method: 'get' | 'post' | 'patch' | 'delete', url: string, token: string | null, data?: unknown, headers: Record<string, string> = {}) {
  const response = await request[method](url, { headers: { ...(token ? authH(token) : {}), ...headers }, data, failOnStatusCode: false })
  const text = await response.text()
  let body: Record<string, unknown> = {}
  try {
    body = JSON.parse(text) as Record<string, unknown>
  } catch {
    body = { raw: text }
  }
  return { status: response.status(), body, headers: response.headers(), text }
}

async function createAdmin(request: APIRequestContext, root: string, tag: string, role: string, extra: Record<string, unknown> = {}): Promise<Staff> {
  const adminEmail = email(tag)
  const password = strong(tag)
  const made = await api(request, 'post', '/api/admins', root, { email: adminEmail, password, name: `E2E ${tag}`, roles: [role], ...extra })
  expect(made.status, JSON.stringify(made.body)).toBe(201)
  const id = (made.body.doc as { id: number }).id
  track('admins', id)
  const login = await api(request, 'post', '/api/admins/login', null, { email: adminEmail, password })
  expect(login.status, JSON.stringify(login.body)).toBe(200)
  return { id, token: login.body.token as string, email: adminEmail, password }
}

// Кім қай жинақты толық оқи алады (қалғаны 403). Супер-администратор әрқашан оқиды.
const readMatrix: Record<string, Role[]> = {
  investors: ['secretariat', 'chair', 'compliance', 'auditor', 'expert'],
  organizations: ['secretariat', 'chair', 'compliance', 'auditor', 'expert', 'regional-rep'],
  scorecards: ['expert', 'compliance', 'chair', 'auditor', 'secretariat'],
  matches: ['secretariat', 'chair', 'expert', 'regional-rep', 'compliance', 'auditor'],
  ndas: ['secretariat', 'chair', 'compliance', 'auditor'],
  dataroomFiles: ['secretariat', 'chair', 'compliance', 'auditor', 'expert'],
  dataroomLog: ['compliance', 'chair', 'auditor'],
  auditLog: ['compliance', 'chair', 'auditor'],
  submissions: ['secretariat', 'chair', 'compliance'],
  users: ['secretariat', 'chair', 'compliance', 'auditor'],
  members: ['secretariat', 'chair', 'auditor'],
  issues: ['secretariat', 'chair', 'regional-rep', 'auditor'],
  agreements: ['secretariat', 'chair', 'auditor', 'compliance'],
}

// Өңір бойынша шектелген оқу (200, бірақ тек өз өңірінің жазбалары): өңірлік өкіл
const scopedRead: Record<string, Role[]> = { investors: ['regional-rep'] }

// Кім жинаққа жазба жасай алады (бос денемен жіберіледі: рұқсат бар болса 400 валидация, жоқ болса 403)
const createMatrix: Record<string, Role[]> = {
  investors: ['secretariat', 'chair'],
  organizations: ['secretariat', 'chair'],
  scorecards: ['expert', 'chair'],
  matches: ['secretariat', 'chair'],
  projects: ['secretariat', 'chair', 'regional-rep'],
  members: ['secretariat', 'chair'],
  issues: ['secretariat', 'chair', 'regional-rep'],
  agreements: ['secretariat', 'chair'],
  news: ['content-manager', 'secretariat', 'chair'],
  pages: ['content-manager', 'secretariat', 'chair'],
  users: ['secretariat', 'chair'],
}
// Ешкім (супер-администратор да) REST арқылы жаза алмайды: тек сервер
const serverOnly = ['auditLog', 'ndas', 'dataroomLog', 'submissions']

test.describe.serial('рөлдер, аудит, KPI, есептер (8-кезең)', () => {
  let investorA: number
  let investorB: number
  let projectA: number
  let projectB: number
  let evidenceId: number

  test.beforeAll(async ({ request }) => {
    const first = await request.post('/api/admins/first-register', { data: { email: email('root'), password: strong('root'), name: 'E2E root', roles: ['content-manager'] } })
    if (!first.ok()) {
      skip = `Әкімші бар немесе first-register жабық (${first.status()}): 8-кезең тесттері өткізілмеді`
      return
    }
    const body = (await first.json()) as { token: string; user: { id: number } }
    staff.root = { id: body.user.id, token: body.token, email: email('root'), password: strong('root') }
    track('admins', body.user.id)
    for (const role of roles) staff[role] = await createAdmin(request, staff.root.token, role, role, role === 'regional-rep' ? { region: 'astana' } : {})

    // деректер: екі ұйым/инвестор (өңірі әртүрлі), екі жоба (өңірі әртүрлі)
    const sec = staff.secretariat.token
    const org = await api(request, 'post', '/api/organizations', sec, { name: `E2E Org ${runId}` })
    track('organizations', (org.body.doc as { id: number }).id)
    const a = await api(request, 'post', '/api/investors', sec, { displayName: `E2E InvA ${runId}`, regions: ['astana'], sectors: ['energy'] })
    investorA = (a.body.doc as { id: number }).id
    track('investors', investorA)
    const b = await api(request, 'post', '/api/investors', sec, { displayName: `E2E InvB ${runId}`, regions: ['almaty-city'] })
    investorB = (b.body.doc as { id: number }).id
    track('investors', investorB)
    const pa = await api(request, 'post', '/api/projects?locale=kk', sec, { slug: `e2e8-a-${runId}`, title: `E2E A ${runId}`, sector: 'energy', region: 'astana', model: 'ppp', level: '1', stage: '1' })
    projectA = (pa.body.doc as { id: number }).id
    track('projects', projectA)
    const pb = await api(request, 'post', '/api/projects?locale=kk', sec, { slug: `e2e8-b-${runId}`, title: `E2E B ${runId}`, sector: 'energy', region: 'almaty-city', model: 'ppp', level: '1', stage: '1' })
    projectB = (pb.body.doc as { id: number }).id
    track('projects', projectB)

    const media = await request.post('/api/media', {
      headers: authH(staff.root.token),
      multipart: { file: { name: `ev8-${runId}.png`, mimeType: 'image/png', buffer: PNG }, _payload: JSON.stringify({ alt: 'e2e', license: 'own' }) },
    })
    evidenceId = ((await media.json()) as { doc: { id: number } }).doc.id
    track('media', evidenceId)
  })

  test.afterAll(async ({ request }) => {
    if (!staff.root) return
    const order = ['news', 'projects', 'investors', 'organizations', 'users', 'media', 'admins']
    for (const collection of order) {
      for (const item of created.filter((entry) => entry.collection === collection).reverse()) {
        await request.delete(`/api/${collection}/${item.id}`, { headers: authH(staff.root.token), failOnStatusCode: false })
      }
    }
    // Аудит журналы REST арқылы өшірілмейді: осы тест кезінде жазылған жазбаларды тікелей SQL-мен тазалаймыз
    const pg = await import('pg')
    const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL || 'postgresql://kfca:kfca@127.0.0.1:54329/kfca' })
    try {
      await client.connect()
      await client.query('delete from audit_log where at >= $1', [startedAt])
    } finally {
      await client.end().catch(() => undefined)
    }
  })

  test.beforeEach(() => test.skip(Boolean(skip), skip))

  test('оқу матрицасы: әр рөл тек өз жинақтарын оқиды (403 қалғанына)', async ({ request }) => {
    test.setTimeout(180_000)
    const failures: string[] = []
    for (const [collection, allowed] of Object.entries(readMatrix)) {
      for (const role of roles) {
        const response = await api(request, 'get', `/api/${collection}?limit=1&depth=0`, staff[role].token)
        const expected = allowed.includes(role) || scopedRead[collection]?.includes(role) ? 200 : 403
        if (response.status !== expected) failures.push(`${role} GET ${collection}: ${response.status} (күтілген ${expected})`)
      }
      const root = await api(request, 'get', `/api/${collection}?limit=1&depth=0`, staff.root.token)
      if (root.status !== 200) failures.push(`super-admin GET ${collection}: ${root.status}`)
    }
    expect(failures).toEqual([])
  })

  test('жазу матрицасы: рұқсаты жоқ рөл 403, бар рөл валидацияға дейін өтеді (400); сервер-тек жинақтарға ешкім жаза алмайды', async ({ request }) => {
    test.setTimeout(180_000)
    const failures: string[] = []
    for (const [collection, allowed] of Object.entries(createMatrix)) {
      for (const role of roles) {
        const response = await api(request, 'post', `/api/${collection}`, staff[role].token, {})
        const expected = allowed.includes(role) ? 400 : 403
        if (response.status !== expected) failures.push(`${role} POST ${collection}: ${response.status} (күтілген ${expected})`)
      }
    }
    for (const collection of serverOnly) {
      for (const who of ['root', ...roles]) {
        const response = await api(request, 'post', `/api/${collection}`, staff[who].token, {})
        if (response.status !== 403) failures.push(`${who} POST ${collection}: ${response.status} (күтілген 403, тек сервер)`)
      }
    }
    // әкімші жасау: тек супер-администратор
    for (const role of roles) {
      const response = await api(request, 'post', '/api/admins', staff[role].token, { email: email(`x-${role}`), password: strong('x'), name: 'x', roles: ['content-manager'] })
      if (response.status !== 403) failures.push(`${role} POST admins: ${response.status} (күтілген 403)`)
    }
    expect(failures).toEqual([])
  })

  test('жазбаға қатынас: өңірлік өкіл тек өз өңірін көреді; МҚ декларациясы мен әкімшілер тізімі өзімен шектеледі', async ({ request }) => {
    const rep = staff['regional-rep']
    const projects = await api(request, 'get', '/api/projects?limit=100&depth=0&locale=kk', rep.token)
    const slugs = (projects.body.docs as { slug: string }[]).map((doc) => doc.slug)
    expect(slugs).toContain(`e2e8-a-${runId}`)
    expect(slugs).not.toContain(`e2e8-b-${runId}`)
    expect(((projects.body.docs as { region: string }[]).every((doc) => doc.region === 'astana'))).toBe(true)

    const investors = await api(request, 'get', '/api/investors?limit=100&depth=0', rep.token)
    expect(investors.status).toBe(200)
    const ids = (investors.body.docs as { id: number }[]).map((doc) => doc.id)
    expect(ids).toContain(investorA)
    expect(ids).not.toContain(investorB)

    // контент-менеджер ішкі жоба деректерін көрмейді
    const content = await api(request, 'get', `/api/projects/${projectA}?depth=0&locale=kk`, staff['content-manager'].token)
    expect(content.status).toBe(200)
    expect(content.body).not.toHaveProperty('internal')
    const chair = await api(request, 'get', `/api/projects/${projectA}?depth=0&locale=kk`, staff.chair.token)
    expect(chair.body).toHaveProperty('internal')

    // әкімшілер тізімі: ешқандай ерекше рөлі жоқ қызметкер тек өзін көреді; төраға бәрін көреді
    const own = await api(request, 'get', '/api/admins?limit=100&depth=0', staff['content-manager'].token)
    expect((own.body.docs as { id: number }[]).map((doc) => doc.id)).toEqual([staff['content-manager'].id])
    const all = await api(request, 'get', '/api/admins?limit=100&depth=0', staff.chair.token)
    expect((all.body.docs as unknown[]).length).toBeGreaterThanOrEqual(roles.length + 1)
    expect(JSON.stringify(all.body)).not.toMatch(/totpSecret|"hash"|"salt"/)

    // МҚ декларациясы: қарапайым қызметкер өзіне қатысты ғанасын көреді
    const decl = await api(request, 'post', '/api/coiDeclarations', staff.compliance.token, { person: staff.expert.id, investor: investorA, description: 'Тест' })
    expect(decl.status, JSON.stringify(decl.body)).toBe(201)
    const ownDecl = await api(request, 'get', '/api/coiDeclarations?limit=50&depth=0', staff.secretariat.token)
    expect(ownDecl.body.totalDocs).toBe(0)
    const visible = await api(request, 'get', '/api/coiDeclarations?limit=50&depth=0', staff.compliance.token)
    expect((visible.body.totalDocs as number) >= 1).toBe(true)
    await api(request, 'delete', `/api/coiDeclarations/${(decl.body.doc as { id: number }).id}`, staff.root.token)
  })

  test('құқық көтеруге болмайды: әкімші өз рөлін өзгерте алмайды, басқаны өзгерте/өшіре алмайды', async ({ request }) => {
    const cm = staff['content-manager']
    const patch = await api(request, 'patch', `/api/admins/${cm.id}`, cm.token, { roles: ['super-admin'], region: 'astana', name: 'Өзгертілген аты' })
    expect(patch.status, JSON.stringify(patch.body)).toBe(200)
    const after = await api(request, 'get', `/api/admins/${cm.id}?depth=0`, staff.root.token)
    expect(after.body.roles).toEqual(['content-manager'])
    expect(after.body.region ?? null).toBeNull()
    expect(after.body.name).toBe('Өзгертілген аты') // өз атын өзгерте алады

    const other = await api(request, 'patch', `/api/admins/${staff.chair.id}`, cm.token, { name: 'Бөтен' })
    expect([403, 404]).toContain(other.status)
    expect((await api(request, 'delete', `/api/admins/${staff.chair.id}`, staff.chair.token)).status).toBe(403)

    // кіргеннен кейін құпия сөз саясаты: әлсіз құпия сөзге ауыстыруға болмайды
    const weak = await api(request, 'patch', `/api/admins/${cm.id}`, cm.token, { password: 'short' })
    expect(weak.status).toBe(400)
  })

  test('аудармашы: тек әдепкі емес тілде өзгертеді; контент-менеджер барлық тілде', async ({ request }) => {
    const made = await api(request, 'post', '/api/news?locale=kk', staff.root.token, { slug: `e2e8-news-${runId}`, title: 'Қазақша тақырып', category: 'strategy', publishedAt: new Date().toISOString(), _status: 'draft' })
    expect(made.status, JSON.stringify(made.body)).toBe(201)
    const id = (made.body.doc as { id: number }).id
    track('news', id)

    const kk = await api(request, 'patch', `/api/news/${id}?locale=kk`, staff.translator.token, { title: 'Бұзылған' })
    expect(kk.status).toBe(400)
    expect(JSON.stringify(kk.body)).toContain('non-default')

    const en = await api(request, 'patch', `/api/news/${id}?locale=en`, staff.translator.token, { title: 'English title' })
    expect(en.status, JSON.stringify(en.body)).toBe(200)

    const editor = await api(request, 'patch', `/api/news/${id}?locale=kk`, staff['content-manager'].token, { title: 'Жаңартылған тақырып' })
    expect(editor.status, JSON.stringify(editor.body)).toBe(200)

    // аудармашы жазбаны өшіре алмайды
    expect([403, 404]).toContain((await api(request, 'delete', `/api/news/${id}`, staff.translator.token)).status)
  })

  test('аудит журналы: кім, қашан, не өзгерді (ескі/жаңа мән), IP; құпия өрістер мен дербес мәндер жазылмайды', async ({ request }) => {
    const ip = '203.0.113.77'
    const patch = await api(request, 'patch', `/api/investors/${investorA}`, staff.secretariat.token, { notes: 'Аудит тексеру жазбасы' }, { 'x-test-client-ip': ip })
    expect(patch.status, JSON.stringify(patch.body)).toBe(200)

    const log = await api(request, 'get', `/api/auditLog?where[collection][equals]=investors&where[docId][equals]=${investorA}&sort=-at&limit=5&depth=0`, staff.compliance.token)
    expect(log.status).toBe(200)
    const entry = (log.body.docs as Record<string, unknown>[])[0]
    expect(entry).toMatchObject({ action: 'update', collection: 'investors', actorCollection: 'admins', actorEmail: staff.secretariat.email, ip })
    expect((entry.changes as Record<string, { old: unknown; new: unknown }>).notes).toEqual({ old: null, new: 'Аудит тексеру жазбасы' })
    expect(new Date(entry.at as string).getTime()).toBeGreaterThan(Date.now() - 60_000)

    // жасау және өшіру
    const org = await api(request, 'post', '/api/organizations', staff.secretariat.token, { name: `E2E temp ${runId}` })
    const orgId = (org.body.doc as { id: number }).id
    await api(request, 'delete', `/api/organizations/${orgId}`, staff.chair.token)
    const orgLog = await api(request, 'get', `/api/auditLog?where[collection][equals]=organizations&where[docId][equals]=${orgId}&sort=at&depth=0`, staff.auditor.token)
    expect((orgLog.body.docs as { action: string }[]).map((item) => item.action)).toEqual(['create', 'delete'])

    // дербес пайдаланушы: құпия сөз бен хэш жазылмайды, мәндер жасырылады
    const pass = strong('userlog')
    const user = await api(request, 'post', '/api/users', staff.secretariat.token, { email: email('userlog'), password: pass, name: 'Аудит Пайдаланушы', roles: ['investor'] })
    expect(user.status, JSON.stringify(user.body)).toBe(201)
    const userId = (user.body.doc as { id: number }).id
    track('users', userId)
    const userLog = await api(request, 'get', `/api/auditLog?where[collection][equals]=users&where[docId][equals]=${userId}&depth=0`, staff.compliance.token)
    const serialized = JSON.stringify(userLog.body)
    expect(serialized).toContain('[redacted]')
    expect(serialized).not.toContain(pass)
    expect(serialized).not.toMatch(/"hash"|"salt"|Аудит Пайдаланушы/)

    // кіру да журналға жазылады
    const logins = await api(request, 'get', `/api/auditLog?where[action][equals]=login&where[actorEmail][equals]=${encodeURIComponent(staff.secretariat.email)}&depth=0`, staff.compliance.token)
    expect((logins.body.totalDocs as number) >= 1).toBe(true)

    // append-only: өзгертуге, өшіруге, қолмен жазуға болмайды; рұқсатсыз рөл оқи алмайды
    const id = (log.body.docs as { id: number }[])[0].id
    expect((await api(request, 'patch', `/api/auditLog/${id}`, staff.root.token, { note: 'x' })).status).toBeGreaterThanOrEqual(400)
    expect((await api(request, 'delete', `/api/auditLog/${id}`, staff.root.token)).status).toBeGreaterThanOrEqual(400)
    expect((await api(request, 'post', '/api/auditLog', staff.root.token, { at: new Date().toISOString(), action: 'update' })).status).toBe(403)
    expect((await api(request, 'get', '/api/auditLog', staff['content-manager'].token)).status).toBe(403)
  })

  test('KPI және CSV есептер: төрт сома бөлек, жеке дерексіз, тек рұқсатты рөлдерге; экспорт аудитке жазылады', async ({ request }) => {
    // жобаға төрт сома
    const amounts = await api(request, 'patch', `/api/projects/${projectA}?locale=kk`, staff.secretariat.token, {
      internal: { amounts: { declared: 40, loi: 30, contract: 20, received: 5, receivedEvidence: [evidenceId] } },
    })
    expect(amounts.status, JSON.stringify(amounts.body)).toBe(200)

    for (const role of ['chair', 'analyst', 'auditor', 'secretariat'] as const) {
      const kpi = await api(request, 'get', '/api/portal/kpi', staff[role].token)
      expect(kpi.status, role).toBe(200)
      const data = kpi.body as { amounts: Record<string, number> }
      expect(data.amounts.declared).toBeGreaterThanOrEqual(40)
      expect(data.amounts.loi).toBeGreaterThanOrEqual(30)
      expect(data.amounts.contract).toBeGreaterThanOrEqual(20)
      expect(data.amounts.received).toBeGreaterThanOrEqual(5)
      for (const key of Object.keys(data.amounts)) expect(key).not.toMatch(/total|sum|combined|overall/i)
      expect(JSON.stringify(kpi.body)).not.toMatch(/email|beneficiary|displayName/)
    }
    for (const role of ['content-manager', 'translator', 'expert', 'compliance', 'regional-rep'] as const) {
      expect((await api(request, 'get', '/api/portal/kpi', staff[role].token)).status, role).toBe(403)
    }

    // CSV: аналитик жүктей алады
    const csv = await api(request, 'get', '/api/portal/reports/projects', staff.analyst.token)
    expect(csv.status).toBe(200)
    expect(csv.headers['content-type']).toContain('text/csv')
    expect(csv.headers['content-disposition']).toContain('attachment')
    const lines = csv.text.replace(/^﻿/, '').split('\r\n')
    expect(lines[0]).toContain('declared_musd,loi_musd,contract_musd,received_musd')
    expect(lines[0]).not.toMatch(/total|sum|combined/i)
    const row = lines.find((line) => line.includes(`e2e8-a-${runId}`))
    expect(row).toBeTruthy()
    expect(row).toContain(',40,30,20,5,')

    const investors = await api(request, 'get', '/api/portal/reports/investors', staff.auditor.token)
    expect(investors.status).toBe(200)
    expect(investors.text.split('\r\n')[0]).not.toMatch(/email|phone|beneficiary|contact/i)
    expect((await api(request, 'get', '/api/portal/reports/kpi', staff.chair.token)).text).toContain('received_musd')

    // рұқсатсыз және жарамсыз
    for (const role of ['content-manager', 'translator', 'expert', 'compliance', 'regional-rep'] as const) {
      expect((await api(request, 'get', '/api/portal/reports/projects', staff[role].token)).status, role).toBe(403)
    }
    const anon = await playwrightRequest.newContext({ baseURL })
    expect((await anon.get('/api/portal/reports/projects', { failOnStatusCode: false })).status()).toBe(403)
    await anon.dispose()
    expect((await api(request, 'get', '/api/portal/reports/secrets', staff.chair.token)).status).toBe(404)

    // экспорт аудитке жазылды
    const exports = await api(request, 'get', `/api/auditLog?where[action][equals]=export&where[actorEmail][equals]=${encodeURIComponent(staff.analyst.email)}&depth=0`, staff.compliance.token)
    expect((exports.body.docs as { collection: string }[]).map((doc) => doc.collection)).toContain('report:projects')
  })

  test('әкімші дашборды: төраға кіргенде «Басқару дашборды» көрінеді (UI)', async ({ page }) => {
    test.setTimeout(240_000)
    const chair = staff.chair
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })
    await page.locator('input[name="email"], #field-email').first().fill(chair.email)
    await page.locator('input[name="password"], #field-password').first().fill(chair.password)
    await page.locator('form button[type="submit"]').first().click() // жапсырма тілге байланысты (Login, Вход, Кіру), сондықтан submit түймесі
    await expect(page.getByRole('heading', { name: /Management dashboard|Басқару дашборды|Панель управления|管理看板/ })).toBeVisible({ timeout: 120_000 })
    await expect(page.getByText(/Declared|Мәлімделген|Заявленная|申报金额/).first()).toBeVisible()
  })
})
