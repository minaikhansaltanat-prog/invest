import type { FieldAccess } from 'payload'

import { hasAdminRole, isAdminUser } from '@/access'
import type { AdminRole } from '@/access/roles'

// Өрістік рұқсат көмекшілері (ТТ 10). Ішкі өрістер жария API-ға ешқашан шықпайды.

/** Тек қызметкер оқиды/жазады */
export const staffField: FieldAccess = ({ req }) => isAdminUser(req)

/** Нақты рөлдерге ғана (супер-администратор әрқашан) */
export const roleField =
  (...roles: AdminRole[]): FieldAccess =>
  ({ req }) =>
    hasAdminRole(req, ...roles)

/** Ешкім өзгерте алмайды: мәнді сервер (hook) есептейді */
export const computedField: FieldAccess = () => false
