import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { zh } from '@payloadcms/translations/languages/zh'
import { buildConfig, type CollectionConfig, type Config } from 'payload'
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
import { AuditLog } from './collections/AuditLog'
import { Scorecards } from './collections/Scorecards'
import { Services } from './collections/Services'
import { Submissions } from './collections/Submissions'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { Home } from './globals/Home'
import { KpiTargets } from './globals/KpiTargets'
import { ScoringConfig } from './globals/ScoringConfig'
import { Settings } from './globals/Settings'
import { withAudit } from './hooks/audit'
import { withTranslator } from './hooks/roles'
import { kk } from './i18n/admin-kk'
import { defaultLocale, localeMeta, locales } from './i18n/config'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProd = process.env.NODE_ENV === 'production'

// `.env` болмаса, әзірлеу ортасында ашық placeholder қолданылады. Өндірісте бос болса, іске қосу тоқтайды.
const secret = process.env.PAYLOAD_SECRET || (isProd ? '' : 'dev-only-placeholder-not-a-secret')
const connectionString =
  process.env.DATABASE_URL || (isProd ? '' : 'postgresql://kfca:kfca@127.0.0.1:54329/kfca')

// Vercel: файлсыз (read-only) серверсіз орта, сондықтан медиа Vercel Blob-та сақталады (docs/DEPLOY_VERCEL.md).
// BLOB_READ_WRITE_TOKEN жоқ болса (жергілікті әзірлеу, Docker), плагин өшірулі және файлдар `.data/media` ішінде қалады.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
// Serverless-те әр инстанс аз қосылым ашады (Neon pooler қалғанын басқарады); басқа ортада pg әдепкісі (10)
const poolMax = Number(process.env.DATABASE_POOL_MAX) || (process.env.VERCEL ? 5 : undefined)

// Аудит (ТТ 10.2): барлық жинақтың жасау/өзгерту/өшіру әрекеті журналға түседі (журналдың өзі мен қарау журналы қоспағанда).
// Аудармашы (ТТ 10.1): контент жинақтарында тек әдепкі емес тілдегі нұсқаны өзгерте алады.
const contentSlugs = new Set(['pages', 'news', 'services', 'events', 'videos', 'albums', 'people', 'documents', 'partners'])
const noAudit = new Set(['auditLog', 'dataroomLog', 'media'])
function withCollectionPolicies(collections: CollectionConfig[]): CollectionConfig[] {
  return collections.map((collection) => {
    const translated = contentSlugs.has(collection.slug) ? withTranslator(collection) : collection
    return noAudit.has(collection.slug) ? translated : withAudit(translated)
  })
}

export default buildConfig({
  admin: {
    user: Admins.slug,
    // Әдепкіде Payload аватарды Gravatar-дан жүктейді: әкімші поштасының хэші үшінші жаққа кетеді (дербес деректер) және CSP блоктайды
    avatar: 'default',
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
      // Басқару дашборды (ТТ 10.2): төрт сома бөлек, воронка, мерзімі өткен қадамдар
      beforeDashboard: ['@/components/admin/KpiDashboard#KpiDashboard'],
    },
  },
  // Тәртібі админка навигациясының тәртібін анықтайды: Мазмұн, Медиа, Өтініштер, Жүйе (src/lib/admin-nav.ts).
  // Инвестициялық модуль мен портал қолданушылары (Users) соңында: corporate режимінде жасырын (docs/CORPORATE_MODE.md).
  collections: withCollectionPolicies([
    Pages,
    News,
    Events,
    Services,
    Partners,
    People,
    Documents,
    Albums,
    Videos,
    Media,
    Submissions,
    Admins,
    AuditLog,
    Users,
    // Инвестициялық модуль (ТТ 8, 13.3)
    Projects,
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
  ]),
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
      ...(poolMax ? { max: poolMax } : {}),
    },
    // Миграциялар src/migrations ішінде. Өндірісте `push` өшірулі, схема тек миграциядан келеді:
    // `next start` іске қосылғанда (NODE_ENV=production) күтіп тұрған миграциялар автоматты орындалады.
    // Схема өзгергенде: `npm run payload -- migrate:create <атау>` және нәтиже файлдарын commit-ке қосу (docs/DEPLOY.md).
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      token: blobToken,
      collections: { media: true },
      // `prefix` өрісі схемаға әрқашан қосылады: сұлба Blob бар/жоқ ортада бірдей, миграция бір
      alwaysInsertFields: true,
    }),
  ],
})
