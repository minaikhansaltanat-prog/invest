import type { GlobalConfig } from 'payload'

import { checkbox, ltext, ltextarea, rows, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'

const accentHint = l(
  'Алтын түсті бөлікті *жұлдызшамен* белгілеңіз. Жаңа жол: \\n.',
  'Выделите золотую часть *звёздочками*. Перенос строки: \\n.',
  'Mark the gold part with *asterisks*. Line break: \\n.',
  '用 *星号* 标出金色部分。换行：\\n。',
)
const lineHint = l(
  'Жаңа жол (үлкен экранда): \\n.',
  'Перенос строки (на большом экране): \\n.',
  'Line break (on large screens): \\n.',
  '换行（大屏幕）：\\n。',
)
const hrefHint = l(
  'Ішкі сілтеме, мысалы: /investors. Тіл префиксі автоматты қосылады.',
  'Внутренняя ссылка, например: /investors. Языковой префикс добавляется автоматически.',
  'Internal link, e.g. /investors. The language prefix is added automatically.',
  '站内链接，例如 /investors。语言前缀自动添加。',
)

const eyebrow = ltext('eyebrow', l('Белгі (eyebrow)', 'Надпись (eyebrow)', 'Eyebrow', '小标题'))
const sectionTitle = (hint = lineHint) =>
  ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题'), { admin: { description: hint } })

// Басты бет: 14 блоктың мәтіндері. Жобалар, жаңалықтар, қызметтер, KPI, бағалау салмақтары өз жинақтарынан келеді.
export const Home: GlobalConfig = {
  slug: 'home',
  label: l('Басты бет', 'Главная страница', 'Home page', '首页'),
  admin: { group: l('Беттер', 'Страницы', 'Pages', '页面') },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
  },
  versions: { max: 25 },
  fields: [
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: l('Hero', 'Hero', 'Hero', '首屏'),
          fields: [
            eyebrow,
            sectionTitle(accentHint),
            ltextarea('subtitle', l('Сипаттама', 'Описание', 'Subtitle', '副标题')),
            ltext('primaryCtaLabel', l('1-батырма мәтіні', 'Текст кнопки 1', 'Button 1 label', '按钮1文字')),
            text('primaryCtaHref', l('1-батырма сілтемесі', 'Ссылка кнопки 1', 'Button 1 link', '按钮1链接'), {
              admin: { description: hrefHint },
            }),
            ltext('secondaryCtaLabel', l('2-батырма мәтіні', 'Текст кнопки 2', 'Button 2 label', '按钮2文字')),
            text('secondaryCtaHref', l('2-батырма сілтемесі', 'Ссылка кнопки 2', 'Button 2 link', '按钮2链接'), {
              admin: { description: hrefHint },
            }),
            rows(
              'facts',
              l('3 факт', '3 факта', '3 facts', '3项事实'),
              { singular: l('Факт', 'Факт', 'Fact', '事实'), plural: l('Фактілер', 'Факты', 'Facts', '事实') },
              [
                ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题')),
                ltext('text', l('Мәтін', 'Текст', 'Text', '文字')),
              ],
              { minRows: 3, maxRows: 3 },
            ),
          ],
        },
        {
          name: 'audience',
          label: l('Аудитория', 'Аудитория', 'Audience', '受众'),
          fields: [
            rows(
              'cards',
              l('3 карточка', '3 карточки', '3 cards', '3张卡片'),
              { singular: l('Карточка', 'Карточка', 'Card', '卡片'), plural: l('Карточкалар', 'Карточки', 'Cards', '卡片') },
              [
                ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题')),
                ltextarea('text', l('Мәтін', 'Текст', 'Text', '文字')),
                ltext('ctaLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
                text('href', l('Сілтеме', 'Ссылка', 'Link', '链接'), { admin: { description: hrefHint } }),
              ],
              { minRows: 3, maxRows: 3 },
            ),
          ],
        },
        {
          name: 'results',
          label: l('Нәтиже ашықтығы', 'Прозрачность результатов', 'Results transparency', '成果透明'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltextarea('lead', l('Сипаттама', 'Описание', 'Lead', '导语')),
            rows(
              'cells',
              l('4 есеп', '4 отчёта', '4 ledgers', '4本账目'),
              { singular: l('Есеп', 'Отчёт', 'Ledger', '账目'), plural: l('Есептер', 'Отчёты', 'Ledgers', '账目') },
              [
                ltext('label', l('Атауы', 'Название', 'Label', '名称')),
                ltext('description', l('Сипаттама', 'Описание', 'Description', '说明')),
              ],
              { minRows: 4, maxRows: 4 },
            ),
          ],
        },
        {
          name: 'services',
          label: l('Қызметтер', 'Услуги', 'Services', '服务'),
          fields: [eyebrow, sectionTitle(), ltext('linkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字'))],
        },
        {
          name: 'lifecycle',
          label: l('Өмірлік цикл', 'Жизненный цикл', 'Lifecycle', '生命周期'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltextarea('lead', l('Сипаттама', 'Описание', 'Lead', '导语')),
            rows(
              'steps',
              l('8 кезең', '8 этапов', '8 stages', '8个阶段'),
              { singular: l('Кезең', 'Этап', 'Stage', '阶段'), plural: l('Кезеңдер', 'Этапы', 'Stages', '阶段') },
              [
                ltext('title', l('Атауы', 'Название', 'Title', '名称')),
                ltext('text', l('Қысқа сипаттама', 'Краткое описание', 'Short text', '简述')),
                checkbox('done', l('Орындалған деп көрсету', 'Показать как пройденный', 'Show as done', '显示为已完成')),
              ],
              { minRows: 8, maxRows: 8 },
            ),
            ltext('levelsLabel', l('Деңгейлер жазуы', 'Подпись уровней', 'Levels label', '等级标签')),
            rows(
              'levels',
              l('4 деңгей', '4 уровня', '4 levels', '4个等级'),
              { singular: l('Деңгей', 'Уровень', 'Level', '等级'), plural: l('Деңгейлер', 'Уровни', 'Levels', '等级') },
              [ltext('title', l('Атауы', 'Название', 'Title', '名称'))],
              { minRows: 4, maxRows: 4 },
            ),
          ],
        },
        {
          name: 'projects',
          label: l('Жобалар қоры', 'Пул проектов', 'Project pool', '项目库'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltext('linkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
            checkbox('showExampleBadge', l('«Мысал ретінде көрсетілген» белгісі', 'Пометка «Показано как пример»', '"Shown as example" label', '“示例”标记'), {
              defaultValue: true,
            }),
            rows(
              'chips',
              l('Сала чиптері', 'Чипы отраслей', 'Sector chips', '行业标签'),
              { singular: l('Чип', 'Чип', 'Chip', '标签'), plural: l('Чиптер', 'Чипы', 'Chips', '标签') },
              [ltext('label', l('Атауы', 'Название', 'Label', '名称'))],
              { minRows: 1, maxRows: 8 },
            ),
          ],
        },
        {
          name: 'corridors',
          label: l('Дәліздер', 'Коридоры', 'Corridors', '走廊'),
          fields: [
            eyebrow,
            sectionTitle(),
            {
              name: 'china',
              type: 'group',
              label: l('Қытай карточкасы', 'Карточка Китая', 'China card', '中国卡片'),
              fields: [
                eyebrow,
                sectionTitle(),
                text('zhTitle', l('Қытайша атауы', 'Китайское название', 'Chinese title', '中文名称')),
                ltextarea('text', l('Мәтін', 'Текст', 'Text', '文字')),
                rows(
                  'bullets',
                  l('Тізім', 'Список', 'Bullets', '要点'),
                  { singular: l('Тармақ', 'Пункт', 'Item', '条目'), plural: l('Тармақтар', 'Пункты', 'Items', '条目') },
                  [ltext('text', l('Мәтін', 'Текст', 'Text', '文字'))],
                  { minRows: 2, maxRows: 6 },
                ),
                text('primaryCtaLabel', l('1-батырма (барлық тілде бірдей)', 'Кнопка 1 (одинаково на всех языках)', 'Button 1 (same in all languages)', '按钮1（各语言相同）')),
                ltext('secondaryCtaLabel', l('2-батырма мәтіні', 'Текст кнопки 2', 'Button 2 label', '按钮2文字')),
              ],
            },
            {
              name: 'gulf',
              type: 'group',
              label: l('Парсы шығанағы', 'Персидский залив', 'Gulf', '海湾'),
              fields: [
                text('tag', l('Белгі (араб)', 'Метка (арабский)', 'Tag (Arabic)', '标记（阿拉伯语）')),
                sectionTitle(),
                ltextarea('text', l('Мәтін', 'Текст', 'Text', '文字')),
                ltext('linkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
              ],
            },
            {
              name: 'global',
              type: 'group',
              label: l('Еуропа және Азия', 'Европа и Азия', 'Europe and Asia', '欧洲与亚洲'),
              fields: [
                text('tag', l('Белгі', 'Метка', 'Tag', '标记')),
                sectionTitle(),
                ltextarea('text', l('Мәтін', 'Текст', 'Text', '文字')),
                ltext('linkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
              ],
            },
          ],
        },
        {
          name: 'scoring',
          label: l('Бағалау', 'Оценка', 'Scoring', '评估'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltextarea('lead', l('Сипаттама', 'Описание', 'Lead', '导语')),
            ltext('vetoTitle', l('Вето тақырыбы', 'Заголовок вето', 'Veto title', '否决权标题')),
            ltextarea('vetoText', l('Вето мәтіні', 'Текст вето', 'Veto text', '否决权说明')),
          ],
        },
        {
          name: 'leadership',
          label: l('Басшылық', 'Руководство', 'Leadership', '领导层'),
          fields: [
            ltextarea('quote', l('Дәйексөз', 'Цитата', 'Quote', '引言')),
            ltext('quoteSource', l('Дереккөзі', 'Источник', 'Source', '出处')),
            ltext('personLinkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
            {
              name: 'person',
              type: 'relationship',
              relationTo: 'people',
              label: l('Басшы (Тұлғалар)', 'Руководитель (Люди)', 'Leader (People)', '负责人（人员）'),
            },
          ],
        },
        {
          name: 'media',
          label: l('Медиа', 'Медиа', 'Media', '媒体'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltext('linkLabel', l('Сілтеме мәтіні', 'Текст ссылки', 'Link label', '链接文字')),
            checkbox('showExampleBadge', l('«Мысал ретінде көрсетілген» белгісі', 'Пометка «Показано как пример»', '"Shown as example" label', '“示例”标记'), {
              defaultValue: true,
            }),
            ltext('videoLabel', l('Видеогалерея', 'Видеогалерея', 'Video gallery', '视频库')),
            ltext('photoLabel', l('Фотогалерея', 'Фотогалерея', 'Photo gallery', '图片库')),
          ],
        },
        {
          name: 'membership',
          label: l('Мүшелік', 'Членство', 'Membership', '会员'),
          fields: [
            eyebrow,
            sectionTitle(),
            ltextarea('text', l('Мәтін', 'Текст', 'Text', '文字')),
            ltext('primaryCtaLabel', l('1-батырма мәтіні', 'Текст кнопки 1', 'Button 1 label', '按钮1文字')),
            ltext('secondaryCtaLabel', l('2-батырма мәтіні', 'Текст кнопки 2', 'Button 2 label', '按钮2文字')),
            rows(
              'categories',
              l('5 санат', '5 категорий', '5 categories', '5个类别'),
              { singular: l('Санат', 'Категория', 'Category', '类别'), plural: l('Санаттар', 'Категории', 'Categories', '类别') },
              [ltext('title', l('Атауы', 'Название', 'Title', '名称'))],
              { minRows: 5, maxRows: 5 },
            ),
          ],
        },
      ],
    },
  ],
}
