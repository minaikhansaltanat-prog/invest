import type { Access, PayloadRequest } from 'payload'

import { adminTwoFactorRequired } from '@/lib/portal/env'
import { hasValidTwoFactor } from '@/lib/portal/twofactor'

import type { AdminRole } from './roles'

// Рұқсат функциялары (ТТ 10, 14). Барлық қызметкер құқығы `verifiedAdmin` арқылы өтеді: әкімші сессиясы + (талап етілсе) 2FA расталуы.

type AuthedRequest = Pick<PayloadRequest, 'user'> & { headers?: Headers }

/** Қызметкер сессиясы. 2FA міндетті болса (ТТ 14.1), cookie-де жарамды белгі болуы тиіс: әйтпесе әкімші «танылмайды» */
export function verifiedAdmin(req: AuthedRequest): { id: string | number; collection: 'admins'; roles?: AdminRole[] } | null {
  const user = req.user as { id: string | number; collection?: string; roles?: AdminRole[] } | null | undefined
  if (user?.collection !== 'admins') return null
  if (adminTwoFactorRequired() && !hasValidTwoFactor(req.headers ?? new Headers(), { id: user.id, collection: 'admins' })) return null
  return { id: user.id, collection: 'admins', roles: user.roles }
}

export const isAdminUser = (req: AuthedRequest): boolean => verifiedAdmin(req) !== null

export const adminRolesOf = (req: AuthedRequest): AdminRole[] => verifiedAdmin(req)?.roles ?? []

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
