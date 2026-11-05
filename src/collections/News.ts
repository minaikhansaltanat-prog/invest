import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

export const newsCategories = ['strategy', 'methodology', 'projects', 'china', 'events', 'analytics'] as const
export type NewsCategory = (typeof newsCategories)[number]

// Жаңалықтар (ТТ 7.8). Санаттар, тегтер, іздеу, байланысты жобалар 4-5 кезеңдерде кеңейтіледі.
export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: l('Жаңалық', 'Новость', 'News item', '新闻'),
    plural: l('Жаңалықтар', 'Новости', 'News', '新闻'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: adminGroups.content,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  defaultSort: '-publishedAt',
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题'), { required: true }),
    ltextarea('excerpt', l('Қысқа мазмұн', 'Краткое содержание', 'Excerpt', '摘要')),
    select(
      'category',
      l('Санат', 'Категория', 'Category', '分类'),
      [
        { value: 'strategy', label: l('Стратегия', 'Стратегия', 'Strategy', '战略') },
        { value: 'methodology', label: l('Әдістеме', 'Методика', 'Methodology', '方法论') },
        { value: 'projects', label: l('Жобалар', 'Проекты', 'Projects', '项目') },
        { value: 'china', label: l('Қытай', 'Китай', 'China', '中国') },
        { value: 'events', label: l('Іс-шаралар', 'Мероприятия', 'Events', '活动') },
        { value: 'analytics', label: l('Аналитика', 'Аналитика', 'Analytics', '分析') },
      ],
      { required: true, defaultValue: 'strategy' },
    ),
    {
      name: 'publishedAt',
      type: 'date',
      label: l('Жарияланған күні', 'Дата публикации', 'Published on', '发布日期'),
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, position: 'sidebar' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: l('Сурет', 'Изображение', 'Image', '图片') },
    checkbox('featured', l('Басты жаңалық', 'Главная новость', 'Featured', '头条')),
    checkbox('isSample', l('Мысал (нақты дерек емес)', 'Пример (не реальные данные)', 'Example (not real data)', '示例（非真实数据）'), {
      defaultValue: false,
    }),
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: l('Мәтін', 'Текст', 'Body', '正文'),
    },
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
