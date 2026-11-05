import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { ltext, ltextarea, rows, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

// Фотоальбомдар (ТТ 7.8). Әр суретте автор мен лицензия өрісі медиа жинағында (Media) сақталады.
export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: l('Фотоальбом', 'Фотоальбом', 'Photo album', '相册'),
    plural: l('Фотоальбомдар', 'Фотоальбомы', 'Photo albums', '相册'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: adminGroups.media,
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
    ltextarea('description', l('Сипаттама', 'Описание', 'Description', '说明')),
    { name: 'cover', type: 'upload', relationTo: 'media', label: l('Мұқаба', 'Обложка', 'Cover', '封面') },
    rows(
      'photos',
      l('Суреттер', 'Фотографии', 'Photos', '照片'),
      {
        singular: l('Сурет', 'Фото', 'Photo', '照片'),
        plural: l('Суреттер', 'Фото', 'Photos', '照片'),
      },
      [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: l('Сурет', 'Изображение', 'Image', '图片') },
        ltext('caption', l('Қолтаңба', 'Подпись', 'Caption', '图注')),
      ],
    ),
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
