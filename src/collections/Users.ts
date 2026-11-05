import type { Access, CollectionConfig, FieldAccess } from 'payload'

import { userRoleLabels, userRoles } from '@/access/roles'
import { hasAdminRole, isAdminUser, withRoles } from '@/access'
import { enforcePasswordPolicy, recordLogin, requireTotpAfterLogin } from '@/hooks/auth'
import { defaultLocale, locales } from '@/i18n/config'
import { l } from '@/lib/labels'

const staffOnlyField: FieldAccess = ({ req }) => isAdminUser(req)
const never: FieldAccess = () => false

/** Пайдаланушы өз жазбасын, қызметкер барлығын көреді */
const selfOrStaff: Access = ({ req }) => {
  // Портал пайдаланушыларының дербес деректерін тек хатшылық, төраға, комплаенс, ревизор көреді (ТТ 10.1, 14.2)
  if (hasAdminRole(req, 'secretariat', 'chair', 'compliance', 'auditor')) return true
  if (req.user?.collection === 'users') return { id: { equals: req.user.id } }
  return false
}

// Сайт пайдаланушылары: инвесторлар, жоба иелері, мүшелер (ТТ 9, 13.3). Тіркелу `/api/portal/register` арқылы (ALTCHA, келісім),
// сондықтан REST-пен жасау тек қызметкерге. Рөл мен мәртебені пайдаланушы өзі өзгерте алмайды (өрістік access).
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: l('Пайдаланушы', 'Пользователь', 'User', '用户'),
    plural: l('Пайдаланушылар', 'Пользователи', 'Users', '用户'),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles', 'status', 'locale'],
    group: l('Пайдаланушылар', 'Пользователи', 'Users', '用户'),
  },
  auth: {
    tokenExpiration: 60 * 30,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    create: withRoles('secretariat', 'chair'),
    read: selfOrStaff,
    update: selfOrStaff,
    delete: withRoles('chair'),
  },
  hooks: {
    beforeValidate: [enforcePasswordPolicy],
    afterLogin: [requireTotpAfterLogin, recordLogin],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: l('Аты-жөні', 'Имя и фамилия', 'Full name', '姓名'),
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['investor'],
      label: l('Рөлдер', 'Роли', 'Roles', '角色'),
      options: userRoles.map((value) => ({ value, label: userRoleLabels[value] })),
      access: { create: staffOnlyField, update: staffOnlyField },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: l('Мәртебесі', 'Статус', 'Status', '状态'),
      options: [
        { value: 'active', label: l('Белсенді', 'Активен', 'Active', '正常') },
        { value: 'blocked', label: l('Бұғатталған', 'Заблокирован', 'Blocked', '已封禁') },
      ],
      access: { create: staffOnlyField, update: staffOnlyField },
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: defaultLocale,
      label: l('Тілі', 'Язык', 'Language', '语言'),
      options: locales.map((value) => ({ value, label: value.toUpperCase() })),
    },
    { name: 'organization', type: 'text', label: l('Ұйым', 'Организация', 'Organisation', '机构') },
    { name: 'country', type: 'text', label: l('Ел', 'Страна', 'Country', '国家') },
    { name: 'phone', type: 'text', label: l('Телефон', 'Телефон', 'Phone', '电话') },
    {
      name: 'consents',
      type: 'group',
      label: l('Келісімдер', 'Согласия', 'Consents', '同意记录'),
      access: { create: staffOnlyField, update: staffOnlyField },
      admin: { description: l('Келісім мәтінінің нұсқасы мен уақыты сақталады (ТТ 14.2).', 'Сохраняются версия текста согласия и время (ТЗ 14.2).', 'The consent text version and time are stored (TZ 14.2).', '保存同意文本的版本与时间（ТЗ 14.2）。') },
      fields: [
        { name: 'privacyAt', type: 'date', label: l('Дербес деректерге келісім уақыты', 'Время согласия на обработку ПД', 'Personal data consent time', '个人数据同意时间') },
        { name: 'privacyVersion', type: 'text', label: l('Келісім нұсқасы', 'Версия согласия', 'Consent version', '同意版本') },
      ],
    },
    {
      name: 'totpEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: l('2FA қосулы', '2FA включена', '2FA enabled', '已启用2FA'),
      access: { create: never, update: never },
      admin: { readOnly: true },
    },
    // TOTP кілті AES-GCM-мен шифрланған; API арқылы ешқашан қайтарылмайды (тек Local API + overrideAccess)
    { name: 'totpSecret', type: 'text', access: { read: never, create: never, update: never }, admin: { hidden: true } },
    { name: 'totpPending', type: 'text', access: { read: never, create: never, update: never }, admin: { hidden: true } },
    {
      name: 'loginHistory',
      type: 'array',
      label: l('Кіру тарихы', 'История входов', 'Login history', '登录记录'),
      access: { create: never, update: never },
      admin: { readOnly: true, initCollapsed: true },
      fields: [
        { name: 'at', type: 'date' },
        { name: 'ip', type: 'text' },
        { name: 'agent', type: 'text' },
      ],
    },
    {
      name: 'deletionRequestedAt',
      type: 'date',
      label: l('Аккаунтты жою сұранысы', 'Запрос на удаление аккаунта', 'Account deletion requested', '账户删除申请时间'),
      access: { create: never, update: never },
      admin: { readOnly: true },
    },
  ],
}
