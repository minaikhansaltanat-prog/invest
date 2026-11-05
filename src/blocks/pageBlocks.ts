import type { Block, GroupField } from 'payload'

import { group, ltext, ltextarea, rows, select, text } from '@/fields/helpers'
import { l } from '@/lib/labels'

// Ішкі беттердің блоктары (ТТ 7). Құрылым (блок реті, иконка, сілтеме) барлық тілде ортақ, ал мәтін тілге бөлінген.
// Фабрикалар: Payload конфигті өңдегенде өріс объектілерін өзгертеді, сондықтан әр блокқа жаңа объект беріледі.

/** Карточка иконкалары: src/components/ui/icons.tsx ішіндегі атаулармен сәйкес болуы тиіс (unit-тест тексереді) */
export const pageIcons = [
  'globe',
  'layers',
  'shield-check',
  'factory',
  'chart',
  'columns',
  'compass',
  'leaf',
  'document',
  'shield',
  'calendar',
  'phone',
  'mail',
  'pin',
  'user',
  'eye',
  'sparkle',
  'lock',
  'video',
  'image',
  'wechat',
  'check',
  'alert',
  'info',
] as const

export const noticeTones = ['info', 'caution', 'legal'] as const

const heading = () => ltext('heading', l('Тақырып', 'Заголовок', 'Heading', '标题'))
const lead = () => ltext('lead', l('Кіріспе мәтін', 'Вводный текст', 'Lead text', '导语'))
const href = () =>
  text('href', l('Сілтеме', 'Ссылка', 'Link', '链接'), {
    admin: {
      description: l(
        'Ішкі жол тіл префиксісіз жазылады (мысалы, /investors/apply). Сыртқы сілтеме https:// деп басталады.',
        'Внутренний путь пишется без языкового префикса (например, /investors/apply). Внешняя ссылка начинается с https://.',
        'Internal paths are written without a language prefix (for example, /investors/apply). External links start with https://.',
        '内部路径不带语言前缀（例如 /investors/apply）。外部链接以 https:// 开头。',
      ),
    },
  })

const rowLabels = (singular: [string, string, string, string], plural: [string, string, string, string]) => ({
  singular: l(...singular),
  plural: l(...plural),
})

