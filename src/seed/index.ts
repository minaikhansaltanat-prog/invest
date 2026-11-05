/**
 * Бастапқы контентті 4 тілде Payload-қа егеді: `npm run seed` (дерекқор жұмыс істеп тұруы тиіс).
 * Қайта іске қосуға болады (idempotent): бар жазбалар slug бойынша жаңартылады.
 * Мәтіндер content/seed/* файлдарынан алынады (түнгі аударма жобасы, тілші тексеруі қажет).
 */
import fs from 'node:fs'
import path from 'node:path'

import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { defaultLocale, type Locale, locales } from '@/i18n/config'

import { kpiSeed, newsSeed, peopleSeed, projectsSeed, scoringSeed, servicesSeed, settingsSeed } from '../../content/seed/data'
import { homeSeed } from '../../content/seed/home'
import { pick, t } from '../../content/seed/lib'

type Data = Record<string, unknown>

const root = process.cwd()
const statuses = { kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' } as const
const otherLocales = locales.filter((code) => code !== defaultLocale)

const log = (message: string) => console.log(`[seed] ${message}`)

async function upsertMedia(
  payload: Payload,
  file: string,
  meta: { alt: ReturnType<typeof t>; credit: string; license: 'own' | 'stock' | 'partner' | 'ai-placeholder' },
) {
  const filename = path.basename(file)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    locale: defaultLocale,
    fallbackLocale: false,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt: meta.alt.kk, credit: meta.credit, license: meta.license },
    filePath: file,
    locale: defaultLocale,
  })
  for (const locale of otherLocales) {
    await payload.update({ collection: 'media', id: doc.id, data: { alt: meta.alt[locale] }, locale })
  }
  log(`медиа: ${filename}`)
  return doc.id
}

/** slug бойынша жасайды немесе жаңартады; әр тілдің мәтіні өз локалінде жазылады */
async function upsertBySlug(
  payload: Payload,
  collection: 'services' | 'projects' | 'news' | 'people',
  slug: string,
  shared: Data,
  perLocale: (locale: Locale) => Data,
) {
  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
    locale: defaultLocale,
    fallbackLocale: false,
  })
  const withStatus = (data: Data) =>
    collection === 'projects' ? data : { ...data, _status: 'published' }

  let id = found.docs[0]?.id
  if (!id) {
    const created = await payload.create({
      collection,
      data: withStatus({ slug, ...shared, ...perLocale(defaultLocale) }) as never,
      locale: defaultLocale,
    })
    id = created.id
  } else {
    await payload.update({
      collection,
      id,
      data: withStatus({ slug, ...shared, ...perLocale(defaultLocale) }) as never,
      locale: defaultLocale,
    })
  }
  for (const locale of otherLocales) {
    await payload.update({ collection, id, data: withStatus(perLocale(locale)) as never, locale })
  }
  log(`${collection}: ${slug}`)
  return id
}

