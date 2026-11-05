import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { zh } from '@payloadcms/translations/languages/zh'
import { buildConfig, type Config } from 'payload'
import sharp from 'sharp'

import { Admins } from './collections/Admins'
import { Albums } from './collections/Albums'
import { CoiDeclarations } from './collections/CoiDeclarations'
import { DataroomFiles } from './collections/DataroomFiles'
import { DataroomLog } from './collections/DataroomLog'
import { Documents } from './collections/Documents'
import { Events } from './collections/Events'
import { Investors } from './collections/Investors'
import { Matches } from './collections/Matches'
import { Media } from './collections/Media'
import { Ndas } from './collections/Ndas'
import { News } from './collections/News'
import { Organizations } from './collections/Organizations'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { People } from './collections/People'
import { Projects } from './collections/Projects'
import { Agreements, Issues, Members } from './collections/Registry'
import { Scorecards } from './collections/Scorecards'
import { Services } from './collections/Services'
import { Submissions } from './collections/Submissions'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { Home } from './globals/Home'
import { KpiTargets } from './globals/KpiTargets'
import { ScoringConfig } from './globals/ScoringConfig'
import { Settings } from './globals/Settings'
import { kk } from './i18n/admin-kk'
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
    components: {
      graphics: {
        Logo: '@/components/admin/AdminBrand#AdminLogo',
        Icon: '@/components/admin/AdminBrand#AdminIcon',
      },
    },
  },
  collections: [
    Admins,
    Users,
    Media,
    Pages,
    People,
    Services,
    Projects,
    News,
    Events,
    Videos,
    Albums,
    Partners,
    Documents,
    Submissions,
    // Инвестициялық модуль (ТТ 8, 13.3)
    Organizations,
    Investors,
    Scorecards,
    CoiDeclarations,
    Matches,
    Ndas,
    DataroomFiles,
    DataroomLog,
    Agreements,
    Members,
    Issues,
  ],
  globals: [Home, Settings, KpiTargets, ScoringConfig],
  editor: lexicalEditor(),
  // Контент 4 тілде. Аударма жоқ жерде қазақша мәтін fallback болып көрінбейді (fallback: false).
  localization: {
    locales: locales.map((code) => ({ code, label: localeMeta[code].label })),
    defaultLocale,
    fallback: false,
  },
  // Әкімшілік интерфейсі төрт тілде (NIGHT_TASK 3.4). Payload-та kk жоқ, сондықтан өз аудармамыз (src/i18n/admin-kk.ts).
  // Payload Accept-Language ішінен тек өз тізіміндегі тілдерді таниды (kk жоқ), сондықтан kk әдепкі (fallback) болады:
  // ru/en/zh браузері өз тілін алады, қалғаны және cookie-сіз қонақ қазақша көреді. Тіл «Аккаунт» бетінде ауысады (payload-lng cookie).
  i18n: {
    // 'kk' Payload-тың AcceptedLanguages типінде жоқ, бірақ жұмыс уақытында кез келген кілт қабылданады
    supportedLanguages: { kk, ru, en, zh } as unknown as NonNullable<Config['i18n']>['supportedLanguages'],
    fallbackLanguage: 'kk' as unknown as NonNullable<Config['i18n']>['fallbackLanguage'],
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