export const pageBlocks = (): Block[] => [
  {
    slug: 'paragraphs',
    labels: {
      singular: l('Абзацтар', 'Абзацы', 'Paragraphs', '段落'),
      plural: l('Абзацтар', 'Абзацы', 'Paragraphs', '段落'),
    },
    fields: [
      heading(),
      lead(),
      ltextarea('text', l('Мәтін', 'Текст', 'Text', '正文'), {
        required: true,
        admin: {
          description: l(
            'Абзацтар бос жолмен бөлінеді. «- » белгісімен басталған жолдар тізім болады. **қалың** мәтін қолдау табады.',
            'Абзацы разделяются пустой строкой. Строки с «- » становятся списком. Поддерживается **жирный** текст.',
            'Separate paragraphs with a blank line. Lines starting with "- " become a list. **Bold** text is supported.',
            '段落以空行分隔。以“- ”开头的行将成为列表。支持**粗体**文字。',
          ),
        },
      }),
    ],
  },
  {
    slug: 'cards',
    labels: {
      singular: l('Карточкалар', 'Карточки', 'Cards', '卡片'),
      plural: l('Карточкалар', 'Карточки', 'Cards', '卡片'),
    },
    fields: [
      heading(),
      lead(),
      select(
        'columns',
        l('Баған саны', 'Число колонок', 'Columns', '列数'),
        [
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
        ],
        { defaultValue: '3' },
      ),
      rows(
        'items',
        l('Карточкалар', 'Карточки', 'Cards', '卡片'),
        rowLabels(['Карточка', 'Карточка', 'Card', '卡片'], ['Карточкалар', 'Карточки', 'Cards', '卡片']),
        [
          ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题'), { required: true }),
          ltextarea('text', l('Мәтін', 'Текст', 'Text', '正文')),
          select(
            'icon',
            l('Иконка', 'Иконка', 'Icon', '图标'),
            pageIcons.map((value) => ({ value, label: value })),
          ),
          href(),
          ltext('badge', l('Белгі', 'Метка', 'Badge', '标记')),
        ],
        { minRows: 1 },
      ),
    ],
  },
  {
    slug: 'steps',
    labels: {
      singular: l('Қадамдар', 'Шаги', 'Steps', '步骤'),
      plural: l('Қадамдар', 'Шаги', 'Steps', '步骤'),
    },
    fields: [
      heading(),
      lead(),
      rows(
        'items',
        l('Қадамдар', 'Шаги', 'Steps', '步骤'),
        rowLabels(['Қадам', 'Шаг', 'Step', '步骤'], ['Қадамдар', 'Шаги', 'Steps', '步骤']),
        [
          ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题'), { required: true }),
          ltextarea('text', l('Мәтін', 'Текст', 'Text', '正文')),
          ltext('meta', l('Қосымша белгі (мерзім, жауапты)', 'Доп. пометка (срок, ответственный)', 'Note (timing, owner)', '附注（期限、负责人）')),
        ],
        { minRows: 1 },
      ),
    ],
  },
  {
    slug: 'facts',
    labels: {
      singular: l('Фактілер торы', 'Сетка фактов', 'Facts grid', '事实表'),
      plural: l('Фактілер торы', 'Сетка фактов', 'Facts grid', '事实表'),
    },
    fields: [
      heading(),
      rows(
        'items',
        l('Фактілер', 'Факты', 'Facts', '事实'),
        rowLabels(['Факт', 'Факт', 'Fact', '事实'], ['Фактілер', 'Факты', 'Facts', '事实']),
        [
          ltext('label', l('Белгі', 'Название', 'Label', '标签'), { required: true }),
          ltext('value', l('Мән', 'Значение', 'Value', '内容'), { required: true }),
        ],
        { minRows: 1 },
      ),
    ],
  },
  {
    slug: 'faq',
    labels: {
      singular: l('Жиі қойылатын сұрақтар', 'Частые вопросы', 'FAQ', '常见问题'),
      plural: l('Жиі қойылатын сұрақтар', 'Частые вопросы', 'FAQ', '常见问题'),
    },
    fields: [
      heading(),
      rows(
        'items',
        l('Сұрақтар', 'Вопросы', 'Questions', '问题'),
        rowLabels(['Сұрақ', 'Вопрос', 'Question', '问题'], ['Сұрақтар', 'Вопросы', 'Questions', '问题']),
        [
          ltext('q', l('Сұрақ', 'Вопрос', 'Question', '问题'), { required: true }),
          ltextarea('a', l('Жауап', 'Ответ', 'Answer', '回答'), { required: true }),
        ],
        { minRows: 1 },
      ),
    ],
  },
  {
    slug: 'table',
    labels: {
      singular: l('Кесте', 'Таблица', 'Table', '表格'),
      plural: l('Кестелер', 'Таблицы', 'Tables', '表格'),
    },
    fields: [
      heading(),
      ltext('caption', l('Кесте атауы (screen reader үшін)', 'Подпись таблицы (для screen reader)', 'Table caption (for screen readers)', '表格标题（供读屏软件使用）'), {
        required: true,
      }),
      rows(
        'columns',
        l('Баған атаулары', 'Заголовки колонок', 'Column headings', '列标题'),
        rowLabels(['Баған', 'Колонка', 'Column', '列'], ['Бағандар', 'Колонки', 'Columns', '列']),
        [ltext('text', l('Атауы', 'Название', 'Heading', '标题'), { required: true })],
        { minRows: 1 },
      ),
      rows(
        'rows',
        l('Жолдар', 'Строки', 'Rows', '行'),
        rowLabels(['Жол', 'Строка', 'Row', '行'], ['Жолдар', 'Строки', 'Rows', '行']),
        [
          rows(
            'cells',
            l('Ұяшықтар (бағандар саны сияқты)', 'Ячейки (по числу колонок)', 'Cells (one per column)', '单元格（与列数相同）'),
            rowLabels(['Ұяшық', 'Ячейка', 'Cell', '单元格'], ['Ұяшықтар', 'Ячейки', 'Cells', '单元格']),
            [ltext('text', l('Мәтін', 'Текст', 'Text', '文字'))],
            { minRows: 1 },
          ),
        ],
        { minRows: 1 },
      ),
    ],
  },
  {
    slug: 'notice',
    labels: {
      singular: l('Ескертпе', 'Примечание', 'Notice', '提示'),
      plural: l('Ескертпелер', 'Примечания', 'Notices', '提示'),
    },
    fields: [
      select(
        'tone',
        l('Түрі', 'Тип', 'Tone', '类型'),
        [
          { value: 'info', label: l('Ақпарат', 'Информация', 'Information', '信息') },
          { value: 'caution', label: l('Назар аударыңыз', 'Обратите внимание', 'Caution', '注意') },
          { value: 'legal', label: l('Құқықтық ескерту', 'Правовое предупреждение', 'Legal notice', '法律声明') },
        ],
        { defaultValue: 'info', required: true },
      ),
      ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题')),
      ltextarea('text', l('Мәтін', 'Текст', 'Text', '正文'), { required: true }),
    ],
  },
  {
    slug: 'links',
    labels: {
      singular: l('Сілтемелер тізімі', 'Список ссылок', 'Link list', '链接列表'),
      plural: l('Сілтемелер тізімі', 'Список ссылок', 'Link list', '链接列表'),
    },
    fields: [
      heading(),
      rows(
        'items',
        l('Сілтемелер', 'Ссылки', 'Links', '链接'),
        rowLabels(['Сілтеме', 'Ссылка', 'Link', '链接'], ['Сілтемелер', 'Ссылки', 'Links', '链接']),
        [
          ltext('label', l('Атауы', 'Название', 'Label', '名称'), { required: true }),
          href(),
          ltext('text', l('Қысқа түсіндірме', 'Краткое пояснение', 'Short description', '简短说明')),
        ],
        { minRows: 1 },
      ),
    ],
  },
]

/** Бет соңындағы шақыру блогы (бір топ өріс, барлық беттер мен қызметтерде бірдей) */
export const ctaGroup = (): GroupField =>
  group('cta', l('Бет соңындағы шақыру (CTA)', 'Призыв в конце страницы (CTA)', 'Closing call to action (CTA)', '页面末尾行动号召（CTA）'), [
    ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题')),
    ltextarea('text', l('Мәтін', 'Текст', 'Text', '正文')),
    ltext('label', l('Батырма мәтіні', 'Текст кнопки', 'Button label', '按钮文字')),
    text('href', l('Батырма сілтемесі', 'Ссылка кнопки', 'Button link', '按钮链接')),
  ])
