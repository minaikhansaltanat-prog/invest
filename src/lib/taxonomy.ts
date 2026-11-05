import { type L4, l } from '@/lib/labels'

// Анықтамалықтар (салалар, өңірлер, модельдер, жоба деңгейлері, кезеңдері). ТТ 10.2 (14. Баптаулар).
// Түнгі нұсқада код ішінде тұрады, барлық белгі 4 тілде. Кейін әкімшілік панельдегі жинаққа ауыстыруға болады.

export type TaxonomyItem<K extends string = string> = { value: K; label: L4 }

const item = <K extends string>(value: K, kk: string, ru: string, en: string, zh: string): TaxonomyItem<K> => ({
  value,
  label: l(kk, ru, en, zh),
})

export const sectors = [
  item('industry', 'Өнеркәсіп', 'Промышленность', 'Industry', '工业'),
  item('mining', 'Тау-кен және металлургия', 'Горнодобыча и металлургия', 'Mining and metallurgy', '矿业与冶金'),
  item('energy', 'Энергетика', 'Энергетика', 'Energy', '能源'),
  item('logistics', 'Логистика', 'Логистика', 'Logistics', '物流'),
  item('agro', 'Агроөнеркәсіп', 'Агропромышленность', 'Agribusiness', '农业综合'),
  item('infrastructure', 'Инфрақұрылым', 'Инфраструктура', 'Infrastructure', '基础设施'),
  item('technology', 'Технология және цифрландыру', 'Технологии и цифровизация', 'Technology and digital', '科技与数字化'),
  item('real-estate', 'Жылжымайтын мүлік', 'Недвижимость', 'Real estate', '房地产'),
  item('other', 'Басқа', 'Другое', 'Other', '其他'),
] as const
export type SectorValue = (typeof sectors)[number]['value']

export const regions = [
  item('astana', 'Астана қаласы', 'город Астана', 'Astana city', '阿斯塔纳市'),
  item('almaty-city', 'Алматы қаласы', 'город Алматы', 'Almaty city', '阿拉木图市'),
  item('shymkent', 'Шымкент қаласы', 'город Шымкент', 'Shymkent city', '奇姆肯特市'),
  item('abai', 'Абай облысы', 'область Абай', 'Abai region', '阿拜州'),
  item('akmola', 'Ақмола облысы', 'Акмолинская область', 'Akmola region', '阿克莫拉州'),
  item('aktobe', 'Ақтөбе облысы', 'Актюбинская область', 'Aktobe region', '阿克托别州'),
  item('almaty', 'Алматы облысы', 'Алматинская область', 'Almaty region', '阿拉木图州'),
  item('atyrau', 'Атырау облысы', 'Атырауская область', 'Atyrau region', '阿特劳州'),
  item('east-kazakhstan', 'Шығыс Қазақстан облысы', 'Восточно-Казахстанская область', 'East Kazakhstan region', '东哈萨克斯坦州'),
  item('zhambyl', 'Жамбыл облысы', 'Жамбылская область', 'Zhambyl region', '江布尔州'),
  item('zhetysu', 'Жетісу облысы', 'область Жетісу', 'Zhetysu region', '七河州'),
  item('west-kazakhstan', 'Батыс Қазақстан облысы', 'Западно-Казахстанская область', 'West Kazakhstan region', '西哈萨克斯坦州'),
  item('karaganda', 'Қарағанды облысы', 'Карагандинская область', 'Karaganda region', '卡拉干达州'),
  item('kostanay', 'Қостанай облысы', 'Костанайская область', 'Kostanay region', '科斯塔奈州'),
  item('kyzylorda', 'Қызылорда облысы', 'Кызылординская область', 'Kyzylorda region', '克孜勒奥尔达州'),
  item('mangystau', 'Маңғыстау облысы', 'Мангистауская область', 'Mangystau region', '曼格斯套州'),
  item('pavlodar', 'Павлодар облысы', 'Павлодарская область', 'Pavlodar region', '巴甫洛达尔州'),
  item('north-kazakhstan', 'Солтүстік Қазақстан облысы', 'Северо-Казахстанская область', 'North Kazakhstan region', '北哈萨克斯坦州'),
  item('turkistan', 'Түркістан облысы', 'Туркестанская область', 'Turkistan region', '突厥斯坦州'),
  item('ulytau', 'Ұлытау облысы', 'область Ұлытау', 'Ulytau region', '乌里套州'),
] as const
export type RegionValue = (typeof regions)[number]['value']

