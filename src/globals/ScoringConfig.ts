import type { GlobalConfig } from 'payload'

import { checkbox, ltext, ltextarea, number, rows, select, text } from '@/fields/helpers'
import { l } from '@/lib/labels'

// 100 балдық бағалаудың баптауы (ТТ 8.2): өлшемдер мен салмақтар кодқа қатаң жазылмайды, әр өзгеріс нұсқасы сақталады.
export const dimensionKeys = [
  'financialPotential',
  'intentAndAuthority',
  'sectorExperience',
  'reputation',
  'localContribution',
  'complianceRisk',
  'planReadiness',
] as const
export type DimensionKey = (typeof dimensionKeys)[number]

export const gradeKeys = ['A', 'B', 'C', 'D'] as const

export const ScoringConfig: GlobalConfig = {
  slug: 'scoringConfig',
  label: l('Бағалау баптауы', 'Настройки оценки', 'Scoring configuration', '评分配置'),
  admin: { group: l('Баптаулар', 'Настройки', 'Settings', '设置') },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user && req.user.collection === 'admins'),
  },
  // Әр сақтау бөлек нұсқа болады: ескі баға қай әдістемемен қойылғаны анық
  versions: { max: 100 },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const dims = (data?.dimensions ?? []) as Array<{ weight?: number }>
        const total = dims.reduce((sum, d) => sum + (Number(d.weight) || 0), 0)
        if (dims.length > 0 && total !== 100) {
          throw new Error(`Өлшем салмақтарының қосындысы 100 болуы тиіс, қазір ${total}`)
        }
        return data
      },
    ],
  },
  fields: [
    checkbox(
      'methodologyApproved',
      l('Әдістемені Басқарма бекітті', 'Методика утверждена Правлением', 'Methodology approved by the Board', '方法论已获理事会批准'),
      {
        defaultValue: false,
        admin: {
          description: l(
            'Бекітілмесе, порталда әдістеме «жоба» деп белгіленеді (ТТ 21).',
            'Если не утверждена, на портале методика помечается как «проект» (ТЗ 21).',
            'If not approved, the portal marks the methodology as a "draft" (TZ 21).',
            '未批准时，门户将方法论标注为“草案”（技术任务书第21条）。',
          ),
        },
      },
    ),
    text('methodologyVersion', l('Әдістеме нұсқасы', 'Версия методики', 'Methodology version', '方法论版本'), {
      defaultValue: '0.1',
    }),
    rows(
      'dimensions',
      l('Өлшемдер', 'Критерии', 'Dimensions', '维度'),
      { singular: l('Өлшем', 'Критерий', 'Dimension', '维度'), plural: l('Өлшемдер', 'Критерии', 'Dimensions', '维度') },
      [
        select(
          'key',
          l('Кілті', 'Ключ', 'Key', '键'),
          dimensionKeys.map((value) => ({ value, label: value })),
          { required: true },
        ),
        ltext('label', l('Толық атауы', 'Полное название', 'Full label', '全称'), { required: true }),
        ltext('shortLabel', l('Қысқа атауы (басты бет)', 'Краткое название (главная)', 'Short label (home page)', '简称（首页）')),
        number('weight', l('Балл (салмақ)', 'Баллы (вес)', 'Points (weight)', '分值（权重）'), { required: true, min: 0, max: 100 }),
        ltextarea('description', l('Не тексеріледі', 'Что проверяется', 'What is checked', '检查内容')),
      ],
      { minRows: 7, maxRows: 12 },
    ),
    rows(
      'grades',
      l('Деңгейлер', 'Уровни', 'Grades', '等级'),
      { singular: l('Деңгей', 'Уровень', 'Grade', '等级'), plural: l('Деңгейлер', 'Уровни', 'Grades', '等级') },
      [
        select(
          'key',
          l('Әріп', 'Буква', 'Letter', '字母'),
          gradeKeys.map((value) => ({ value, label: value })),
          { required: true },
        ),
        number('min', l('Төменгі шегі', 'Нижняя граница', 'Minimum score', '最低分'), { required: true, min: 0, max: 100 }),
        number('max', l('Жоғарғы шегі', 'Верхняя граница', 'Maximum score', '最高分'), { required: true, min: 0, max: 100 }),
        ltext('rangeLabel', l('Диапазон жазуы', 'Подпись диапазона', 'Range label', '分数区间标签')),
        ltext('title', l('Атауы', 'Название', 'Title', '名称')),
      ],
      { minRows: 4, maxRows: 4 },
    ),
  ],
}
