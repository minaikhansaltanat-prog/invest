import { type CollectionBeforeChangeHook, type CollectionConfig, ValidationError } from 'payload'

import { hasAdminRole } from '@/access'
import { contentEditors } from '@/access'
import { defaultLocale } from '@/i18n/config'

// Рөлдер: аудармашы (ТТ 10.1: «тек аударма өрістері мен аударма кезегі»). Аудармашы контентті тек әдепкі емес тілде өзгерте алады:
// қазақша түпнұсқа қорғалған. Контент рөлі (контент-менеджер, хатшылық, төраға) барлық тілде өзгертеді.
const translatorLocaleGuard: CollectionBeforeChangeHook = ({ data, req, collection }) => {
  const isEditor = hasAdminRole(req, ...contentEditors)
  if (!isEditor && hasAdminRole(req, 'translator') && (!req.locale || req.locale === defaultLocale)) {
    throw new ValidationError({
      collection: collection.slug,
      errors: [{ path: 'locale', message: 'Translators can edit only non-default language versions.' }],
    })
  }
  return data
}

/** Контент жинағына аудармашыға өзгерту құқығын (қорғалған) қосады */
export const withTranslator = (collection: CollectionConfig): CollectionConfig => {
  const update = collection.access?.update
  return {
    ...collection,
    access: {
      ...collection.access,
      update: async (args) => {
        if (hasAdminRole(args.req, 'translator')) return true
        return typeof update === 'function' ? update(args) : false
      },
    },
    hooks: { ...collection.hooks, beforeChange: [translatorLocaleGuard, ...(collection.hooks?.beforeChange ?? [])] },
  }
}
