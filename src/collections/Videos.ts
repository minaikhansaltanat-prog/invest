import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { ltext, ltextarea, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'

// Бейнелер (ТТ 7.8). YouTube/сыртқы embed жоқ (NIGHT_TASK 3.5): бейне өз серверімізде mp4 файл ретінде сақталады.
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: l('Бейне', 'Видео', 'Video', '视频'),
    plural: l('Бейнелер', 'Видео', 'Videos', '视频'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: l('Контент', 'Контент', 'Content', '内容'),
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
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Қысқа сипаттама', 'Краткое описание', 'Summary', '简介')),
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      label: l('Бейне файлы (mp4, тілге бөлек)', 'Видеофайл (mp4, для каждого языка)', 'Video file (mp4, per language)', '视频文件（mp4，按语言）'),
    },
    { name: 'poster', type: 'upload', relationTo: 'media', label: l('Мұқаба суреті', 'Обложка', 'Poster image', '封面图') },
    {
      name: 'publishedAt',
      type: 'date',
      label: l('Жарияланған күні', 'Дата публикации', 'Published on', '发布日期'),
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, position: 'sidebar' },
    },
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
