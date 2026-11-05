import { redirect } from 'next/navigation'

import type { Locale } from '@/i18n/config'
import { missingTranslationUrl } from '@/lib/translation-notice'

/**
 * Жазбаның осы тілде көрінетін аудармасы жоқ болса, детальді беттен шақырылады (ТТ 11.2):
 * бөтен тілдегі мәтін көрсетілмейді, қолданушы тізім бетіне бағытталады, онда TranslationNotice хабарлама шығарады.
 * pathname: тіл префиксісіз жол, мысалы '/news/forum-2026'.
 */
export function redirectMissingTranslation(locale: Locale, pathname: string): never {
  redirect(missingTranslationUrl(locale, pathname))
}
