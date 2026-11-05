import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { zh } from '@payloadcms/translations/languages/zh'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { defaultLocale, localeMeta, locales } from './i18n/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProd = process.env.NODE_ENV === 'production'

// `.env` болмаса, әзірлеу ортасында ашық placeholder қолданылады. Өндірісте бос болса, іске қосу тоқтайды.
const secret = process.env.PAYLOAD_SECRET || (isProd ? '' : 'dev-only-placeholder-not-a-secret')
const connectionString =
  process.env.DATABASE_URL || (isProd ? '' : 'postgresql://kfca:kfca@127.0.0.1:54329/kfca')

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | KFCA',
    },
  },
  collections: [Admins, Users, Media],
  editor: lexicalEditor(),
  // Контент 4 тілде. Аударма жоқ жерде қазақша мәтін fallback болып көрінбейді (fallback: false).
  localization: {
    locales: locales.map((code) => ({ code, label: localeMeta[code].label })),
    defaultLocale,
    fallback: false,
  },
  // Әкімшілік интерфейсінің тілдері. Қазақша аударма 3-кезеңде қосылады (Payload-та kk жоқ).
  i18n: {
    supportedLanguages: { en, ru, zh },
    fallbackLanguage: 'ru',
  },
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString,
    },
  }),
  sharp,
  plugins: [],
})
