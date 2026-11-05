/**
 * Аударма аудиті: messages/*.json мен content/seed ішіндегі барлық мәтінді төрт тілде тексереді.
 * Іске қосу: `npm run audit:translations` (консольға қорытынды; ашық белгі болса, шығу коды 1)
 * немесе `npm run audit:translations -- --write` (docs/TRANSLATION_GAPS.md ішіндегі автоматты бөлімді жаңартады).
 * Дәл емес (эвристика): нәтиже тізімді қолмен қарап шығуға арналған, сондықтан белгілі ерекшеліктер (атаулар, қысқартулар) `accepted` тізімінде.
 */
import fs from 'node:fs'
import path from 'node:path'

import { kpiSeed, newsSeed, peopleSeed, projectsSeed, scoringSeed, servicesSeed, settingsSeed } from '../content/seed/data'
import { homeSeed } from '../content/seed/home'
import { T } from '../content/seed/lib'
import { allPagesSeed, servicesDetailSeed } from '../content/seed/pages'

type Locale = 'kk' | 'ru' | 'en' | 'zh'
type Values = Record<Locale, string>
type Entry = { source: string; values: Values }
type Issue = { code: string; source: string; locale: Locale; text: string; value: string }

const locales: Locale[] = ['kk', 'ru', 'en', 'zh']
const root = process.cwd() // npm скрипті жоба түбірінен іске қосылады

// --- Жиналатын мәтіндер -----------------------------------------------------------------------

function walkSeed(value: unknown, trail: string, out: Entry[]) {
  if (value instanceof T) {
    out.push({ source: trail, values: { kk: value.kk, ru: value.ru, en: value.en, zh: value.zh } })
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => walkSeed(item, `${trail}[${index}]`, out))
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) walkSeed(child, trail ? `${trail}.${key}` : key, out)
  }
}

function flatten(value: unknown, trail: string, out: Map<string, string>) {
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flatten(child, trail ? `${trail}.${key}` : key, out)
  } else out.set(trail, String(value))
}

function collect(): { messages: Entry[]; seed: Entry[]; missingKeys: string[] } {
  const bundles = Object.fromEntries(
    locales.map((locale) => {
      const map = new Map<string, string>()
      flatten(JSON.parse(fs.readFileSync(path.join(root, 'messages', `${locale}.json`), 'utf8')), '', map)
      return [locale, map]
    }),
  ) as Record<Locale, Map<string, string>>
  const keys = new Set(locales.flatMap((locale) => [...bundles[locale].keys()]))
  const missingKeys: string[] = []
  const messages: Entry[] = []
  for (const key of [...keys].sort()) {
    const missing = locales.filter((locale) => !bundles[locale].has(key))
    if (missing.length > 0) missingKeys.push(`messages ${key}: жоқ тілдер ${missing.join(', ')}`)
    messages.push({ source: `messages ${key}`, values: Object.fromEntries(locales.map((locale) => [locale, bundles[locale].get(key) ?? ''])) as Values })
  }

  const seed: Entry[] = []
  const sources: [string, unknown][] = [
    ['seed:settings', settingsSeed],
    ['seed:kpi', kpiSeed],
    ['seed:scoring', scoringSeed],
    ['seed:services', servicesSeed],
    ['seed:services-detail', servicesDetailSeed],
    ['seed:projects', projectsSeed],
    ['seed:news', newsSeed],
    ['seed:people', peopleSeed],
    ['seed:home', homeSeed],
  ]
  for (const [name, data] of sources) walkSeed(data, name, seed)
  for (const page of allPagesSeed) walkSeed(page, `seed:page ${page.path}`, seed)
  return { messages, seed, missingKeys }
}

// --- Эвристика --------------------------------------------------------------------------------

