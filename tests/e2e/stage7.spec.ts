import { expect, type APIRequestContext, request as playwrightRequest, test } from '@playwright/test'

import { totpCode } from '../../src/lib/security/totp'

// 7-кезең: инвестициялық модуль (ТТ 8). Бизнес-ережелер сервер жағында REST арқылы тексеріледі: UI-ды айналып өтуге болмайды.
// Бір супер-администратор барлық рөл аккаунттарын жасайды; соңында барлығы жойылады (қарау журналы SQL-мен тазаланады).

const baseURL = `http://localhost:${process.env.PORT ?? 3000}`
const runId = `${Date.now()}`
const strong = (tag: string) => `Pw-${tag}-${runId}-Aa1!`
const email = (tag: string) => `e2e7-${tag}-${runId}@example.test`
const authH = (token: string) => ({ Authorization: `JWT ${token}` })

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
const PDF = Buffer.from(
  [
    '%PDF-1.1',
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj',
    'xref',
    '0 4',
    '0000000000 65535 f ',
    '0000000010 00000 n ',
    '0000000053 00000 n ',
    '0000000102 00000 n ',
    'trailer<</Size 4/Root 1 0 R>>',
    'startxref',
    '149',
    '%%EOF',
    '',
  ].join('\n'),
)

const weights: Record<string, number> = {
  financialPotential: 25,
  intentAndAuthority: 15,
  sectorExperience: 15,
  reputation: 15,
  localContribution: 10,
  complianceRisk: 10,
  planReadiness: 10,
}

type Staff = { id: number; token: string }
const staff: Record<string, Staff> = {}
const created: { collection: string; id: number | string }[] = []
let skip = ''
let evidenceId: number | string = ''

const track = (collection: string, id: number | string) => created.push({ collection, id })

async function api(request: APIRequestContext, method: 'get' | 'post' | 'patch' | 'delete', url: string, token: string | null, data?: unknown) {
  const options = { headers: token ? authH(token) : {}, data, failOnStatusCode: false }
  const response = await request[method](url, options)
  const text = await response.text()
  let body: Record<string, unknown> = {}
  try {
    body = JSON.parse(text) as Record<string, unknown>
  } catch {
    body = { raw: text }
  }
  return { status: response.status(), body, headers: response.headers() }
}

async function createAdmin(request: APIRequestContext, root: string, tag: string, role: string): Promise<Staff> {
  const adminEmail = email(tag)
  const password = strong(tag)
  const made = await api(request, 'post', '/api/admins', root, { email: adminEmail, password, name: `E2E ${tag}`, roles: [role] })
  expect(made.status, JSON.stringify(made.body)).toBe(201)
  const id = (made.body.doc as { id: number }).id
  track('admins', id)
  const login = await api(request, 'post', '/api/admins/login', null, { email: adminEmail, password })
  expect(login.status, JSON.stringify(login.body)).toBe(200)
  return { id, token: login.body.token as string }
}

const fullEntries = (points: (key: string) => number) =>
  Object.keys(weights).map((dimension) => ({ dimension, points: points(dimension), evidenceText: `Дәлелдеме: ${dimension}`, evidenceFiles: [evidenceId] }))

