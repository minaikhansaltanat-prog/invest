import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { applyScorecardToInvestor, scorecardRules } from '@/hooks/investment'
import { dimensionKeys } from '@/globals/ScoringConfig'
import { l } from '@/lib/labels'

// 100 балдық бағалау (ТТ 8.2): әр өлшем бойынша балл, дәлелдеме мәтіні және файлдар міндетті; екі тұлға (сарапшы + комитет мүшесі) бекітеді.
// Жалпы балл, деңгей, бекіту мәртебесі серверде есептеледі. Инвестор мен жария сайт бұл жинақты ешқашан көрмейді.
export const Scorecards: CollectionConfig = {
  slug: 'scorecards',
  labels: {
    singular: l('Бағалау картасы', 'Карта оценки', 'Scorecard', '评分卡'),
    plural: l('Бағалау карталары', 'Карты оценки', 'Scorecards', '评分卡'),
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['investor', 'total', 'grade', 'finalized', 'updatedAt'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    read: withRoles('expert', 'compliance', 'chair', 'auditor', 'secretariat'),
    create: withRoles('expert', 'chair'),
    update: withRoles('expert', 'chair'),
    // Баға тарихы өшірілмейді: тек супер-администратор
    delete: withRoles(),
  },
  hooks: { beforeChange: [scorecardRules], afterChange: [applyScorecardToInvestor] },
  fields: [
    { name: 'investor', type: 'relationship', relationTo: 'investors', required: true, index: true, label: l('Инвестор', 'Инвестор', 'Investor', '投资者') },
    {
      name: 'entries',
      type: 'array',
      label: l('Өлшемдер бойынша балл', 'Баллы по критериям', 'Scores by dimension', '各维度得分'),
      fields: [
        { name: 'dimension', type: 'select', required: true, options: dimensionKeys.map((value) => ({ value, label: value })), label: l('Өлшем', 'Критерий', 'Dimension', '维度') },
        { name: 'points', type: 'number', required: true, min: 0, label: l('Балл', 'Балл', 'Points', '得分') },
        { name: 'evidenceText', type: 'textarea', label: l('Дәлелдеме мәтіні (міндетті)', 'Обоснование (обязательно)', 'Evidence text (required)', '佐证文字（必填）') },
        { name: 'evidenceFiles', type: 'upload', relationTo: 'media', hasMany: true, label: l('Дәлел файлдары (міндетті)', 'Файлы-доказательства (обязательно)', 'Evidence files (required)', '佐证文件（必填）') },
      ],
    },
    {
      name: 'assessments',
      type: 'array',
      label: l('Бағалаушылар (сарапшы + комитет мүшесі)', 'Оценщики (эксперт + член комитета)', 'Assessors (expert + committee member)', '评估人（专家 + 委员会成员）'),
      fields: [
        { name: 'evaluator', type: 'relationship', relationTo: 'admins', required: true, label: l('Бағалаушы', 'Оценщик', 'Assessor', '评估人') },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { value: 'expert', label: l('Сарапшы', 'Эксперт', 'Expert', '专家') },
            { value: 'committee-member', label: l('Комитет мүшесі', 'Член комитета', 'Committee member', '委员会成员') },
          ],
          label: l('Рөлі', 'Роль', 'Role', '角色'),
        },
        { name: 'comment', type: 'textarea', label: l('Ішкі пікір (инвестор көрмейді)', 'Внутреннее мнение (инвестор не видит)', 'Internal opinion (investor cannot see)', '内部意见（投资者不可见）') },
      ],
    },
    { name: 'total', type: 'number', label: l('Жалпы балл (есептеледі)', 'Общий балл (вычисляется)', 'Total (computed)', '总分（自动计算）'), admin: { readOnly: true, position: 'sidebar' } },
    { name: 'grade', type: 'text', label: l('Деңгейі (есептеледі)', 'Уровень (вычисляется)', 'Grade (computed)', '等级（自动计算）'), admin: { readOnly: true, position: 'sidebar' } },
    { name: 'complete', type: 'checkbox', defaultValue: false, label: l('Толық (қате жоқ)', 'Полная (без ошибок)', 'Complete (no errors)', '完整（无错误）'), admin: { readOnly: true, position: 'sidebar' } },
    { name: 'finalized', type: 'checkbox', defaultValue: false, label: l('Бекітілді (2 тұлға)', 'Утверждена (2 лица)', 'Finalised (2 people)', '已确认（2人）'), admin: { readOnly: true, position: 'sidebar' } },
    { name: 'finalizedAt', type: 'date', label: l('Бекітілген күні', 'Дата утверждения', 'Finalised on', '确认日期'), admin: { readOnly: true, position: 'sidebar' } },
  ],
}
