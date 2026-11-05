// Аудит журналының таза көмекшілері (ТТ 10.2, 14.1): ескі және жаңа мәндердің айырмасы, құпия өрістерді жасыру. Дерекқорсыз, тесттеледі.

/** Журналға ешқашан түспейтін өрістер: құпия сөз хэші, 2FA кілті, сессия, токендер */
export const SECRET_KEYS: ReadonlySet<string> = new Set([
  'hash',
  'salt',
  'password',
  'totpSecret',
  'totpPending',
  'resetPasswordToken',
  'resetPasswordExpiration',
  '_verificationToken',
  '_verified',
  'sessions',
  'loginAttempts',
  'lockUntil',
  'apiKey',
])

/** Шу тудыратын жүйелік өрістер */
const NOISE_KEYS: ReadonlySet<string> = new Set(['id', 'createdAt', 'updatedAt', 'loginHistory'])

export type FieldChange = { old: unknown; new: unknown }
export type Changes = Record<string, FieldChange>

const MAX_VALUE_LENGTH = 500

/** Ұзын мәндер қысқартылады (журнал үлкен JSON-мен толмауы үшін), құпия өріс көрсетілмейді */
export function summarize(value: unknown): unknown {
  if (value === undefined) return null
  const text = typeof value === 'string' ? value : JSON.stringify(value)
  if (text !== undefined && text.length > MAX_VALUE_LENGTH) return `${text.slice(0, MAX_VALUE_LENGTH)}…`
  return value
}

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

/** Екі құжаттың өзгерген өрістері: `{ өріс: { old, new } }` (құпия және жүйелік өрістерсіз) */
export function diffDocs(before: Record<string, unknown> | null | undefined, after: Record<string, unknown> | null | undefined): Changes {
  const out: Changes = {}
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
  for (const key of keys) {
    if (SECRET_KEYS.has(key) || NOISE_KEYS.has(key)) continue
    const oldValue = before?.[key]
    const newValue = after?.[key]
    if (!same(oldValue, newValue)) out[key] = { old: summarize(oldValue), new: summarize(newValue) }
  }
  return out
}

/** Жаңа жазбаның суреті (құпиясыз): жасалу әрекеті үшін */
export function snapshot(doc: Record<string, unknown> | null | undefined): Changes {
  return diffDocs({}, doc ?? {})
}

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export'

export type AuditEntryInput = {
  action: AuditAction
  collection: string
  docId?: string | number | null
  actor?: { collection?: string; id?: string | number; email?: string } | null
  ip?: string | null
  changes?: Changes | null
  note?: string | null
  at?: Date
}

/** Журнал жазбасының Payload деректері. Әрекет иесі жоқ болса, «system» (сид, жүйелік жаңарту, қоғамдық форма). */
export function buildAuditEntry(input: AuditEntryInput) {
  return {
    at: (input.at ?? new Date()).toISOString(),
    action: input.action,
    collection: input.collection,
    docId: input.docId === null || input.docId === undefined ? undefined : String(input.docId),
    actorCollection: input.actor?.collection ?? 'system',
    actorId: input.actor?.id === undefined ? undefined : String(input.actor.id),
    actorEmail: input.actor?.email,
    ip: input.ip ?? undefined,
    changes: input.changes && Object.keys(input.changes).length > 0 ? input.changes : undefined,
    note: input.note ?? undefined,
  }
}
