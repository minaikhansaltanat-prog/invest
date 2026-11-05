import type { Access, PayloadRequest } from 'payload'

import type { AdminRole } from './roles'

// Рұқсат функциялары (ТТ 10, 14). Толық матрица 8-кезеңде рөлдер бойынша кеңейтіледі.

type AuthedRequest = Pick<PayloadRequest, 'user'>

export const isAdminUser = (req: AuthedRequest): boolean => req.user?.collection === 'admins'

export const adminRolesOf = (req: AuthedRequest): AdminRole[] => {
  const user = req.user as { collection?: string; roles?: AdminRole[] } | null
  return user?.collection === 'admins' ? (user.roles ?? []) : []
}

/** Супер-администратор әрқашан өтеді. Қалған рөлдерден кемінде біреуі сәйкес келсе, рұқсат беріледі. */
export const hasAdminRole = (req: AuthedRequest, ...roles: AdminRole[]): boolean => {
  const own = adminRolesOf(req)
  return own.includes('super-admin') || roles.some((role) => own.includes(role))
}

export const staffOnly: Access = ({ req }) => isAdminUser(req)

export const withRoles =
  (...roles: AdminRole[]): Access =>
  ({ req }) =>
    hasAdminRole(req, ...roles)

/** Жария оқу: әкімші бәрін көреді, қалғандар тек жарияланғанды (versions/drafts бар жинақтар үшін) */
export const publishedOrStaff: Access = ({ req }) =>
  isAdminUser(req) ? true : { _status: { equals: 'published' } }

/** Контентті өзгерте алатын рөлдер (ТТ 10.1): контент-менеджер, хатшылық, төраға */
export const contentEditors: AdminRole[] = ['content-manager', 'secretariat', 'chair']
