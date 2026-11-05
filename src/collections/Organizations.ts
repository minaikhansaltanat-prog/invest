import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { select, text } from '@/fields/helpers'
import { hiddenInCorporate } from '@/lib/admin-nav'
import { l } from '@/lib/labels'
import { sectors, toOptions } from '@/lib/taxonomy'

// Ұйымдар (ТТ 13.3): инвестор, жоба иесі, мүше компаниялар. Дербес дерек: тек қызметкерлер.
export const Organizations: CollectionConfig = {
  slug: 'organizations',
  labels: {
    singular: l('Ұйым', 'Организация', 'Organisation', '机构'),
    plural: l('Ұйымдар', 'Организации', 'Organisations', '机构'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'country', 'registrationNumber', 'sector'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
    hidden: hiddenInCorporate,
  },
  access: {
    read: withRoles('secretariat', 'chair', 'compliance', 'auditor', 'expert', 'regional-rep'),
    create: withRoles('secretariat', 'chair'),
    update: withRoles('secretariat', 'chair'),
    delete: withRoles('chair'),
  },
  fields: [
    text('name', l('Атауы', 'Название', 'Name', '名称'), { required: true, index: true }),
    text('country', l('Тіркеу елі', 'Страна регистрации', 'Country of registration', '注册国家')),
    text('registrationNumber', l('Тіркеу нөмірі / БСН', 'Регистрационный номер / БИН', 'Registration number / BIN', '注册号 / BIN'), { index: true }),
    select('sector', l('Сала', 'Отрасль', 'Sector', '行业'), toOptions(sectors)),
    text('beneficiary', l('Нақты бенефициар', 'Конечный бенефициар', 'Ultimate beneficial owner', '最终受益人')),
    text('website', l('Сайт', 'Сайт', 'Website', '网站')),
    { name: 'users', type: 'relationship', relationTo: 'users', hasMany: true, label: l('Байланысты пайдаланушылар', 'Связанные пользователи', 'Linked users', '关联用户') },
  ],
}
