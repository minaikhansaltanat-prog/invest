import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, PayloadRequest } from 'payload'

import { type AuditEntryInput, buildAuditEntry, type Changes, diffDocs, snapshot } from '@/lib/audit'
import { clientIp } from '@/lib/portal/ip'

// Аудит hook-тары (ТТ 10.2): әр жасау, өзгерту, өшіру және кіру журналға жазылады. Жазба сол транзакцияда (req беріледі),
// сондықтан өзгеріс қайтарылса, жазба да қайтарылады. Сид пен жүйелік санауыштар `context.skipAudit/seed/skipRules` арқылы өткізіледі.

// Дербес деректі көп жинақтарда мәндер журналға түспейді, тек қай өріс өзгергені жазылады (деректерді ең аз көлемде жинау, ТТ 14.2)
const REDACT = new Set(['users', 'submissions'])

const skip = (req: PayloadRequest) => req.context?.skipAudit === true || req.context?.seed === true

export const actorOf = (req: PayloadRequest): AuditEntryInput['actor'] =>
  req.user ? { collection: req.user.collection, id: req.user.id, email: (req.user as { email?: string }).email } : null

export async function writeAudit(req: PayloadRequest, input: Omit<AuditEntryInput, 'ip'>) {
  try {
    await req.payload.create({
      collection: 'auditLog',
      data: buildAuditEntry({ ...input, actor: input.actor ?? actorOf(req), ip: clientIp(req.headers) }) as never,
      overrideAccess: true,
      req,
    })
  } catch (error) {
    // Журнал жазылмаса, негізгі әрекет бұзылмайды, бірақ қате logger-ға түседі (қателікті байқау үшін)
    req.payload.logger.error({ err: error }, 'audit log write failed')
  }
}

const redacted = (changes: Changes): Changes => Object.fromEntries(Object.keys(changes).map((key) => [key, { old: '[redacted]', new: '[redacted]' }]))

export const auditAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req, collection }) => {
  if (skip(req)) return doc
  const raw = operation === 'create' ? snapshot(doc as Record<string, unknown>) : diffDocs(previousDoc as Record<string, unknown>, doc as Record<string, unknown>)
  const changes = REDACT.has(collection.slug) ? redacted(raw) : raw
  if (operation === 'update' && Object.keys(changes).length === 0) return doc
  await writeAudit(req, { action: operation, collection: collection.slug, docId: doc.id, changes })
  return doc
}

export const auditAfterDelete: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  if (skip(req)) return doc
  await writeAudit(req, { action: 'delete', collection: collection.slug, docId: doc?.id, changes: REDACT.has(collection.slug) ? redacted(snapshot(doc as Record<string, unknown>)) : snapshot(doc as Record<string, unknown>) })
  return doc
}

/** Жинаққа аудит hook-тарын қосады (бар hook-тар сақталады) */
export const withAudit = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  hooks: {
    ...collection.hooks,
    afterChange: [...(collection.hooks?.afterChange ?? []), auditAfterChange],
    afterDelete: [...(collection.hooks?.afterDelete ?? []), auditAfterDelete],
  },
})
