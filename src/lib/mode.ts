// Портал режимі: ЖАЛҒЫЗ осы файл `PORTAL_MODE` айнымалысын оқиды (docs/CORPORATE_MODE.md).
//   corporate (әдепкі): қарапайым корпоративтік сайт + қарапайым әкімші панелі. Инвестициялық модуль жасырылады.
//   full: инвестициялық порталдың толық нұсқасы (git тегі full-v1 сияқты).
// Жасырылатын нәрсе кодта, дерекқорда, миграцияда және тесттерде сақталады: тек маршрут, мәзір, басты бет және админка көрінісі өзгереді.

export type PortalMode = 'corporate' | 'full'

/** Режимді әр шақыруда оқиды (тесттерде айнымалыны ауыстыруға болады); белгісіз мән corporate болады */
export const portalMode = (): PortalMode => (process.env.PORTAL_MODE?.trim().toLowerCase() === 'full' ? 'full' : 'corporate')
export const isCorporate = (): boolean => portalMode() === 'corporate'
export const isFull = (): boolean => portalMode() === 'full'

const LOCALE_PREFIX = /^\/(kk|ru|en|zh)(?=\/|$)/

/** Жолды тілсіз, query/hash-сыз және соңғы көлбеу сызықсыз қалыпқа келтіреді: `/kk/projects/?a=1#b` -> `/projects` */
export function normalizePath(input: string): string {
  const [raw = ''] = input.split(/[?#]/)
  const path = raw.replace(LOCALE_PREFIX, '').replace(/\/+$/, '')
  return path === '' ? '/' : path
}

/** Түбірі мен барлық ішкі жолы жасырылатын бөлімдер: инвесторлар, жобалар каталогы, нәтиже ашықтығы, жеке кабинет */
const hiddenSections = ['/investors', '/projects', '/results', '/account']
/** Жеке жасырылатын беттер: мүшелік өтініші мен мүшелер тізілімі (тіркелудің қоғамдық бастамасы жоқ) */
const hiddenPages = ['/membership/apply', '/membership/registry']
/** Жасырылған бөлім ішінде ашық қалатын жол: әкімшіге 2FA қосу/растау беті (`/admin` қақпасы осында бағыттайды) */
const alwaysOpen = ['/account/2fa']

/** Corporate режимінде бұл жол жасырылатын ба (режимге қарамай, таза функция) */
export function isHiddenPath(path: string): boolean {
  const p = normalizePath(path)
  if (alwaysOpen.includes(p)) return false
  if (hiddenPages.includes(p)) return true
  return hiddenSections.some((root) => p === root || p.startsWith(`${root}/`))
}

/** Ағымдағы режимде жол көрінеді ме (full режимінде бәрі көрінеді) */
export const isPathVisible = (path: string): boolean => !isCorporate() || !isHiddenPath(path)

const isExternal = (href: string) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

/** Мазмұндағы сілтеме көрінсе, өзін қайтарады; жасырын жолға апарса, null (сыртқы сілтеме мен `#якорь` әрқашан көрінеді) */
export function visibleHref(href: string | null | undefined): string | null {
  if (!href) return null
  if (isExternal(href) || href.startsWith('#')) return href
  return isPathVisible(href) ? href : null
}

/** Corporate режимінде ашық қалатын `/api/portal/*` маршруттары: байланыс формасы (+ALTCHA) және әкімші 2FA/шығу */
const openPortalApi = ['/api/portal/forms/contact', '/api/portal/altcha', '/api/portal/2fa', '/api/portal/logout']

/** Corporate режимінде бұл API жолы жасырылатын ба: `/api/portal/*` ішінен ашық тізімнен басқасы */
export function isHiddenApi(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '')
  if (!p.startsWith('/api/portal/') && p !== '/api/portal') return false
  return !openPortalApi.includes(p)
}

/** Corporate режимінде формалар: тек байланыс формасы */
export const formKindEnabled = (kind: string): boolean => !isCorporate() || kind === 'contact'