export const projectModels = [
  item('joint-venture', 'Бірлескен кәсіпорын', 'Совместное предприятие', 'Joint venture', '合资企业'),
  item('epc', 'EPC', 'EPC', 'EPC', 'EPC'),
  item('epc-f', 'EPC+F', 'EPC+F', 'EPC+F', 'EPC+F'),
  item('bot', 'BOT', 'BOT', 'BOT', 'BOT'),
  item('ppp', 'МЖӘ', 'ГЧП', 'PPP', 'PPP'),
  item('equity', 'Үлестік қатысу', 'Долевое участие', 'Equity participation', '股权投资'),
  item('other', 'Басқа', 'Другое', 'Other', '其他'),
] as const
export type ProjectModelValue = (typeof projectModels)[number]['value']

// Жоба деңгейлері (ТТ 8.3)
export const projectLevels = [
  item('1', '1-деңгей: Тұжырымдама', 'Уровень 1: Концепция', 'Level 1: Concept', '1级：概念'),
  item('2', '2-деңгей: Алдын ала бағаланған', 'Уровень 2: Предварительно оценён', 'Level 2: Pre-assessed', '2级：已预评估'),
  item('3', '3-деңгей: Инвестицияға дайын', 'Уровень 3: Готов к инвестициям', 'Level 3: Investment-ready', '3级：具备投资条件'),
  item('4', '4-деңгей: Іске асырылуда', 'Уровень 4: В реализации', 'Level 4: In implementation', '4级：实施中'),
] as const
export type ProjectLevelValue = (typeof projectLevels)[number]['value']

// Жобаның 8 кезеңі (ТТ 8.4)
export const projectStages = [
  item('1', '1. Жобаны қабылдау', '1. Приём проекта', '1. Project intake', '1. 项目受理'),
  item('2', '2. Бастапқы іріктеу', '2. Первичный отбор', '2. Initial screening', '2. 初步筛选'),
  item('3', '3. Сараптама', '3. Экспертиза', '3. Expert review', '3. 专家评审'),
  item('4', '4. Инвесторды сәйкестендіру', '4. Подбор инвестора', '4. Investor matching', '4. 投资者匹配'),
  item('5', '5. Келіссөздер', '5. Переговоры', '5. Negotiations', '5. 谈判'),
  item('6', '6. Құрылым және келісу', '6. Структура и согласование', '6. Structuring and agreement', '6. 结构设计与签约'),
  item('7', '7. Іске асыру мониторингі', '7. Мониторинг реализации', '7. Implementation monitoring', '7. 实施监测'),
  item('8', '8. Нәтижені бағалау', '8. Оценка результата', '8. Results assessment', '8. 成果评估'),
] as const
export type ProjectStageValue = (typeof projectStages)[number]['value']

/** Payload select өрісіне арналған options */
export const toOptions = <T extends readonly TaxonomyItem[]>(items: T) =>
  items.map(({ value, label }) => ({ value, label }))

/** Мән бойынша көрсетілетін тілдегі белгіні қайтарады */
export function labelOf(
  items: readonly TaxonomyItem[],
  value: string | null | undefined,
  locale: keyof L4,
): string {
  if (!value) return ''
  return items.find((entry) => entry.value === value)?.label[locale] ?? ''
}
