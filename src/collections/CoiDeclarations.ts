import type { CollectionConfig } from 'payload'

import { hasAdminRole, isAdminUser, withRoles } from '@/access'
import { l } from '@/lib/labels'

// Мүдделер қақтығысы декларациялары (ТТ 10.2, 14.3): қақтығысы бар сарапшы жобаны көре алады, бірақ баға қоя алмайды.
// Декларация өшірілмейді. Әр қызметкер өз атына декларация жасай алады, оқуды комплаенс, төраға, ревизор жүргізеді.
export const CoiDeclarations: CollectionConfig = {
  slug: 'coiDeclarations',
  labels: {
    singular: l('МҚ декларациясы', 'Декларация КИ', 'COI declaration', '利益冲突声明'),
    plural: l('Мүдделер қақтығысы декларациялары', 'Декларации конфликта интересов', 'Conflict of interest declarations', '利益冲突声明'),
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['person', 'investor', 'project', 'organization', 'declaredAt'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
  },
  access: {
    read: ({ req }) => {
      if (hasAdminRole(req, 'compliance', 'chair', 'auditor')) return true
      return isAdminUser(req) ? { person: { equals: req.user?.id } } : false
    },
    create: ({ req }) => isAdminUser(req),
    update: withRoles('compliance'),
    delete: withRoles(),
  },
  fields: [
    { name: 'person', type: 'relationship', relationTo: 'admins', required: true, index: true, label: l('Қызметкер', 'Сотрудник', 'Staff member', '员工') },
    { name: 'investor', type: 'relationship', relationTo: 'investors', label: l('Байланысты инвестор', 'Связанный инвестор', 'Related investor', '相关投资者') },
    { name: 'project', type: 'relationship', relationTo: 'projects', label: l('Байланысты жоба', 'Связанный проект', 'Related project', '相关项目') },
    { name: 'organization', type: 'relationship', relationTo: 'organizations', label: l('Байланысты ұйым', 'Связанная организация', 'Related organisation', '相关机构') },
    { name: 'description', type: 'textarea', label: l('Сипаттама', 'Описание', 'Description', '说明') },
    { name: 'declaredAt', type: 'date', defaultValue: () => new Date().toISOString(), label: l('Күні', 'Дата', 'Date', '日期') },
  ],
}
