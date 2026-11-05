import { l } from '@/lib/labels'
import { isCorporate } from '@/lib/mode'

/**
 * Әкімші панелінің төрт тобы: «Мазмұн», «Медиа», «Өтініштер», «Жүйе» (docs/CORPORATE_MODE.md).
 * Инвестициялық модульдің жинақтары өз топтарын сақтайды (full режимінде көрінеді).
 */
export const adminGroups = {
  content: l('Мазмұн', 'Контент', 'Content', '内容'),
  media: l('Медиа', 'Медиа', 'Media', '媒体'),
  requests: l('Өтініштер', 'Заявки', 'Requests', '申请'),
  system: l('Жүйе', 'Система', 'System', '系统'),
}

/**
 * `admin.hidden` үшін: corporate режимінде жинақ/глобал админка навигациясынан және маршрутынан жасырылады,
 * ал дерекқорда, миграцияда және API рұқсат ережелерінде сол күйінде қалады. Full режимінде көрінеді.
 */
export const hiddenInCorporate = (): boolean => isCorporate()

/** Corporate режимінде админкада жасырылатын жинақтар мен глобалдар (дерекқорда қалады): тест пен құжатқа арналған тізім */
export const corporateHiddenCollections = [
  'scorecards',
  'investors',
  'matches',
  'ndas',
  'dataroomFiles',
  'dataroomLog',
  'coiDeclarations',
  'organizations',
  'agreements',
  'members',
  'issues',
  'projects',
  'users',
] as const

export const corporateHiddenGlobals = ['scoringConfig', 'kpiTargets'] as const

/** Corporate режимінде көрінетін жинақтар (топтары бойынша) */
export const corporateVisibleCollections = {
  content: ['pages', 'news', 'events', 'services', 'partners', 'people', 'documents'],
  media: ['media', 'albums', 'videos'],
  requests: ['submissions'],
  system: ['admins', 'auditLog'],
} as const

export const corporateVisibleGlobals = { content: ['home'], system: ['settings'] } as const
