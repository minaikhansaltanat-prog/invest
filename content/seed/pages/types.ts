import type { T } from '../lib'

// Ішкі беттердің контент схемасы (ТТ 7). Бет = тақырып + бір сөйлемдік сипаттама + блоктар + соңғы CTA.
// Әр мәтін `t(kk, ru, en, zh)` арқылы төрт тілде бірден жазылады. Блоктарды сайт `PageRenderer` көрсетеді.

/** Блоктарда қолданылатын иконка атаулары (src/components/ui/icons.tsx) */
export type PageIcon =
  | 'globe'
  | 'layers'
  | 'shield-check'
  | 'factory'
  | 'chart'
  | 'columns'
  | 'compass'
  | 'leaf'
  | 'document'
  | 'shield'
  | 'calendar'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'user'
  | 'eye'
  | 'sparkle'
  | 'lock'
  | 'video'
  | 'image'
  | 'wechat'
  | 'check'
  | 'alert'
  | 'info'

export type PageSection =
  | 'about'
  | 'services'
  | 'investors'
  | 'projects'
  | 'membership'
  | 'results'
  | 'partners'
  | 'media'
  | 'contacts'
  | 'legal'

export type SeedBlock =
  /** Абзацтар: бос жолмен бөлінген абзацтар, `- ` белгісімен басталған жолдар тізім болады, `**қалың**` қолдауға ие */
  | { type: 'paragraphs'; heading?: T; lead?: T; text: T }
  /** Карточкалар торы: 2, 3 немесе 4 баған */
  | {
      type: 'cards'
      heading?: T
      lead?: T
      columns?: 2 | 3 | 4
      items: { title: T; text: T; icon?: PageIcon; href?: string; badge?: T }[]
    }
  /** Нөмірленген қадамдар (сызба): процесс, кезеңдер */
  | { type: 'steps'; heading?: T; lead?: T; items: { title: T; text: T; meta?: T }[] }
  /** Белгі-мән торы: мерзімдер, реквизиттер, негізгі фактілер */
  | { type: 'facts'; heading?: T; items: { label: T; value: T }[] }
  /** Жиі қойылатын сұрақтар (аккордеон) */
  | { type: 'faq'; heading?: T; items: { q: T; a: T }[] }
  /** Кесте: баған атаулары және жолдар (әр ұяшық мәтін) */
  | { type: 'table'; heading?: T; caption: T; columns: T[]; rows: T[][] }
  /** Ескертпе: info (ақпарат), caution (мұқият болыңыз), legal (құқықтық жауапкершілікті шектеу) */
  | { type: 'notice'; tone: 'info' | 'caution' | 'legal'; title?: T; text: T }
  /** Сілтемелер тізімі: байланысты беттер */
  | { type: 'links'; heading?: T; items: { label: T; href: string; text?: T }[] }

export type SeedCta = { title: T; text: T; label: T; href: string }

export type SeedPage = {
  /** Тілсіз жол: '/about/mission' (слагтар барлық тілде бірдей, ағылшынша) */
  path: string
  section: PageSection
  title: T
  /** Бір сөйлемдік сипаттама: бет тақырыбы жолағында және meta description */
  description: T
  blocks: SeedBlock[]
  cta?: SeedCta
}

/** Қызмет бетінің толық мазмұны (slug бойынша): not Payload `services` жазбасына блок ретінде егіледі */
export type ServiceDetailSeed = {
  blocks: SeedBlock[]
  cta?: SeedCta
}