test.describe.serial('инвестициялық модуль (7-кезең)', () => {
  test.beforeAll(async ({ request }) => {
    const rootPassword = strong('root')
    const first = await request.post('/api/admins/first-register', { data: { email: email('root'), password: rootPassword, name: 'E2E root', roles: ['content-manager'] } })
    if (!first.ok()) {
      skip = `Әкімші бар немесе first-register жабық (${first.status()}): 7-кезең тесттері өткізілмеді`
      return
    }
    const body = (await first.json()) as { token: string; user: { id: number } }
    staff.root = { id: body.user.id, token: body.token }
    track('admins', body.user.id)
    staff.secretariat = await createAdmin(request, staff.root.token, 'sec', 'secretariat')
    staff.expert = await createAdmin(request, staff.root.token, 'exp', 'expert')
    staff.committee = await createAdmin(request, staff.root.token, 'com', 'expert')
    staff.compliance = await createAdmin(request, staff.root.token, 'cmp', 'compliance')
    staff.content = await createAdmin(request, staff.root.token, 'cnt', 'content-manager')

    const media = await request.post('/api/media', {
      headers: authH(staff.root.token),
      multipart: { file: { name: `evidence-${runId}.png`, mimeType: 'image/png', buffer: PNG }, _payload: JSON.stringify({ alt: 'e2e evidence', license: 'own' }) },
    })
    expect(media.status(), await media.text()).toBe(201)
    evidenceId = ((await media.json()) as { doc: { id: number } }).doc.id
    track('media', evidenceId)
  })

  test.afterAll(async ({ request }) => {
    if (!staff.root) return
    // Қарау журналы append-only (REST арқылы өшірілмейді): тест жазбаларын тікелей SQL-мен тазалаймыз (алдымен, пайдаланушылар жойылмай тұрып)
    const pg = await import('pg')
    const client = new pg.default.Client({ connectionString: process.env.DATABASE_URL || 'postgresql://kfca:kfca@127.0.0.1:54329/kfca' })
    try {
      await client.connect()
      await client.query(`delete from dataroom_log where user_id in (select id from users where email like 'e2e7-%')`)
    } finally {
      await client.end().catch(() => undefined)
    }
    // тәуелділік ретімен: NDA, сәйкестендіру, scorecard, декларация, файл, жоба, инвестор, ұйым, пайдаланушы, медиа, әкімші
    const order = ['ndas', 'matches', 'scorecards', 'coiDeclarations', 'dataroomFiles', 'projects', 'investors', 'organizations', 'users', 'media', 'admins']
    for (const collection of order) {
      for (const item of created.filter((entry) => entry.collection === collection).reverse()) {
        await request.delete(`/api/${collection}/${item.id}`, { headers: authH(staff.root.token), failOnStatusCode: false })
      }
    }
  })

  test.beforeEach(() => test.skip(Boolean(skip), skip))

  // ---------- 8.2: бағалау, деңгей, вето, мүдделер қақтығысы ----------

  let investorId: number
  let investorTwoId: number

  test('scorecard: балл, деңгей және мәртебе серверде есептеледі; екі тұлға бекітеді', async ({ request }) => {
    const org = await api(request, 'post', '/api/organizations', staff.secretariat.token, { name: `E2E Capital ${runId}`, country: 'Singapore', registrationNumber: `R-${runId}` })
    expect(org.status, JSON.stringify(org.body)).toBe(201)
    const orgId = (org.body.doc as { id: number }).id
    track('organizations', orgId)

    const inv = await api(request, 'post', '/api/investors', staff.secretariat.token, { displayName: `E2E Investor ${runId}`, organization: orgId, sectors: ['energy'], regions: ['astana'], models: ['ppp'], minAmountMusd: 10, maxAmountMusd: 100, riskAppetite: 'medium' })
    expect(inv.status, JSON.stringify(inv.body)).toBe(201)
    investorId = (inv.body.doc as { id: number }).id
    track('investors', investorId)
    expect((inv.body.doc as { status: string }).status).toBe('unassessed')

    // бір бағалаушы ғана: толық, бірақ бекітілмейді
    const single = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorId,
      entries: fullEntries((key) => weights[key]),
      assessments: [{ evaluator: staff.expert.id, role: 'expert' }],
    })
    expect(single.status, JSON.stringify(single.body)).toBe(201)
    track('scorecards', (single.body.doc as { id: number }).id)
    expect(single.body.doc).toMatchObject({ total: 100, grade: 'A', complete: true, finalized: false })
    let investor = await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.secretariat.token)
    expect(investor.body).toMatchObject({ status: 'unassessed', grade: null })

    // сарапшы + комитет мүшесі (әртүрлі адам): бекітіледі, инвесторға түседі
    const full = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorId,
      entries: fullEntries((key) => weights[key]),
      assessments: [
        { evaluator: staff.expert.id, role: 'expert' },
        { evaluator: staff.committee.id, role: 'committee-member' },
      ],
    })
    expect(full.status, JSON.stringify(full.body)).toBe(201)
    track('scorecards', (full.body.doc as { id: number }).id)
    expect(full.body.doc).toMatchObject({ total: 100, grade: 'A', complete: true, finalized: true })
    investor = await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.secretariat.token)
    expect(investor.body).toMatchObject({ status: 'priority', grade: 'A', totalScore: 100 })
    expect(investor.body.lastAssessedAt).toBeTruthy()
  })

  test('балл жетпесе: дәлел мәтіні/файлы жоқ карта толық емес, бекітілмейді; деңгей шекарасы B', async ({ request }) => {
    const inv = await api(request, 'post', '/api/investors', staff.secretariat.token, { displayName: `E2E Investor B ${runId}` })
    investorTwoId = (inv.body.doc as { id: number }).id
    track('investors', investorTwoId)

    const noEvidence = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorTwoId,
      entries: Object.keys(weights).map((dimension) => ({ dimension, points: weights[dimension] })),
      assessments: [
        { evaluator: staff.expert.id, role: 'expert' },
        { evaluator: staff.committee.id, role: 'committee-member' },
      ],
    })
    expect(noEvidence.status).toBe(201)
    track('scorecards', (noEvidence.body.doc as { id: number }).id)
    expect(noEvidence.body.doc).toMatchObject({ complete: false, finalized: false })

    // 72 балл: B деңгейі (65-79), «шартты серіктес»
    const pointsB = (key: string) => Math.round(weights[key] * 0.72 * 100) / 100
    const b = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorTwoId,
      entries: fullEntries(pointsB),
      assessments: [
        { evaluator: staff.expert.id, role: 'expert' },
        { evaluator: staff.committee.id, role: 'committee-member' },
      ],
    })
    expect(b.status, JSON.stringify(b.body)).toBe(201)
    track('scorecards', (b.body.doc as { id: number }).id)
    expect(b.body.doc).toMatchObject({ grade: 'B', finalized: true })
    const investor = await api(request, 'get', `/api/investors/${investorTwoId}?depth=0`, staff.secretariat.token)
    expect(investor.body).toMatchObject({ status: 'conditional', grade: 'B' })
  })

  test('есептелген өрістерді қолмен жасандылауға болмайды', async ({ request }) => {
    const patch = await api(request, 'patch', `/api/investors/${investorTwoId}`, staff.secretariat.token, { totalScore: 100, grade: 'A', status: 'priority' })
    expect(patch.status, JSON.stringify(patch.body)).toBe(200)
    const after = await api(request, 'get', `/api/investors/${investorTwoId}?depth=0`, staff.secretariat.token)
    expect(after.body).toMatchObject({ grade: 'B', status: 'conditional' })
    expect(after.body.totalScore).toBeLessThan(80)

    // қате балл (шектен тыс): scorecard жоғары санды қабылдамайды
    const forged = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorTwoId,
      entries: [{ dimension: 'financialPotential', points: 999, evidenceText: 'x', evidenceFiles: [evidenceId] }],
      assessments: [],
      total: 100,
      finalized: true,
    })
    expect(forged.status).toBe(201)
    track('scorecards', (forged.body.doc as { id: number }).id)
    expect(forged.body.doc).toMatchObject({ complete: false, finalized: false })
    expect((forged.body.doc as { total: number }).total).not.toBe(100)
  })

  test('комплаенс ветосы: себеп міндетті, тек комплаенс қояды, баллға қарамастан «тоқтатылды»', async ({ request }) => {
    const noReason = await api(request, 'patch', `/api/investors/${investorId}`, staff.compliance.token, { veto: { active: true } })
    expect(noReason.status).toBe(400)

    // хатшылық ветоны қоя алмайды (өрістік access): мән ескерілмейді
    const bySecretariat = await api(request, 'patch', `/api/investors/${investorId}`, staff.secretariat.token, { veto: { active: true, reason: 'Хатшылық қоймақшы' } })
    expect(bySecretariat.status).toBe(200)
    expect(((await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.compliance.token)).body.veto as { active: boolean }).active).toBe(false)

    const set = await api(request, 'patch', `/api/investors/${investorId}`, staff.compliance.token, { veto: { active: true, reason: 'Санкциялық тәуекел анықталды' } })
    expect(set.status, JSON.stringify(set.body)).toBe(200)
    let investor = await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.compliance.token)
    expect(investor.body).toMatchObject({ status: 'stopped', grade: 'A', totalScore: 100 })
    expect((investor.body.veto as { setAt: string }).setAt).toBeTruthy()

    // хатшылық ветоны алып тастай алмайды
    await api(request, 'patch', `/api/investors/${investorId}`, staff.secretariat.token, { veto: { active: false } })
    investor = await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.compliance.token)
    expect(investor.body.status).toBe('stopped')

    // комплаенс алып тастаса, мәртебе баллға қайтады
    await api(request, 'patch', `/api/investors/${investorId}`, staff.compliance.token, { veto: { active: false } })
    investor = await api(request, 'get', `/api/investors/${investorId}?depth=0`, staff.compliance.token)
    expect(investor.body.status).toBe('priority')
  })

  test('мүдделер қақтығысы: декларациясы бар сарапшы баға қоя алмайды', async ({ request }) => {
    const decl = await api(request, 'post', '/api/coiDeclarations', staff.compliance.token, { person: staff.committee.id, investor: investorId, description: 'Отбасылық байланыс' })
    expect(decl.status, JSON.stringify(decl.body)).toBe(201)
    track('coiDeclarations', (decl.body.doc as { id: number }).id)

    const blocked = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: investorId,
      entries: fullEntries((key) => weights[key]),
      assessments: [
        { evaluator: staff.expert.id, role: 'expert' },
        { evaluator: staff.committee.id, role: 'committee-member' },
      ],
    })
    expect(blocked.status).toBe(400)
    expect(JSON.stringify(blocked.body)).toContain('conflict-of-interest')
  })

  // ---------- 8.3, 8.4, 8.7: жоба ережелері ----------

  let projectId: number
  const slug = `e2e-project-${runId}`

  test('жоба: деңгей тек реттеп көтеріледі, шарттар орындалмай жариялауға болмайды, жария API-да ішкі дерек жоқ', async ({ request }) => {
    const made = await api(request, 'post', '/api/projects?locale=kk', staff.secretariat.token, {
      slug,
      title: `E2E жоба ${runId}`,
      sector: 'energy',
      region: 'astana',
      model: 'ppp',
      level: '1',
      stage: '1',
      amountMusd: 40,
      internal: { ownerName: 'E2E Owner', purpose: 'Тест мақсаты', need: 'Тест қажеттілігі' },
    })
    expect(made.status, JSON.stringify(made.body)).toBe(201)
    projectId = (made.body.doc as { id: number }).id
    track('projects', projectId)

    // жаңа жоба тек 1-деңгейден басталады
    const wrongStart = await api(request, 'post', '/api/projects?locale=kk', staff.secretariat.token, { slug: `${slug}-x`, title: 'x', sector: 'energy', region: 'astana', model: 'ppp', level: '3' })
    expect(wrongStart.status).toBe(400)

    // 1 → 3 секіру жоқ
    const skipLevel = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '3' })
    expect(skipLevel.status).toBe(400)
    expect(JSON.stringify(skipLevel.body)).toContain('level-skip')

    // 2-деңгей: тексерулерсіз болмайды
    const noChecks = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '2' })
    expect(noChecks.status).toBe(400)
    expect(JSON.stringify(noChecks.body)).toMatch(/documents/)

    // 1-деңгейдегі жоба жариялана алмайды
    const early = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { publishToCatalog: true })
    expect(early.status).toBe(400)
    expect(JSON.stringify(early.body)).toContain('level-not-publishable')

    // тексерілмеген жоба жария каталогта жоқ
    const hidden = await request.get(`/api/projects?where[slug][equals]=${slug}&depth=0`)
    expect(((await hidden.json()) as { totalDocs: number }).totalDocs).toBe(0)

    // тексеру белгілерін хатшылық қояды → 2-деңгей → жариялау
    const checks = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { documentsVerified: true, landStatusVerified: true, initialRisksVerified: true } })
    expect(checks.status, JSON.stringify(checks.body)).toBe(200)
    const l2 = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '2', publishToCatalog: true })
    expect(l2.status, JSON.stringify(l2.body)).toBe(200)

    const visible = await request.get(`/api/projects?where[slug][equals]=${slug}&depth=0`)
    const listed = (await visible.json()) as { totalDocs: number; docs: Record<string, unknown>[] }
    expect(listed.totalDocs).toBe(1)
    expect(Object.keys(listed.docs[0])).not.toContain('internal')
    expect(JSON.stringify(listed.docs[0])).not.toMatch(/E2E Owner|ownerName|committeeDecision|amounts/)
  })

  test('3-деңгей: комитет шешімін тек төраға/сарапшы қояды; төмендету тек төраға және жариялануды алып тастайды', async ({ request }) => {
    // хатшылық комитет шешімін қоя алмайды (өрістік access)
    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { committeeDecision: 'approved', passportReady: true, feasibilityStudyReady: true } })
    const noCommittee = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '3' })
    expect(noCommittee.status).toBe(400)
    expect(JSON.stringify(noCommittee.body)).toContain('committeeApproval')

    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.expert.token, { internal: { committeeDecision: 'approved' } })
    const l3 = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '3' })
    expect(l3.status, JSON.stringify(l3.body)).toBe(200)

    // төмендету: хатшылық емес, төраға (супер-администратор)
    const down = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { level: '2' })
    expect(down.status).toBe(400)
    expect(JSON.stringify(down.body)).toContain('level-downgrade-not-allowed')
    const chairDown = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.root.token, { level: '1' })
    expect(chairDown.status, JSON.stringify(chairDown.body)).toBe(200)
    const after = await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)
    expect(after.body.publishToCatalog).toBe(false) // деңгей түсті: ашық каталогтан автоматты түрде алынды
    const publicList = await request.get(`/api/projects?where[slug][equals]=${slug}&depth=0`)
    expect(((await publicList.json()) as { totalDocs: number }).totalDocs).toBe(0)
  })

  test('8 кезеңдік цикл: кезеңді өткізіп жіберуге болмайды, артқа тек төраға, тарих серверде жазылады', async ({ request }) => {
    const skipStage = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { stage: '3' })
    expect(skipStage.status).toBe(400)
    expect(JSON.stringify(skipStage.body)).toContain('stage-skip')

    const advance = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { stage: '2' })
    expect(advance.status, JSON.stringify(advance.body)).toBe(200)

    // 2→3: хатшылық чек-листі
    const noChecklist = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { stage: '3' })
    expect(noChecklist.status).toBe(400)
    expect(JSON.stringify(noChecklist.body)).toContain('secretariatChecklist')
    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { secretariatChecklistApproved: true } })
    expect((await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { stage: '3' })).status).toBe(200)

    // артқа: хатшылық емес, төраға
    expect((await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { stage: '2' })).status).toBe(400)
    expect((await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.root.token, { stage: '2' })).status).toBe(200)

    const project = await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)
    const history = ((project.body.internal as { stageHistory: { stage: string }[] }).stageHistory ?? []).map((entry) => entry.stage)
    expect(history).toEqual(['1', '2', '3', '2'])

    // клиент жіберген тарихқа сенбейді
    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { stageHistory: [{ stage: '8', at: new Date().toISOString(), by: 'hack' }] } })
    const again = await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)
    expect(((again.body.internal as { stageHistory: { stage: string }[] }).stageHistory ?? []).map((entry) => entry.stage)).toEqual(['1', '2', '3', '2'])
  })

  test('төрт сома: бөлек сақталады, қосылмайды, «түскен» тек дәлелмен', async ({ request }) => {
    const bad = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { amounts: { received: 5 } } })
    expect(bad.status).toBe(400)
    expect(JSON.stringify(bad.body)).toContain('received-without-evidence')

    const negative = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, { internal: { amounts: { declared: -1 } } })
    expect(negative.status).toBe(400)

    const ok = await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.secretariat.token, {
      internal: { amounts: { declared: 40, loi: 30, contract: 20, received: 5, receivedEvidence: [evidenceId], associationContribution: 'direct' } },
    })
    expect(ok.status, JSON.stringify(ok.body)).toBe(200)
    const project = await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)
    const amounts = (project.body.internal as { amounts: Record<string, unknown> }).amounts
    expect(amounts).toMatchObject({ declared: 40, loi: 30, contract: 20, received: 5, associationContribution: 'direct' })
    for (const key of Object.keys(amounts)) expect(key).not.toMatch(/total|sum|combined|overall/i)

    // контент-менеджер «түскен» сомаға тиіспейді (өрістік access)
    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.content.token, { internal: { amounts: { received: 999 } } })
    const check = await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)
    expect(((check.body.internal as { amounts: { received: number } }).amounts).received).toBe(5)
  })

  // ---------- 8.5: сәйкестендіру ----------

  test('сәйкестендіру: тек A/B, ветосыз; ұсынысты менеджер жасайды; қызығушылық саны жаңарады', async ({ request }) => {
    // жоба 2-деңгейге қайта көтеріледі (сәйкестендіру жариялаудан тәуелсіз, бірақ деңгей 2+ болғаны дұрыс)
    await api(request, 'patch', `/api/projects/${projectId}?locale=kk`, staff.root.token, { level: '2' })

    const forbidden = await api(request, 'post', '/api/portal/matching', staff.content.token, { projectId })
    expect(forbidden.status).toBe(403)
    const anon = await api(request, 'post', '/api/portal/matching', null, { projectId })
    expect(anon.status).toBe(403)

    // инвестор C деңгейлі (D) жасаймыз: ұсынылмайды
    const low = await api(request, 'post', '/api/investors', staff.secretariat.token, { displayName: `E2E Low ${runId}` })
    const lowId = (low.body.doc as { id: number }).id
    track('investors', lowId)

    const suggest = await api(request, 'post', '/api/portal/matching', staff.secretariat.token, { projectId })
    expect(suggest.status, JSON.stringify(suggest.body)).toBe(200)
    expect(suggest.body.requiresManagerDecision).toBe(true)
    const ids = (suggest.body.suggestions as { investorId: string }[]).map((item) => item.investorId)
    expect(ids).toContain(String(investorId))
    expect(ids).not.toContain(String(lowId))

    // бағаланбаған инвесторды ұсынуға болмайды
    const rejected = await api(request, 'post', '/api/matches', staff.secretariat.token, { project: projectId, investor: lowId })
    expect(rejected.status).toBe(400)
    expect(JSON.stringify(rejected.body)).toContain('grade-too-low')

    const match = await api(request, 'post', '/api/matches', staff.secretariat.token, { project: projectId, investor: investorId, proposedBy: staff.secretariat.id })
    expect(match.status, JSON.stringify(match.body)).toBe(201)
    const matchId = (match.body.doc as { id: number }).id
    track('matches', matchId)
    expect((await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)).body.internal).toMatchObject({ interestedInvestorCount: 0 })

    await api(request, 'patch', `/api/matches/${matchId}`, staff.secretariat.token, { status: 'interested' })
    expect((await api(request, 'get', `/api/projects/${projectId}?depth=0&locale=kk`, staff.root.token)).body.internal).toMatchObject({ interestedInvestorCount: 1 })

    // ветосы бар инвестор ұсынылмайды
    await api(request, 'patch', `/api/investors/${investorTwoId}`, staff.compliance.token, { veto: { active: true, reason: 'Тест' } })
    const vetoed = await api(request, 'post', '/api/matches', staff.secretariat.token, { project: projectId, investor: investorTwoId })
    expect(vetoed.status).toBe(400)
    expect(JSON.stringify(vetoed.body)).toContain('veto-active')
    await api(request, 'patch', `/api/investors/${investorTwoId}`, staff.compliance.token, { veto: { active: false } })
  })

  // ---------- 8.6: NDA және деректер бөлмесі ----------

  test('деректер бөлмесі: NDA, деңгей, вето, 2FA болмаса жабық; рұқсатта су белгісі мен журнал', async ({ request }) => {
    test.setTimeout(180_000)
    const userEmail = email('inv')
    const userPassword = strong('inv')
    const madeUser = await api(request, 'post', '/api/users', staff.root.token, { email: userEmail, password: userPassword, name: 'Li Wei', roles: ['investor'] })
    expect(madeUser.status, JSON.stringify(madeUser.body)).toBe(201)
    const userId = (madeUser.body.doc as { id: number }).id
    track('users', userId)
    await api(request, 'patch', `/api/investors/${investorId}`, staff.secretariat.token, { user: userId })

    // файл жүктеу (жабық қойма)
    const upload = await request.post('/api/dataroomFiles', {
      headers: authH(staff.secretariat.token),
      multipart: { file: { name: `plan-${runId}.pdf`, mimeType: 'application/pdf', buffer: PDF }, _payload: JSON.stringify({ project: projectId, title: 'Қаржылық модель', category: 'financial' }) },
    })
    expect(upload.status(), await upload.text()).toBe(201)
    const fileDoc = ((await upload.json()) as { doc: { id: number; filename: string } }).doc
    track('dataroomFiles', fileDoc.id)

    // Cookie бөлісілмеген бөлек контекстер: anon (сессиясыз), bare (тек JWT, 2FA cookie жоқ), investorCtx (толық сессия, cookie сақтайды)
    const anon = await playwrightRequest.newContext({ baseURL })
    const bare = await playwrightRequest.newContext({ baseURL })
    const investorCtx = await playwrightRequest.newContext({ baseURL })

    // жария қойма жабық
    const direct = await anon.get(`/api/dataroomFiles/file/${fileDoc.filename}`, { failOnStatusCode: false })
    expect([401, 403]).toContain(direct.status())

    // кіру
    const login = await api(request, 'post', '/api/users/login', null, { email: userEmail, password: userPassword })
    expect(login.status).toBe(200)
    const token = login.body.token as string

    // жарамсыз: сессия жоқ
    expect((await anon.get(`/api/portal/dataroom/${projectId}`, { failOnStatusCode: false })).status()).toBe(401)
    // NDA жоқ, 2FA жоқ
    const closed = await bare.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })
    expect(closed.status()).toBe(403)
    expect(await closed.json()).toEqual({ error: 'no-access' }) // себеп сыртқа айтылмайды

    // NDA-ға қол қою 2FA-сыз мүмкін емес
    expect((await bare.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: true, code: '123456' }, failOnStatusCode: false })).status()).toBe(403)

    // 2FA қосу
    const enroll = await investorCtx.post('/api/portal/2fa', { headers: authH(token), data: { action: 'enroll' }, failOnStatusCode: false })
    expect(enroll.status()).toBe(200)
    const secret = ((await enroll.json()) as { secret: string }).secret
    const confirm = await investorCtx.post('/api/portal/2fa', { headers: authH(token), data: { action: 'confirm', code: totpCode(secret) }, failOnStatusCode: false })
    expect(confirm.status()).toBe(200)
    expect(String(confirm.headers()['set-cookie'] ?? '')).toContain('kfca-2fa=')
    expect(String(confirm.headers()['set-cookie'] ?? '')).toContain('HttpOnly')

    // қате OTP: NDA қабылданбайды
    const badCode = await investorCtx.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: true, code: '000000' }, failOnStatusCode: false })
    expect(badCode.status()).toBe(401)
    // келісімсіз
    expect((await investorCtx.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: false, code: totpCode(secret) }, failOnStatusCode: false })).status()).toBe(400)

    // NDA қол қою: сәтті
    const sign = await investorCtx.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: true, code: totpCode(secret) }, failOnStatusCode: false })
    expect(sign.status(), await sign.text()).toBe(201)
    const nda = (await sign.json()) as { nda: number; expiresAt: string }
    track('ndas', nda.nda)
    const days = (new Date(nda.expiresAt).getTime() - Date.now()) / 86_400_000
    expect(days).toBeGreaterThan(89)
    expect(days).toBeLessThan(91)

    // 2FA белгісі (cookie) жоқ сессия: әлі жабық
    const noCookie = await bare.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })
    expect(noCookie.status()).toBe(403)

    // барлық шарт орындалды: ашық
    const list = await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })
    expect(list.status(), await list.text()).toBe(200)
    const listed = (await list.json()) as { watermark: string; files: { id: number; title: string }[] }
    expect(listed.watermark).toMatch(/^Li Wei \| \d{4}-\d{2}-\d{2}$/)
    expect(listed.files.map((file) => file.title)).toContain('Қаржылық модель')

    const view = await investorCtx.get(`/api/portal/dataroom/file/${fileDoc.id}`, { headers: authH(token), failOnStatusCode: false })
    expect(view.status()).toBe(200)
    expect(view.headers()['content-type']).toBe('application/pdf')
    expect(view.headers()['content-disposition']).toBe('inline')
    expect(view.headers()['cache-control']).toContain('no-store')

    // инвестор ішкі жинақтарды оқи алмайды
    for (const url of ['/api/investors', '/api/scorecards', '/api/ndas', '/api/dataroomLog', '/api/dataroomFiles', '/api/coiDeclarations']) {
      expect([401, 403], url).toContain((await investorCtx.get(url, { headers: authH(token), failOnStatusCode: false })).status())
    }

    // вето: қатынас жабылады; алынса, қайта ашылады
    await api(request, 'patch', `/api/investors/${investorId}`, staff.compliance.token, { veto: { active: true, reason: 'Тест вето' } })
    expect((await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })).status()).toBe(403)
    await api(request, 'patch', `/api/investors/${investorId}`, staff.compliance.token, { veto: { active: false } })
    expect((await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })).status()).toBe(200)

    // NDA кері алынды: жабылады
    await api(request, 'patch', `/api/ndas/${nda.nda}`, staff.secretariat.token, { revokedAt: new Date().toISOString(), revokeReason: 'Тест' })
    expect((await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })).status()).toBe(403)

    // қайта қол қою (кері алынғаннан кейін жаңа NDA), содан кейін мерзімі өтеді
    const resign = await investorCtx.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: true, code: totpCode(secret) }, failOnStatusCode: false })
    expect(resign.status()).toBe(201)
    const second = ((await resign.json()) as { nda: number }).nda
    track('ndas', second)
    expect((await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })).status()).toBe(200)
    await api(request, 'patch', `/api/ndas/${second}`, staff.root.token, { expiresAt: new Date(Date.now() - 86_400_000).toISOString() })
    expect((await investorCtx.get(`/api/portal/dataroom/${projectId}`, { headers: authH(token), failOnStatusCode: false })).status()).toBe(403)

    // журнал: ашу, қарау және бас тарту жазылған; өзгертуге/өшіруге болмайды
    const logs = await api(request, 'get', `/api/dataroomLog?where[project][equals]=${projectId}&limit=100&depth=0`, staff.compliance.token)
    expect(logs.status).toBe(200)
    const actions = new Set((logs.body.docs as { action: string }[]).map((entry) => entry.action))
    expect(actions.has('open')).toBe(true)
    expect(actions.has('view')).toBe(true)
    expect(actions.has('denied')).toBe(true)
    const entry = (logs.body.docs as { id: number; message: string }[])[0]
    expect(entry.message).toMatch(/^dataroom\./)
    expect((await api(request, 'patch', `/api/dataroomLog/${entry.id}`, staff.root.token, { message: 'x' })).status).toBeGreaterThanOrEqual(400)
    expect((await api(request, 'delete', `/api/dataroomLog/${entry.id}`, staff.root.token)).status).toBeGreaterThanOrEqual(400)
    await Promise.all([anon.dispose(), bare.dispose(), investorCtx.dispose()])
  })

  test('C деңгейлі инвестор NDA-ға қол қоя алмайды', async ({ request }) => {
    test.setTimeout(120_000)
    // C деңгейі: 55 балл
    const inv = await api(request, 'post', '/api/investors', staff.secretariat.token, { displayName: `E2E Grade C ${runId}` })
    const cId = (inv.body.doc as { id: number }).id
    track('investors', cId)
    const pointsC = (key: string) => Math.round(weights[key] * 0.55 * 100) / 100
    const card = await api(request, 'post', '/api/scorecards', staff.expert.token, {
      investor: cId,
      entries: fullEntries(pointsC),
      assessments: [
        { evaluator: staff.expert.id, role: 'expert' },
        { evaluator: staff.committee.id, role: 'committee-member' },
      ],
    })
    // комитет мүшесінің декларациясы жоқ инвесторға: бекітіледі
    expect(card.status, JSON.stringify(card.body)).toBe(201)
    track('scorecards', (card.body.doc as { id: number }).id)
    expect((await api(request, 'get', `/api/investors/${cId}?depth=0`, staff.root.token)).body).toMatchObject({ grade: 'C', status: 'watch' })

    const user = email('c')
    const pass = strong('c')
    const made = await api(request, 'post', '/api/users', staff.root.token, { email: user, password: pass, name: 'Grade C', roles: ['investor'] })
    const userId = (made.body.doc as { id: number }).id
    track('users', userId)
    await api(request, 'patch', `/api/investors/${cId}`, staff.secretariat.token, { user: userId })
    const login = await api(request, 'post', '/api/users/login', null, { email: user, password: pass })
    const token = login.body.token as string
    const enroll = await api(request, 'post', '/api/portal/2fa', token, { action: 'enroll' })
    const secret = enroll.body.secret as string
    await api(request, 'post', '/api/portal/2fa', token, { action: 'confirm', code: totpCode(secret) })
    const sign = await request.post('/api/portal/nda', { headers: authH(token), data: { projectId, accept: true, code: totpCode(secret) }, failOnStatusCode: false })
    expect(sign.status()).toBe(403)
    expect(await sign.json()).toEqual({ error: 'no-access' })
  })
})
