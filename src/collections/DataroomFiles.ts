import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { hiddenInCorporate } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Деректер бөлмесінің файлдары (ТТ 8.6, 14.1): жабық қойма (`.data/dataroom`), жария URL жоқ, REST оқуы тек қызметкерге.
// Инвесторға файл `/api/portal/dataroom/file/<id>` арқылы беріледі: NDA, деңгей (A/B), вето, 2FA тексерілгеннен кейін ғана,
// әр ашу журналға жазылады. Файл түрі мен өлшемі шектеулі.
export const DataroomFiles: CollectionConfig = {
  slug: 'dataroomFiles',
  labels: {
    singular: l('Деректер бөлмесі файлы', 'Файл data room', 'Data room file', '数据室文件'),
    plural: l('Деректер бөлмесі файлдары', 'Файлы data room', 'Data room files', '数据室文件'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'category', 'filename'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
    hidden: hiddenInCorporate,
  },
  access: {
    read: withRoles('secretariat', 'chair', 'compliance', 'auditor', 'expert'),
    create: withRoles('secretariat', 'chair'),
    update: withRoles('secretariat', 'chair'),
    delete: withRoles('chair'),
  },
  upload: {
    staticDir: path.resolve(dirname, '../../.data/dataroom'),
    mimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true, label: l('Жоба', 'Проект', 'Project', '项目') },
    { name: 'title', type: 'text', required: true, label: l('Атауы', 'Название', 'Title', '名称') },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'other',
      label: l('Санат', 'Категория', 'Category', '分类'),
      options: [
        { value: 'financial', label: l('Қаржылық', 'Финансы', 'Financial', '财务') },
        { value: 'legal', label: l('Құқықтық', 'Право', 'Legal', '法律') },
        { value: 'technical', label: l('Техникалық', 'Техника', 'Technical', '技术') },
        { value: 'market', label: l('Нарықтық', 'Рынок', 'Market', '市场') },
        { value: 'ecology', label: l('Экология', 'Экология', 'Ecology', '环境') },
        { value: 'other', label: l('Басқа', 'Прочее', 'Other', '其他') },
      ],
    },
  ],
}
