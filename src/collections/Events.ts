import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

export const eventFormats = ['offline', 'online', 'hybrid'] as const

// Іс-шаралар күнтізбесі (ТТ 7.8): алдағы және өткен іс-шаралар, тіркеу сілтемесі (өз сайтымыз немесе жай сілтеме, сыртқы embed жоқ).
export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: l('Іс-шара', 'Мероприятие', 'Event', '活动'),
    plural: l('Іс-шаралар', 'Мероприятия', 'Events', '活动'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'startsAt', 'format', '_status'],
    group: adminGroups.content,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  defaultSort: '-startsAt',
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Қысқа сипаттама', 'Краткое описание', 'Summary', '简介')),
    {
      name: 'startsAt',
      type: 'date',
      label: l('Басталуы', 'Начало', 'Starts', '开始时间'),
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
    },
    {
      name: 'endsAt',
      type: 'date',
      label: l('Аяқталуы', 'Окончание', 'Ends', '结束时间'),
      admin: { date: { pickerAppearance: 'dayAndTime' }, position: 'sidebar' },
    },
    select(
      'format',
      l('Формат', 'Формат', 'Format', '形式'),
      [
        { value: 'offline', label: l('Офлайн', 'Офлайн', 'In person', '线下') },
        { value: 'online', label: l('Онлайн', 'Онлайн', 'Online', '线上') },
        { value: 'hybrid', label: l('Аралас', 'Смешанный', 'Hybrid', '混合') },
      ],
      { required: true, defaultValue: 'offline' },
    ),
    ltext('location', l('Орны (қала, мекенжай)', 'Место (город, адрес)', 'Location (city, address)', '地点（城市、地址）')),
    text('registrationUrl', l('Тіркеу сілтемесі (https://)', 'Ссылка на регистрацию (https://)', 'Registration link (https://)', '报名链接（https://）')),
    { name: 'image', type: 'upload', relationTo: 'media', label: l('Сурет', 'Изображение', 'Image', '图片') },
    checkbox('isSample', l('Мысал (нақты дерек емес)', 'Пример (не реальные данные)', 'Example (not real data)', '示例（非真实数据）'), {
      defaultValue: false,
    }),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