const KK_SPECIAL = /[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/
const CYRILLIC = /[Ѐ-ӿ]/
const LATIN = /[A-Za-z]/
const HAN = /[一-鿿]/
// Қазақ тілінде жеке сөз ретінде кездеспейтін орыс шылаулары
const RU_FUNC = /(?:^|[\s(«"“,;:])(и|в|на|для|по|что|как|при|или|из|за|это|все|об|со|под|между|через)(?=$|[\s)»"”,.;:!?])/i
const LATIN_PHRASE = /[A-Za-z]{2,}(?:[ -][A-Za-z]{2,}){1,}/

/** Қазақша мәтін ішіндегі өнім мен ұйым атаулары (аудармайды) */
const brands = /Google (?:Authenticator|Analytics|Fonts|Maps)|Microsoft Authenticator|Aegis|reCAPTCHA|Kazakh Invest|New Level Pro/g

/** Төмендегі мәтіндер барлық тілде бірдей жазылады (атау, қысқарту, белгі): сүзгіден өтеді */
const allow = (text: string): boolean => {
  const clean = text.replace(/[*\\n]/g, ' ').trim()
  if (clean.length < 4) return true
  if (!/\p{L}/u.test(clean)) return true
  if (/^(https?:|mailto:|tel:|\/)/.test(clean)) return true
  if (/^[A-Z0-9 .,&+/()·-]+$/.test(clean)) return true // қысқартулар (EPC+F, BOT)
  return false
}

/**
 * Қолмен қаралып, қабылданған ерекшеліктер: мәтін дәл осылай жазылуы тиіс.
 * Бұл жолдар "ашық" тізімге түспейді, бірақ docs/TRANSLATION_GAPS.md ішінде санатымен көрсетіледі.
 */
const accepted = new Map<string, string>([
  // Орыс тілімен бірдей жазылатын, қазақ тілінде де осы күйінде қолданылатын сөздер мен атаулар
  ...['Телефон', 'Медиа', 'Фотогалерея', 'Каталог', 'Аналитика', 'Стратегия', 'Онлайн', 'Модель', 'Энергетика', 'Логистика', 'Ревизор', 'Декларация', 'Оператор', 'Корея', 'Сайт', 'Логотип', 'Медиакит', 'Карта', 'Фото', 'Астана · Алматы', '{amount} млн $'].map((text) => [text, 'ортақ кірме сөз не атау'] as [string, string]),
  // Бренд, өнім атауы, ауыспалы шаблон
  ['© {year} {name}', 'шаблон (атау ауыспалы)'],
  ['WeChat', 'өнім атауы'],
  ['Kazakhstan Association of Foreign Capital', 'ағылшынша ресми атау (бренд тақырыпшасы)'],
  ['KZ · RU · EN · 中文', 'тіл кодтарының тізімі'],
  // Қазақ әріптері кездеспейтін, бірақ қазақша мәтін (қолмен тексерілген)
  ...['2FA коды (6 сан)', 'Осы сессияда расталды', 'Аналитика мен зерттеулер', 'Шарттар мен жарналар', 'Басты бетке оралу', 'Бюджет, ТЭН, орналасу орны, кесте', 'NDA, сапар, шарттар', 'Комплаенс бойынша вето:', 'Ресми шарт бойынша', 'Осы бет не туралы', 'Ниет сомасы инвестиция емес', 'Жеке кабинет ашу'].map((text) => [text, 'қазақша, арнайы әріпсіз (қолмен тексерілген)'] as [string, string]),
])

const words = (text: string) => text.replace(/[*\\]n?/g, ' ').split(/\s+/).filter((w) => /\p{L}/u.test(w))

function check(source: string, v: Values): Issue[] {
  const issues: Issue[] = []
  const add = (code: string, locale: Locale, note = '') => issues.push({ code, source, locale, text: `${note}${v[locale]}`, value: v[locale] })
  for (const locale of locales) if (v[locale].trim() === '') add('бос', locale)

  const kk = v.kk
  if (kk.trim() && !allow(kk)) {
    const w = words(kk)
    if (CYRILLIC.test(kk) && w.length >= 3 && !KK_SPECIAL.test(kk)) add('kk: орысша болуы мүмкін (қазақ әріптері жоқ)', 'kk')
    else if (RU_FUNC.test(kk)) add('kk: орысша шылау бар', 'kk')
    if (!CYRILLIC.test(kk) && LATIN.test(kk) && w.length >= 2) add('kk: ағылшынша мәтін', 'kk')
    else if (CYRILLIC.test(kk) && LATIN_PHRASE.test(kk.replace(brands, ' ').replace(/\b[A-Z]{2,}[A-Za-z]*\b/g, ' '))) add('kk: ағылшынша тіркес ішінде', 'kk')
    if (kk === v.ru) add('kk = ru (аударылмаған)', 'kk')
    if (kk === v.en) add('kk = en (аударылмаған)', 'kk')
  }
  const ru = v.ru
  if (ru.trim() && !allow(ru)) {
    if (KK_SPECIAL.test(ru)) add('ru: қазақ әріптері бар', 'ru')
    if (!CYRILLIC.test(ru) && LATIN.test(ru) && words(ru).length >= 2) add('ru: ағылшынша мәтін', 'ru')
    if (ru === v.en) add('ru = en', 'ru')
  }
  const en = v.en
  if (en.trim() && !allow(en)) {
    if (CYRILLIC.test(en)) add('en: кирилл әріптері бар', 'en')
    if (en === v.ru) add('en = ru', 'en')
  }
  const zh = v.zh
  if (zh.trim() && !allow(zh)) {
    if (!HAN.test(zh)) add('zh: иероглиф жоқ (аударылмаған)', 'zh')
    else if (CYRILLIC.test(zh) && words(zh.replace(HAN, ' ')).some((x) => CYRILLIC.test(x))) add('zh: кирилл әріптері бар', 'zh')
  }
  // Ұзындық қатынасы ru-ге қарағанда: тым қысқа не тым ұзын аударма қысқартылған немесе қате болуы мүмкін
  const len = (s: string) => s.replace(/s+/g, ' ').trim().length
  if (len(v.ru) > 60) {
    const ratio = (locale: Locale) => len(v[locale]) / len(v.ru)
    const bad = (locale: Locale, min: number, max: number) => v[locale].trim() !== '' && (ratio(locale) < min || ratio(locale) > max)
    if (bad('kk', 0.5, 2.2)) add('kk: ұзындығы ru-ден тым өзгеше', 'kk', `[${ratio('kk').toFixed(2)}] `)
    if (bad('en', 0.5, 2.0)) add('en: ұзындығы ru-ден тым өзгеше', 'en', `[${ratio('en').toFixed(2)}] `)
    if (bad('zh', 0.12, 1.2)) add('zh: ұзындығы ru-ден тым өзгеше', 'zh', `[${ratio('zh').toFixed(2)}] `)
  }
  return issues
}

// --- Нәтиже -----------------------------------------------------------------------------------

const { messages, seed, missingKeys } = collect()
const all = [...messages, ...seed]
const issues = all.flatMap((entry) => check(entry.source, entry.values))
const open = issues.filter((issue) => !accepted.has(issue.value.trim()))
const known = issues.filter((issue) => accepted.has(issue.value.trim()))

const excerpt = (text: string) => text.replace(/\s+/g, ' ').slice(0, 90).replace(/\|/g, '/')
const countByCode = (list: Issue[]) => {
  const map = new Map<string, number>()
  for (const item of list) map.set(item.code, (map.get(item.code) ?? 0) + 1)
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

const summary: string[] = []
summary.push(`Тексерілген мәтін: ${messages.length} интерфейс кілті, ${seed.length} seed мәтіні (әрқайсысы 4 тілде).`)
summary.push(`Тілдер арасында жоқ кілт: ${missingKeys.length}. Бос мән: ${issues.filter((i) => i.code === 'бос').length}.`)
summary.push(`Эвристика белгісі: ${issues.length}, оның ${known.length} қолмен қаралып қабылданған, ашық: ${open.length}.`)
for (const [code, count] of countByCode(open)) summary.push(`- ашық, ${code}: ${count}`)
console.log(summary.join('\n'))
for (const issue of open) console.log(`  ${issue.code} | ${issue.source} [${issue.locale}] | ${excerpt(issue.text)}`)
for (const key of missingKeys) console.log(`  жоқ кілт | ${key}`)

if (process.argv.includes('--write')) {
  // Қабылданған ерекшеліктер: мәтін бойынша топтап, қай жерде кездесетінін санайды
  const byText = new Map<string, { reason: string; where: Set<string> }>()
  for (const item of known) {
    const key = item.value.trim()
    const entry = byText.get(key) ?? { reason: accepted.get(key) ?? '', where: new Set<string>() }
    entry.where.add(`${item.source.replace(/\|/g, '/')} [${item.locale}]`)
    byText.set(key, entry)
  }
  const acceptedRows = [...byText.entries()]
    .sort((a, b) => a[1].reason.localeCompare(b[1].reason) || a[0].localeCompare(b[0]))
    .map(([text, entry]) => `| ${excerpt(text)} | ${entry.reason} | ${entry.where.size} |`)
  const openRows = open.map((item) => `| ${item.code} | ${item.source.replace(/\|/g, '/')} [${item.locale}] | ${excerpt(item.text)} |`)
  const block = [
    '<!-- audit:start -->',
    `Соңғы жүргізу нәтижесі (\`npm run audit:translations -- --write\`):`,
    '',
    ...summary.map((line) => (line.startsWith('- ') ? line : `${line}  `)),
    '',
    '### Ашық белгілер',
    '',
    open.length === 0 && missingKeys.length === 0 ? 'Жоқ.' : ['| Белгі | Қайда | Мәтін |', '| --- | --- | --- |', ...openRows, ...missingKeys.map((k) => `| жоқ кілт | ${k} | |`)].join('\n'),
    '',
    '### Қолмен қаралып, қабылданған ерекшеліктер',
    '',
    'Бұл жолдар тілдер арасында әдейі бірдей жазылады (кірме сөз, атау, шаблон) не қазақ әріптерінсіз жазылған қазақша мәтін.',
    '',
    '| Мәтін | Себеп | Орын саны |',
    '| --- | --- | --- |',
    ...acceptedRows,
    '<!-- audit:end -->',
  ].join('\n')
  const target = path.join(root, 'docs', 'TRANSLATION_GAPS.md')
  const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : ''
  const marked = /<!-- audit:start -->[\s\S]*<!-- audit:end -->/
  fs.writeFileSync(target, marked.test(existing) ? existing.replace(marked, () => block) : `${existing}${existing ? '\n' : ''}${block}\n`)
  console.log('docs/TRANSLATION_GAPS.md жаңартылды')
}
if (open.length > 0 || missingKeys.length > 0) process.exitCode = 1
