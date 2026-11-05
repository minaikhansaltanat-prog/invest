import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { checkbox, ltext, ltextarea, number, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

// Тұлғалар мен команда (ТТ 7.1, 13.3: people). Жариялау тек жазбаша келісіммен (consent).
export const People: CollectionConfig = {
  slug: 'people',
  labels: {
    singular: l('Тұлға', 'Персона', 'Person', '人员'),
    plural: l('Тұлғалар', 'Люди', 'People', '人员'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'group', 'position', 'photoConsent', '_status'],
    group: adminGroups.content,
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('name', l('Аты-жөні', 'Имя и фамилия', 'Full name', '姓名'), { required: true }),
    ltext('position', l('Лауазымы', 'Должность', 'Position', '职务')),
    select(
      'group',
      l('Топ', 'Группа', 'Group', '分组'),
      [
        { value: 'leadership', label: l('Басшылық', 'Руководство', 'Leadership', '领导层') },
        { value: 'secretariat', label: l('Хатшылық', 'Секретариат', 'Secretariat', '秘书处') },
        { value: 'experts', label: l('Сарапшылар', 'Эксперты', 'Experts', '专家') },
        { value: 'representatives', label: l('Өкілдер', 'Представители', 'Representatives', '代表') },
      ],
      { defaultValue: 'leadership', required: true },
    ),
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: l('Фото', 'Фото', 'Photo', '照片'),
      // Келісім жоқ болса, фото жария API арқылы да берілмейді
      access: {
        read: ({ req, doc }) => Boolean(req.user?.collection === 'admins' || (doc as { photoConsent?: boolean } | undefined)?.photoConsent),
      },
    },
    ltext('photoAlt', l('Фотоның alt мәтіні (4 тілде)', 'Alt-текст фото (на 4 языках)', 'Photo alt text (4 languages)', '照片 alt 文本（四种语言）')),
    checkbox(
      'photoConsent',
      l('Фотоны жариялауға келісім бар', 'Есть согласие на публикацию фото', 'Consent to publish the photo is on file', '已取得发布照片的同意'),
      {
        defaultValue: false,
        admin: {
          description: l(
            'Белгі қойылмаса, сайт фотоның орнына монограмма көрсетеді.',
            'Без этой отметки сайт показывает монограмму вместо фото.',
            'Without this flag the site shows a monogram instead of the photo.',
            '未勾选时，网站显示字母组合而非照片。',
          ),
        },
      },
    ),
    text('photoConsentNote', l('Келісім туралы ескертпе', 'Примечание о согласии', 'Consent note', '同意说明')),
    {
      name: 'photoConsentFile',
      type: 'upload',
      relationTo: 'media',
      label: l('Келісім файлы (PDF)', 'Файл согласия (PDF)', 'Consent file (PDF)', '同意书文件（PDF）'),
      access: { read: ({ req }) => req.user?.collection === 'admins' },
    },
    text('monogram', l('Монограмма', 'Монограмма', 'Monogram', '字母组合'), {
      admin: { description: l('Мысалы: ҒЖ', 'Например: ҒЖ', 'e.g. ҒЖ', '例如：ҒЖ') },
    }),
    ltextarea('bio', l('Қысқа өмірбаян', 'Краткая биография', 'Short biography', '简历')),
    text('languages', l('Тілдері', 'Языки', 'Languages', '语言')),
    number('order', l('Реті', 'Порядок', 'Order', '排序'), { defaultValue: 100 }),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
