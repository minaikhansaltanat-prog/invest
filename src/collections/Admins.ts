import type { CollectionConfig, FieldAccess } from 'payload'

import { hasAdminRole, isAdminUser, verifiedAdmin } from '@/access'
import { roleField } from '@/access/fields'
import { adminRoleLabels, adminRoles } from '@/access/roles'
import { enforcePasswordPolicy, recordLogin } from '@/hooks/auth'
import { adminGroups } from '@/lib/admin-nav'
import { l } from '@/lib/labels'
import { regions, toOptions } from '@/lib/taxonomy'

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
    group: adminGroups.system,
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
    // Қызметкерлер тізімін төраға, комплаенс, ревизор көреді; қалғасы тек өз жазбасын. Рөл мен өңірді тек супер-администратор өзгертеді
    // (әйтпесе кез келген әкімші өзіне супер-администратор рөлін бере алар еді).
    read: ({ req }) => {
      const admin = verifiedAdmin(req)
      if (!admin) return false
      return hasAdminRole(req, 'chair', 'compliance', 'auditor') ? true : { id: { equals: admin.id } }
    },
    create: ({ req }) => hasAdminRole(req),
    update: ({ req }) => {
      const admin = verifiedAdmin(req)
      if (!admin) return false
      return hasAdminRole(req) ? true : { id: { equals: admin.id } }
    },
    delete: ({ req }) => hasAdminRole(req),
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
      access: { create: roleField(), update: roleField() },
    },
    {
      name: 'region',
      type: 'select',
      options: toOptions(regions),
      access: { create: roleField(), update: roleField() },
      label: l('Өңір (өңірлік өкіл үшін)', 'Регион (для регионального представителя)', 'Region (for regional representatives)', '地区（地区代表适用）'),
      admin: { description: l('Өңірлік өкіл тек осы өңірдің жобалары мен инвесторларын көреді.', 'Региональный представитель видит проекты и инвесторов только этого региона.', 'A regional representative sees only the projects and investors of this region.', '地区代表仅可查看该地区的项目与投资者。') },
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
