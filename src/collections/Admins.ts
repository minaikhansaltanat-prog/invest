import type { CollectionConfig, FieldAccess } from 'payload'

import { isAdminUser } from '@/access'
import { adminRoleLabels, adminRoles } from '@/access/roles'
import { enforcePasswordPolicy, recordLogin } from '@/hooks/auth'
import { l } from '@/lib/labels'

const never: FieldAccess = () => false

// Әкімшілік панельге кіретін қызметкерлер (ТТ 13.3: admins). Сайт пайдаланушылары `users` жинағында.
export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: {
    singular: l('Әкімші', 'Администратор', 'Administrator', '管理员'),
    plural: l('Әкімшілер', 'Администраторы', 'Administrators', '管理员'),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: l('Жүйе', 'Система', 'System', '系统'),
  },
  auth: {
    // Сессия 30 минут белсенсіздіктен кейін аяқталады (ТТ 14.1)
    tokenExpiration: 60 * 30,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    // Әкімшілік панельге тек әкімші кіреді; 2FA міндетті болса (ТТ 14.1), TOTP расталғанша панель жабық.
    admin: ({ req }) => isAdminUser(req),
  },
  hooks: {
    afterLogin: [recordLogin],
    beforeValidate: [
      enforcePasswordPolicy,
      // Бірінші әкімші автоматты түрде супер-администратор болады
      async ({ data, operation, req }) => {
        if (operation === 'create' && data) {
          const { totalDocs } = await req.payload.count({ collection: 'admins', overrideAccess: true })
          if (totalDocs === 0) data.roles = ['super-admin']
        }
        return data
      },
    ],
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
      defaultValue: ['content-manager'],
      label: l('Рөлдер', 'Роли', 'Roles', '角色'),
      options: adminRoles.map((value) => ({ value, label: adminRoleLabels[value] })),
    },
    {
      name: 'totpEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: l('2FA қосулы', '2FA включена', '2FA enabled', '已启用2FA'),
      access: { create: never, update: never },
      admin: { readOnly: true },
    },
    // TOTP кілті AES-GCM-мен шифрланған; API арқылы ешқашан қайтарылмайды
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
  ],
}
