import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

export const documentCategories = ['charter', 'policy', 'methodology', 'report', 'privacy', 'other'] as const

// Ашық құжаттар (ТТ 7.1): жарғы, саясат, әдістеме, есеп. Әр тілге бөлек PDF; әдістеме бекітілгенше «Жоба» белгісімен шығады.
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: l('Құжат', 'Документ', 'Document', '文件'),
    plural: l('Құжаттар', 'Документы', 'Documents', '文件'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'category', 'version', 'publishedAt', '_status'],
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
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Қысқа сипаттама', 'Краткое описание', 'Summary', '简介')),
    select(
      'category',
      l('Санат', 'Категория', 'Category', '分类'),
      [
        { value: 'charter', label: l('Жарғы', 'Устав', 'Charter', '章程') },
        { value: 'policy', label: l('Саясат', 'Политика', 'Policy', '政策') },
        { value: 'methodology', label: l('Әдістеме', 'Методика', 'Methodology', '方法论') },
        { value: 'report', label: l('Есеп', 'Отчет', 'Report', '报告') },
        { value: 'privacy', label: l('Құпиялылық', 'Конфиденциальность', 'Privacy', '隐私') },
        { value: 'other', label: l('Басқа', 'Прочее', 'Other', '其他') },
      ],
      { required: true, defaultValue: 'other' },
    ),
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      label: l('PDF файлы (тілге бөлек)', 'PDF-файл (для каждого языка)', 'PDF file (per language)', 'PDF 文件（按语言）'),
    },
    text('version', l('Нұсқа нөмірі', 'Номер версии', 'Version', '版本号')),
    checkbox('isDraftMethod', l('«Жоба» белгісімен көрсету', 'Показывать с пометкой «Проект»', 'Show with a "Draft" label', '以“草案”标记展示'), {
      defaultValue: false,
    }),
    {
      name: 'publishedAt',
      type: 'date',
      label: l('Күні', 'Дата', 'Date', '日期'),
      admin: { date: { pickerAppearance: 'dayOnly' }, position: 'sidebar' },
    },
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
