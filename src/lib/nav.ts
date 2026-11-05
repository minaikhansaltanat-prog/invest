// Навигация құрылымы (ТТ 5): жоғарғы мәзірде 7 тармақ және «Өтініш беру». Слагтар барлық тілде бірдей (ағылшынша).
// Белгілер messages/*.json ішінде: nav.<key> және nav.sub.<key>.<item>. Қызметтердің ішкі тізімі Payload-тан келеді.

export type NavSubItem = { id: string; href: string }

export type NavSection = {
  key: 'about' | 'services' | 'investors' | 'projects' | 'membership' | 'media' | 'contacts'
  href: string
  /** messages ішіндегі nav.sub.<key> топтарының тармақтары (services үшін динамикалық) */
  children?: NavSubItem[]
}

export const navSections: NavSection[] = [
  {
    key: 'about',
    href: '/about',
    children: [
      { id: 'aboutUs', href: '/about' },
      { id: 'mission', href: '/about/mission' },
      { id: 'governance', href: '/about/governance' },
      { id: 'people', href: '/about/people' },
      { id: 'documents', href: '/about/documents' },
      { id: 'reports', href: '/about/reports' },
      { id: 'ethics', href: '/about/ethics' },
      { id: 'results', href: '/results' },
      { id: 'partners', href: '/partners' },
    ],
  },
  { key: 'services', href: '/services', children: [] },
  {
    key: 'investors',
    href: '/investors',
    children: [
      { id: 'path', href: '/investors' },
      { id: 'china', href: '/investors/china' },
      { id: 'gulf', href: '/investors/gulf' },
      { id: 'global', href: '/investors/global' },
      { id: 'climate', href: '/investors/climate' },
      { id: 'handbook', href: '/investors/handbook' },
      { id: 'apply', href: '/investors/apply' },
    ],
  },
  {
    key: 'projects',
    href: '/projects',
    children: [
      { id: 'catalog', href: '/projects' },
      { id: 'submit', href: '/projects/submit' },
      { id: 'levels', href: '/projects/levels' },
    ],
  },
  {
    key: 'membership',
    href: '/membership',
    children: [
      { id: 'categories', href: '/membership' },
      { id: 'benefits', href: '/membership/benefits' },
      { id: 'terms', href: '/membership/terms' },
      { id: 'apply', href: '/membership/apply' },
      { id: 'registry', href: '/membership/registry' },
    ],
  },
  {
    key: 'media',
    href: '/media',
    children: [
      { id: 'news', href: '/media/news' },
      { id: 'events', href: '/media/events' },
      { id: 'video', href: '/media/video' },
      { id: 'photo', href: '/media/photo' },
      { id: 'press', href: '/media/press' },
      { id: 'analytics', href: '/media/analytics' },
    ],
  },
  { key: 'contacts', href: '/contacts' },
]

/** Клиентке берілетін, дайын белгілері бар мәзір тармағы */
export type ResolvedNavItem = {
  key: NavSection['key']
  label: string
  href: string
  children: { id: string; label: string; href: string }[]
}

export const isActivePath = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
