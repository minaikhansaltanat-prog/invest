import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { matchRules, refreshInterestedCount } from '@/hooks/investment'
import { hiddenInCorporate } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

export const matchStatuses = ['proposed', 'interested', 'negotiating', 'declined'] as const

// Сәйкестендіру нәтижелері (ТТ 8.5): ұсыныс жасауды менеджер өзі шешеді, автоматты түрде ештеңе жіберілмейді.
// Тек A/B деңгейлі, ветосыз, бағасы ескірмеген инвестор ұсынылады. «Қызығушылық білдірді» жобаның қызығушы саны мен 4→5 кезеңге өту шартын жаңартады.
export const Matches: CollectionConfig = {
  slug: 'matches',
  labels: {
    singular: l('Сәйкестендіру', 'Подбор', 'Match', '匹配'),
    plural: l('Сәйкестендірулер', 'Подборы', 'Matches', '匹配'),
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['project', 'investor', 'status', 'proposedAt'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
    hidden: hiddenInCorporate,
  },
  access: {
    read: withRoles('secretariat', 'chair', 'expert', 'regional-rep', 'compliance', 'auditor'),
    create: withRoles('secretariat', 'chair'),
    update: withRoles('secretariat', 'chair'),
    delete: withRoles('chair'),
  },
  hooks: { beforeChange: [matchRules], afterChange: [refreshInterestedCount] },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true, label: l('Жоба', 'Проект', 'Project', '项目') },
    { name: 'investor', type: 'relationship', relationTo: 'investors', required: true, index: true, label: l('Инвестор', 'Инвестор', 'Investor', '投资者') },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'proposed',
      label: l('Мәртебесі', 'Статус', 'Status', '状态'),
      options: [
        { value: 'proposed', label: l('Ұсынылды', 'Предложено', 'Proposed', '已推荐') },
        { value: 'interested', label: l('Қызығушылық білдірді', 'Заинтересован', 'Interested', '有意向') },
        { value: 'negotiating', label: l('Келіссөзде', 'Переговоры', 'Negotiating', '洽谈中') },
        { value: 'declined', label: l('Бас тартты', 'Отказ', 'Declined', '已拒绝') },
      ],
    },
    { name: 'response', type: 'textarea', label: l('Жауап', 'Ответ', 'Response', '回复') },
    { name: 'proposedBy', type: 'relationship', relationTo: 'admins', label: l('Ұсынған менеджер', 'Предложил менеджер', 'Proposed by', '推荐人') },
    { name: 'proposedAt', type: 'date', defaultValue: () => new Date().toISOString(), label: l('Ұсынылған күні', 'Дата предложения', 'Proposed on', '推荐日期') },
  ],
}
