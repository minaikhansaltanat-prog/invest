import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, number, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'

export const serviceIcons = ['globe', 'layers', 'shield-check', 'factory', 'chart', 'columns', 'compass', 'leaf'] as const
export type ServiceIcon = (typeof serviceIcons)[number]

// 8 қызмет бағыты (ТТ 7.2). Толық бет мазмұны 4-5 кезеңдерде кеңейтіледі.
export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: l('Қызмет бағыты', 'Направление услуг', 'Service line', '服务方向'),
    plural: l('Қызметтер', 'Услуги', 'Services', '服务'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['number', 'title', 'slug', 'highlight'],
    group: l('Контент', 'Контент', 'Content', '内容'),
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  defaultSort: 'number',
  fields: [
    text('slug', l('Слаг (барлық тілде бірдей)', 'Слаг (одинаковый для всех языков)', 'Slug (same in all languages)', 'Slug（各语言相同）'), {
      required: true,
      unique: true,
      index: true,
    }),
    number('number', l('Нөмірі', 'Номер', 'Number', '编号'), { required: true, min: 1, max: 99 }),
    select(
      'icon',
      l('Иконка', 'Иконка', 'Icon', '图标'),
      serviceIcons.map((value) => ({ value, label: value })),
      { required: true },
    ),
    checkbox('highlight', l('Басты бетте ерекшелеу', 'Выделить на главной', 'Highlight on the home page', '在首页突出显示')),
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Бір сөйлемдік сипаттама', 'Описание в одном предложении', 'One-sentence summary', '一句话简介'), {
      required: true,
    }),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
