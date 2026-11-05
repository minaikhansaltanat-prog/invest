import type { CollectionConfig } from 'payload'

import { userRoleLabels, userRoles } from '@/access/roles'
import { defaultLocale, locales } from '@/i18n/config'
import { l } from '@/lib/labels'

// Сайт пайдаланушылары: инвесторлар, жоба иелері, мүшелер (ТТ 9). Кабинет логикасы 6-кезеңде толықтырылады.
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: l('Пайдаланушы', 'Пользователь', 'User', '用户'),
    plural: l('Пайдаланушылар', 'Пользователи', 'Users', '用户'),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles', 'locale'],
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
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: defaultLocale,
      label: l('Тілі', 'Язык', 'Language', '语言'),
      options: locales.map((value) => ({ value, label: value.toUpperCase() })),
    },
  ],
}
