import { afterEach, describe, expect, it } from 'vitest'

import { formKindEnabled, isCorporate, isHiddenApi, isHiddenPath, isPathVisible, normalizePath, portalMode, visibleHref } from '@/lib/mode'

// Портал режимі (src/lib/mode.ts): corporate әдепкі, full толық нұсқа. Жасырын жолдар тек corporate режимінде жабылады.
const original = process.env.PORTAL_MODE
afterEach(() => {
  if (original === undefined) delete process.env.PORTAL_MODE
  else process.env.PORTAL_MODE = original
})

describe('режимді оқу', () => {
  it('айнымалы жоқ немесе белгісіз болса, corporate', () => {
    delete process.env.PORTAL_MODE
    expect(portalMode()).toBe('corporate')
    for (const value of ['', 'corporate', 'Corporate', 'lite', 'portal', 'ful']) {
      process.env.PORTAL_MODE = value
      expect(portalMode(), value).toBe('corporate')
    }
  })

  it('full тек нақты жазылғанда (регистр мен бос орынға қарамай) қосылады', () => {
    for (const value of ['full', 'FULL', ' full ']) {
      process.env.PORTAL_MODE = value
      expect(portalMode(), value).toBe('full')
      expect(isCorporate(), value).toBe(false)
    }
  })
})

describe('жолды қалыпқа келтіру', () => {
  it('тіл префиксін, query/hash пен соңғы көлбеу сызықты алып тастайды', () => {
    expect(normalizePath('/kk/projects/?a=1#b')).toBe('/projects')
    expect(normalizePath('/zh')).toBe('/')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('/en/about/people')).toBe('/about/people')
    expect(normalizePath('/kkx/about')).toBe('/kkx/about')
  })
})

describe('жасырын жолдар (corporate)', () => {
  const hidden = [
    '/investors', '/investors/apply', '/investors/china', '/investors/handbook',
    '/projects', '/projects/submit', '/projects/levels', '/projects/solar-power-plant-turkistan',
    '/results',
    '/membership/apply', '/membership/registry',
    '/account', '/account/login', '/account/register', '/account/dataroom/12',
    '/kk/account/login', '/ru/projects/x',
  ]
  const open = [
    '/', '/about', '/about/people', '/about/governance', '/about/documents',
    '/services', '/services/market-entry', '/media', '/media/news', '/media/news/some-news', '/media/events', '/media/photo', '/media/video',
    '/partners', '/contacts', '/membership', '/membership/benefits', '/membership/terms',
    '/legal/privacy', '/legal/terms', '/account/2fa', '/kk/account/2fa', '/projectsx', '/investorsx',
  ]

  it('жасырын тізім: инвесторлар, жобалар, нәтижелер, кабинет, мүшелік өтініші мен тізілімі', () => {
    for (const path of hidden) expect(isHiddenPath(path), path).toBe(true)
  })

  it('қалған беттер мен әкімшінің 2FA беті ашық қалады', () => {
    for (const path of open) expect(isHiddenPath(path), path).toBe(false)
  })

  it('isPathVisible: corporate-та жасырын жол көрінбейді, full-да бәрі көрінеді', () => {
    process.env.PORTAL_MODE = 'corporate'
    expect(isPathVisible('/projects')).toBe(false)
    expect(isPathVisible('/about')).toBe(true)
    process.env.PORTAL_MODE = 'full'
    for (const path of hidden) expect(isPathVisible(path), path).toBe(true)
  })
})

describe('мазмұндағы сілтемелер', () => {
  it('visibleHref: жасырын ішкі сілтеме null, сыртқы және якорь сақталады', () => {
    process.env.PORTAL_MODE = 'corporate'
    expect(visibleHref('/investors/apply')).toBeNull()
    expect(visibleHref('/projects?sector=energy')).toBeNull()
    expect(visibleHref('/about')).toBe('/about')
    expect(visibleHref('/contacts#form')).toBe('/contacts#form')
    expect(visibleHref('https://example.kz/projects')).toBe('https://example.kz/projects')
    expect(visibleHref('mailto:info@example.kz')).toBe('mailto:info@example.kz')
    expect(visibleHref('#top')).toBe('#top')
    expect(visibleHref('')).toBeNull()
    expect(visibleHref(null)).toBeNull()
  })

  it('full режимінде барлық ішкі сілтеме қайтарылады', () => {
    process.env.PORTAL_MODE = 'full'
    expect(visibleHref('/investors/apply')).toBe('/investors/apply')
  })
})

describe('API жолдары', () => {
  it('/api/portal/*: байланыс формасы, ALTCHA, 2FA және шығудан басқасы жасырын', () => {
    for (const path of ['/api/portal/register', '/api/portal/account', '/api/portal/nda', '/api/portal/matching', '/api/portal/kpi', '/api/portal/dataroom/1', '/api/portal/dataroom/file/3', '/api/portal/reports/projects', '/api/portal/forms/investor', '/api/portal/forms/project', '/api/portal/forms/membership']) {
      expect(isHiddenApi(path), path).toBe(true)
    }
    for (const path of ['/api/portal/forms/contact', '/api/portal/forms/contact/', '/api/portal/altcha', '/api/portal/2fa', '/api/portal/logout']) {
      expect(isHiddenApi(path), path).toBe(false)
    }
  })

  it('Payload REST пен басқа API жолдарына тиіспейді', () => {
    for (const path of ['/api/pages', '/api/media/file/a.jpg', '/api/admins/login', '/api/projects']) expect(isHiddenApi(path), path).toBe(false)
  })

  it('форма түрлері: corporate-та тек contact, full-да барлығы', () => {
    process.env.PORTAL_MODE = 'corporate'
    expect(formKindEnabled('contact')).toBe(true)
    for (const kind of ['investor', 'project', 'membership']) expect(formKindEnabled(kind), kind).toBe(false)
    process.env.PORTAL_MODE = 'full'
    for (const kind of ['contact', 'investor', 'project', 'membership']) expect(formKindEnabled(kind), kind).toBe(true)
  })
})
