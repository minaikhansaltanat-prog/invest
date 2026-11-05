import type { CollectionConfig } from 'payload'

import { contentEditors, publishedOrStaff, withRoles } from '@/access'
import { ctaGroup, pageBlocks } from '@/blocks/pageBlocks'
import { ltext, ltextarea, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'

export const pageSections = [
  'about',
  'services',
  'investors',
  'projects',
  'membership',
  'results',
  'partners',
  'media',
  'contacts',
  'legal',
] as const
export type PageSectionKey = (typeof pageSections)[number]

const sectionLabels: Record<PageSectionKey, ReturnType<typeof l>> = {
  about: l('Қауымдастық туралы', 'Об ассоциации', 'About', '关于协会'),
  services: l('Қызметтер', 'Услуги', 'Services', '服务'),
  investors: l('Инвесторларға', 'Инвесторам', 'For investors', '致投资者'),
  projects: l('Жобаларға', 'Проектам', 'For projects', '致项目方'),
  membership: l('Мүшелік', 'Членство', 'Membership', '会员'),
  results: l('Нәтижелер', 'Результаты', 'Results', '成果'),
  partners: l('Серіктестер', 'Партнеры', 'Partners', '合作伙伴'),
  media: l('Медиа', 'Медиа', 'Media', '媒体'),
  contacts: l('Байланыс', 'Контакты', 'Contacts', '联系方式'),
  legal: l('Құқықтық құжаттар', 'Правовые документы', 'Legal', '法律文件'),
}

// Статикалық ішкі беттер (ТТ 7): блоктардан жиналады, әр тілде бөлек мәтін, жариялау жобалама/жарияланды ағыны арқылы.
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: l('Бет', 'Страница', 'Page', '页面'),
    plural: l('Беттер', 'Страницы', 'Pages', '页面'),
  },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'title', 'section', '_status'],
    group: l('Контент', 'Контент', 'Content', '内容'),
  },
  versions: { drafts: true, maxPerDoc: 25 },
  access: {
    read: publishedOrStaff,
    create: withRoles(...contentEditors),
    update: withRoles(...contentEditors),
    delete: withRoles('chair'),
  },
  defaultSort: 'path',
  fields: [
    text('path', l('Жол (тіл префиксісіз)', 'Путь (без языкового префикса)', 'Path (without language prefix)', '路径（不含语言前缀）'), {
      required: true,
      unique: true,
      index: true,
      admin: {
        description: l(
          'Мысалы, /about/mission. Слагтар барлық тілде бірдей, ағылшынша.',
          'Например, /about/mission. Слаги одинаковые для всех языков, на английском.',
          'For example, /about/mission. Slugs are the same in every language, in English.',
          '例如 /about/mission。各语言的 slug 相同，使用英文。',
        ),
      },
    }),
    select(
      'section',
      l('Бөлім', 'Раздел', 'Section', '栏目'),
      pageSections.map((value) => ({ value, label: sectionLabels[value] })),
      { required: true, admin: { position: 'sidebar' } },
    ),
    ltext('title', l('Тақырып', 'Заголовок', 'Title', '标题'), { required: true }),
    ltextarea('description', l('Бір сөйлемдік сипаттама (meta description)', 'Описание в одном предложении (meta description)', 'One-sentence description (meta description)', '一句话简介（meta description）')),
    {
      name: 'blocks',
      type: 'blocks',
      label: l('Блоктар', 'Блоки', 'Blocks', '内容块'),
      blocks: pageBlocks(),
      admin: { initCollapsed: true },
    },
    ctaGroup(),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
