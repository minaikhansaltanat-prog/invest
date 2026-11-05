import type { CollectionConfig } from 'payload'

import { withRoles } from '@/access'
import { roleField } from '@/access/fields'
import { hiddenInCorporate } from '@/lib/admin-nav'
import { l } from '@/lib/labels'

// NDA жазбалары (ТТ 8.6): шаблон нұсқасы, қол қойған пайдаланушы, уақыт, IP, мерзімі (әдепкі 90 күн). Қол қоюды тек сервер жасайды
// (`/api/portal/nda`: 2FA + OTP), сондықтан REST-пен жасауға болмайды. Қатынасты қызметкер кез келген уақытта кері алады.
export const Ndas: CollectionConfig = {
  slug: 'ndas',
  labels: {
    singular: l('NDA', 'NDA', 'NDA', '保密协议'),
    plural: l('NDA жазбалары', 'NDA', 'NDAs', '保密协议'),
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['project', 'investor', 'signedAt', 'expiresAt', 'revokedAt'],
    group: l('Инвестициялық модуль', 'Инвестиционный модуль', 'Investment module', '投资模块'),
    hidden: hiddenInCorporate,
  },
  access: {
    read: withRoles('secretariat', 'chair', 'compliance', 'auditor'),
    create: () => false,
    update: withRoles('secretariat', 'chair', 'compliance'),
    delete: withRoles(),
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true, index: true, label: l('Жоба', 'Проект', 'Project', '项目'), access: { update: () => false } },
    { name: 'investor', type: 'relationship', relationTo: 'investors', required: true, index: true, label: l('Инвестор', 'Инвестор', 'Investor', '投资者'), access: { update: () => false } },
    { name: 'user', type: 'relationship', relationTo: 'users', label: l('Қол қойған пайдаланушы', 'Подписавший пользователь', 'Signed by', '签署用户'), access: { update: () => false } },
    { name: 'templateVersion', type: 'text', label: l('Шаблон нұсқасы', 'Версия шаблона', 'Template version', '模板版本'), access: { update: () => false } },
    { name: 'method', type: 'select', defaultValue: 'otp-accept', options: [{ value: 'otp-accept', label: 'Checkbox + OTP' }, { value: 'ecp', label: 'ЭЦҚ (NCALayer)' }], label: l('Қол қою тәсілі', 'Способ подписи', 'Signature method', '签署方式'), access: { update: () => false } },
    { name: 'signedAt', type: 'date', required: true, label: l('Қол қойылған уақыт', 'Время подписания', 'Signed at', '签署时间'), access: { update: () => false } },
    { name: 'expiresAt', type: 'date', required: true, label: l('Қатынас мерзімі', 'Срок доступа', 'Access expires', '访问到期'), access: { update: roleField('chair') } },
    { name: 'ip', type: 'text', label: l('IP', 'IP', 'IP', 'IP'), access: { update: () => false } },
    { name: 'userAgent', type: 'text', label: l('Браузер', 'Браузер', 'User agent', '浏览器'), access: { update: () => false } },
    { name: 'revokedAt', type: 'date', label: l('Кері алынды', 'Отозван', 'Revoked at', '撤销时间') },
    { name: 'revokeReason', type: 'textarea', label: l('Кері алу себебі', 'Причина отзыва', 'Revocation reason', '撤销原因') },
  ],
}
