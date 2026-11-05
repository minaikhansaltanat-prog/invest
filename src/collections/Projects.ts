import type { CollectionConfig, Where } from 'payload'

import { hasAdminRole, isAdminUser } from '@/access'
import { checkbox, ltext, ltextarea, number, select, text } from '@/fields/helpers'
import { translationStatusField } from '@/fields/translationStatus'
import { l } from '@/lib/labels'
import { projectLevels, projectModels, projectStages, regions, sectors, toOptions } from '@/lib/taxonomy'

export const projectIcons = ['solar', 'port', 'factory', 'wind', 'agro', 'rail'] as const

// Ашық каталог: тек жариялауға рұқсат берілген және 2-3 деңгейлі жобалар (ТТ 7.4, 8.3)
const publicCatalogWhere: Where = {
  and: [{ publishToCatalog: { equals: true } }, { level: { in: ['2', '3'] } }],
}

// Жобалар (ТТ 8.3, 13.3). Қазір басты беттің каталогына қажет өрістер ғана; 7-кезеңде кезеңдер, тәуекелдер, төрт сома қосылады.
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: l('Жоба', 'Проект', 'Project', '项目'),
    plural: l('Жобалар', 'Проекты', 'Projects', '项目'),
  },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['title', 'level', 'sector', 'region', 'publishToCatalog'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    read: ({ req }) => (isAdminUser(req) ? true : publicCatalogWhere),
    create: ({ req }) => hasAdminRole(req, 'secretariat', 'chair', 'regional-rep'),
    update: ({ req }) => hasAdminRole(req, 'secretariat', 'chair', 'expert', 'regional-rep'),
    delete: ({ req }) => hasAdminRole(req, 'chair'),
  },
  fields: [
    text('slug', l('Слаг', 'Слаг', 'Slug', 'Slug'), { required: true, unique: true, index: true }),
    ltext('title', l('Атауы', 'Название', 'Title', '名称'), { required: true }),
    ltextarea('summary', l('Қысқа сипаттама', 'Краткое описание', 'Short description', '简介')),
    select('sector', l('Сала', 'Отрасль', 'Sector', '行业'), toOptions(sectors), { required: true }),
    ltext('subSector', l('Бағыты (мысалы, Терең өңдеу)', 'Подотрасль (например, Глубокая переработка)', 'Sub-sector (e.g. Deep processing)', '细分领域（例如：深加工）')),
    select('region', l('Өңір', 'Регион', 'Region', '地区'), toOptions(regions), { required: true }),
    number('amountMusd', l('Болжамды көлем, млн $', 'Ориентировочный объём, млн $', 'Estimated size, USD million', '预估规模（百万美元）'), {
      min: 0,
    }),
    select('model', l('Модель', 'Модель', 'Model', '模式'), toOptions(projectModels), { required: true }),
    select('level', l('Деңгей', 'Уровень', 'Level', '等级'), toOptions(projectLevels), {
      required: true,
      defaultValue: '1',
    }),
    select('stage', l('Кезең', 'Этап', 'Stage', '阶段'), toOptions(projectStages), { defaultValue: '1' }),
    select(
      'iconKey',
      l('Иконка (суреті жоқ карточка үшін)', 'Иконка (для карточки без фото)', 'Icon (for cards without a photo)', '图标（无图片的卡片）'),
      projectIcons.map((value) => ({ value, label: value })),
    ),
    { name: 'image', type: 'upload', relationTo: 'media', label: l('Сурет', 'Изображение', 'Image', '图片') },
    checkbox(
      'publishToCatalog',
      l('Ашық каталогқа шығару', 'Опубликовать в открытом каталоге', 'Publish to the public catalogue', '发布到公开目录'),
      {
        defaultValue: false,
        admin: {
          description: l(
            'Тек 2-3 деңгейлі, тексеруден өткен жоба шығады. Тексерілмеген жоба ашық каталогқа түспейді.',
            'Публикуются только проекты 2-3 уровня, прошедшие проверку. Непроверенный проект в открытый каталог не попадает.',
            'Only vetted level 2-3 projects are published. An unvetted project never reaches the public catalogue.',
            '仅发布通过审核的2-3级项目。未经审核的项目不会进入公开目录。',
          ),
        },
      },
    ),
    checkbox('isSample', l('Мысал (нақты дерек емес)', 'Пример (не реальные данные)', 'Example (not real data)', '示例（非真实数据）'), {
      defaultValue: false,
    }),
    translationStatusField({ kk: 'approved', ru: 'draft', en: 'draft', zh: 'draft' }),
  ],
}
