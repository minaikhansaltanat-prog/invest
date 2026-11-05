import { expect, request as playwrightRequest, test } from '@playwright/test'

import { allPagesSeed, servicesDetailSeed } from '../../content/seed/pages'

// 4-кезең: контент жинақтары. Сид толық, жариялау ағыны (жобалама → жарияланды → жобалама) жария API-да дұрыс көрінеді.
// Әкімші тесті уақытша тіркеледі де соңында жойылады: дерекқор «бірінші әкімші» күйінде қалады (таңертең өзіңіз жасайсыз).

const baseURL = `http://localhost:${process.env.PORT ?? 3000}`
const testPath = '/e2e-publish-flow'

test.describe('сид: беттер мен қызметтер', () => {
  test('барлық статикалық бет жария API-да бар және төрт тілде атауы бар', async ({ request }) => {
    const response = await request.get('/api/pages?limit=200&depth=0')
    expect(response.ok()).toBe(true)
    const { docs } = (await response.json()) as { docs: { path: string }[] }
    const paths = new Set(docs.map((doc) => doc.path))
    for (const page of allPagesSeed) expect(paths.has(page.path), page.path).toBe(true)

    for (const locale of ['kk', 'ru', 'en', 'zh']) {
      const localized = await request.get(`/api/pages?limit=1&depth=0&locale=${locale}&fallback-locale=none&where[path][equals]=/about/mission`)
      const { docs: [doc] } = (await localized.json()) as { docs: { title?: string; blocks?: unknown[] }[] }
      expect(doc.title, locale).toBeTruthy()
      expect(doc.blocks?.length, locale).toBeGreaterThanOrEqual(3)
    }
  })

  test('8 қызметтің толық бет блоктары бар', async ({ request }) => {
    const slugs = Object.keys(servicesDetailSeed)
    expect(slugs).toHaveLength(8)
    for (const slug of slugs) {
      const response = await request.get(`/api/services?limit=1&depth=0&locale=ru&fallback-locale=none&where[slug][equals]=${slug}`)
      const { docs: [doc] } = (await response.json()) as { docs: { blocks?: unknown[] }[] }
      expect(doc?.blocks?.length, slug).toBeGreaterThanOrEqual(4)
    }
  })
})

test.describe.serial('жариялау ағыны (әкімші API)', () => {
  let token = ''
  let adminId: string | number = ''
  let pageId: string | number = ''
  let skip = ''

  const auth = () => ({ Authorization: `JWT ${token}` })
  const publicCount = async () => {
    const anon = await playwrightRequest.newContext({ baseURL })
    try {
      const response = await anon.get(`/api/pages?limit=1&depth=0&locale=kk&where[path][equals]=${testPath}`)
      return ((await response.json()) as { totalDocs: number }).totalDocs
    } finally {
      await anon.dispose()
    }
  }

  test.beforeAll(async ({ request }) => {
    const password = `Tmp-${Math.random().toString(36).slice(2)}-${Date.now()}Aa1!`
    const response = await request.post('/api/admins/first-register', {
      data: { email: `e2e-${Date.now()}@example.test`, password, name: 'E2E Publish Flow', roles: ['content-manager'] },
    })
    if (!response.ok()) {
      skip = `Әкімші бар немесе first-register жабық (${response.status()}): жариялау ағыны тесті өткізілмеді`
      return
    }
    const body = (await response.json()) as { token: string; user: { id: string | number } }
    token = body.token
    adminId = body.user.id
  })

  test.afterAll(async ({ request }) => {
    if (!token) return
    if (pageId !== '') await request.delete(`/api/pages/${pageId}?force=true`, { headers: auth() })
    await request.delete(`/api/admins/${adminId}`, { headers: auth() })
  })

  test('жобалама жария API-да көрінбейді, жарияланғаннан кейін көрінеді, қайтарғанда жасырылады', async ({ request }) => {
    test.skip(Boolean(skip), skip)

    const created = await request.post('/api/pages?draft=true&locale=kk', {
      headers: auth(),
      data: { path: testPath, section: 'about', title: 'E2E жариялау ағыны', _status: 'draft' },
    })
    expect(created.ok(), await created.text()).toBe(true)
    pageId = ((await created.json()) as { doc: { id: string | number } }).doc.id

    expect(await publicCount()).toBe(0)

    const published = await request.patch(`/api/pages/${pageId}?locale=kk`, { headers: auth(), data: { _status: 'published' } })
    expect(published.ok(), await published.text()).toBe(true)
    expect(await publicCount()).toBe(1)

    // draft=true көрсетілмесе, _status: 'draft' жарияланған жазбаны жариялаудан алады (unpublish)
    const unpublished = await request.patch(`/api/pages/${pageId}?locale=kk`, { headers: auth(), data: { _status: 'draft' } })
    expect(unpublished.ok(), await unpublished.text()).toBe(true)
    expect(await publicCount()).toBe(0)
  })
})