async function main() {
  const payload = await getPayload({ config })

  // ---------- Медиа ----------
  const images = path.join(root, 'src', 'assets', 'images')
  const industryId = await upsertMedia(payload, path.join(images, 'industry_web.jpg'), {
    alt: t(
      'Өнеркәсіптік кешеннің ішкі көрінісі',
      'Интерьер промышленного комплекса',
      'Interior of an industrial complex',
      '工业综合体内部',
    ),
    credit: 'Дизайн үлгісі (AI)',
    license: 'ai-placeholder',
  })
  const baiterekId = await upsertMedia(payload, path.join(images, 'news_baiterek.jpg'), {
    alt: t(
      'Астанадағы Бәйтерек монументі кешке',
      'Монумент Байтерек в Астане вечером',
      'The Baiterek monument in Astana at dusk',
      '黄昏时分的阿斯塔纳拜特列克塔',
    ),
    credit: 'Дизайн үлгісі (AI)',
    license: 'ai-placeholder',
  })

  const person = peopleSeed[0]
  const portraitFile = path.join(root, 'public', 'team', 'zh-portrait.jpg')
  const portraitId = fs.existsSync(portraitFile)
    ? await upsertMedia(payload, portraitFile, {
        alt: person.photoAlt,
        credit: 'Қауымдастыққа клиент берген фото (ZH.jpeg)',
        license: 'own',
      })
    : null
  if (!portraitId) log('Zh фотосы табылмады: монограмма қалдырылады')

  // ---------- Тұлға ----------
  const personId = await upsertBySlug(
    payload,
    'people',
    person.slug,
    {
      group: person.group,
      monogram: person.monogram,
      languages: person.languages,
      order: person.order,
      photoConsent: Boolean(portraitId) && person.photoConsent,
      photoConsentNote: person.photoConsentNote,
      ...(portraitId ? { photo: portraitId } : {}),
      translationStatus: statuses,
    },
    (locale) => ({
      name: person.name[locale],
      position: person.position[locale],
      photoAlt: person.photoAlt[locale],
    }),
  )

  // ---------- Қызметтер ----------
  for (const service of servicesSeed) {
    await upsertBySlug(
      payload,
      'services',
      service.slug,
      {
        number: service.number,
        icon: service.icon,
        highlight: service.highlight,
        translationStatus: statuses,
      },
      (locale) => ({ title: service.title[locale], summary: service.summary[locale] }),
    )
  }

  // ---------- Жобалар (мысал, нақты емес) ----------
  const projectImages: Record<string, number | string> = { 'industry_web.jpg': industryId }
  for (const project of projectsSeed) {
    const imageId = 'image' in project && project.image ? projectImages[project.image] : undefined
    await upsertBySlug(
      payload,
      'projects',
      project.slug,
      {
        sector: project.sector,
        region: project.region,
        amountMusd: project.amountMusd,
        model: project.model,
        level: project.level,
        stage: project.stage,
        ...('iconKey' in project && project.iconKey ? { iconKey: project.iconKey } : {}),
        ...(imageId ? { image: imageId } : {}),
        publishToCatalog: true,
        isSample: true,
        translationStatus: statuses,
      },
      (locale) => ({
        title: project.title[locale],
        summary: project.summary[locale],
        subSector: project.subSector[locale],
      }),
    )
  }

  // ---------- Жаңалықтар (мысал, нақты емес) ----------
  for (const item of newsSeed) {
    await upsertBySlug(
      payload,
      'news',
      item.slug,
      {
        category: item.category,
        publishedAt: `${item.publishedAt}T09:00:00.000Z`,
        featured: item.featured,
        isSample: true,
        ...('image' in item && item.image === 'news_baiterek.jpg' ? { image: baiterekId } : {}),
        translationStatus: statuses,
      },
      (locale) => ({ title: item.title[locale], excerpt: item.excerpt[locale] }),
    )
  }

  // ---------- Глобалдар ----------
  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'settings',
      locale,
      data: {
        ...(pick(settingsSeed, locale) as Data),
        policy: { translationPolicy: 'allow-draft', showExampleBadges: true },
      } as never,
    })
    await payload.updateGlobal({ slug: 'kpiTargets', locale, data: pick(kpiSeed, locale) as never })
    await payload.updateGlobal({ slug: 'scoringConfig', locale, data: pick(scoringSeed, locale) as never })

    const home = pick(homeSeed, locale) as Data & { leadership: Data }
    await payload.updateGlobal({
      slug: 'home',
      locale,
      data: {
        ...home,
        leadership: { ...home.leadership, person: personId },
        translationStatus: statuses,
      } as never,
    })
    log(`глобалдар: ${locale}`)
  }

  log('дайын')
}

// `payload run` модульді import етеді де, одан кейін процесті жабады: сондықтан top-level await қажет
try {
  await main()
} catch (error) {
  console.error('[seed] қате:', error)
  process.exit(1)
}
