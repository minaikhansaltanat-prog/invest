import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, number, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

export const partnerKinds = ['international', 'state', 'finance', 'industry', 'academic', 'media'] as const

// Серіктестер (ТТ 7.6). Серіктес логотипі тек жазбаша рұқсатпен жарияланады: showLogo сенім белгісі міндетті түрде қолмен қойылады.
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: {
    singular: l('Серіктес', 'Партнер', 'Partner', '合作伙伴'),
    plural: l('Серіктестер', 'Партнеры', 'Partners', '合作伙伴'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['name', 'kind', 'country', 'showLogo', '_status'],
    group: adminGroups.content,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  defaultSort: 'order',
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('name', l('Атауы', 'Название', 'Name', '名称'), { required: true }),
    select(
      'kind',
      l('Түрі', 'Тип', 'Type', '类型'),
      [
        { value: 'international', label: l('Халықаралық', 'Международный', 'International', '国际') },
        { value: 'state', label: l('Мемлекеттік', 'Государственный', 'State', '政府') },
        { value: 'finance', label: l('Қаржылық', 'Финансовый', 'Financial', '金融') },
        { value: 'industry', label: l('Салалық', 'Отраслевой', 'Industry', '行业') },
        { value: 'academic', label: l('Ғылыми', 'Научный', 'Academic', '学术') },
        { value: 'media', label: l('Медиа', 'Медиа', 'Media', '媒体') },
      ],
      { required: true, defaultValue: 'international' },
    ),
    text('country', l('Ел', 'Страна', 'Country', '国家')),
    text('url', l('Сайт (https://)', 'Сайт (https://)', 'Website (https://)', '网站（https://）')),
    ltextarea('description', l('Қысқа сипаттама', 'Краткое описание', 'Description', '简介')),
    { name: 'logo', type: 'upload', relationTo: 'media', label: l('Логотип', 'Логотип', 'Logo', '标志') },
    checkbox(
      'showLogo',
      l('Логотипті сайтта көрсету (жазбаша рұқсат бар)', 'Показывать логотип на сайте (есть письменное разрешение)', 'Show the logo on the site (written permission obtained)', '在网站展示标志（已获书面许可）'),
      { defaultValue: false },
    ),
    text('permissionNote', l('Рұқсат құжаты (нөмір, күн)', 'Документ о разрешении (номер, дата)', 'Permission document (number, date)', '许可文件（编号、日期）')),
    number('order', l('Реті', 'Порядок', 'Order', '排序'), { defaultValue: 100 }),
    checkbox('isSample', l('Мысал (нақты дерек емес)', 'Пример (не реальные данные)', 'Example (not real data)', '示例（非真实数据）'), {
      defaultValue: false,
    }),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
