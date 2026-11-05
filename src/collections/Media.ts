import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { l } from '@/lib/labels'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Суреттер мен файлдар. ТТ 12.5: әр суретте автор мен лицензия өрісі және 4 тілдегі alt мәтіні міндетті.
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: l('Медиафайл', 'Медиафайл', 'Media file', '媒体文件'),
    plural: l('Медиафайлдар', 'Медиафайлы', 'Media files', '媒体文件'),
  },
  admin: {
    group: l('Контент', 'Контент', 'Content', '内容'),
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
    update: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
    delete: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
  },
  upload: {
    staticDir: path.resolve(dirname, '../../.data/media'),
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
    focalPoint: true,
    imageSizes: [{ name: 'thumbnail', width: 400, height: 300, position: 'centre' }],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      label: l('Alt мәтіні (4 тілде)', 'Alt-текст (на 4 языках)', 'Alt text (4 languages)', 'Alt 文本（四种语言）'),
    },
    {
      name: 'credit',
      type: 'text',
      label: l('Автор', 'Автор', 'Author', '作者'),
    },
    {
      name: 'license',
      type: 'select',
      defaultValue: 'own',
      label: l('Лицензия', 'Лицензия', 'License', '许可'),
      options: [
        { value: 'own', label: l('Өз фотосессиясы', 'Собственная съемка', 'Own photoshoot', '自有拍摄') },
        { value: 'stock', label: l('Лицензиялы сток', 'Лицензионный сток', 'Licensed stock', '授权图库') },
        {
          value: 'partner',
          label: l('Серіктестің жазбаша рұқсаты', 'Письменное разрешение партнера', 'Partner written permission', '合作伙伴书面许可'),
        },
        {
          value: 'ai-placeholder',
          label: l('AI (уақытша макет)', 'ИИ (временный макет)', 'AI (temporary placeholder)', 'AI（临时占位）'),
        },
      ],
    },
  ],
}
