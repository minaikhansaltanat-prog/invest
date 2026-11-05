/**
 * Тесттер аудит журналына жазады (журнал append-only: REST арқылы өшірілмейді).
 * Іске қосу басталған уақытты еске сақтап, соңында сол уақыттан кейінгі жазбаларды тікелей SQL-мен тазалаймыз,
 * әйтпесе нағыз басшы админкада жүздеген «e2e» жазбасын көреді.
 *
 * Қорғаныс: тесттер тек «бірінші әкімші» күйінде жұмыс істейді (өздері уақытша әкімші жасайды). Егер дерекқорда әкімші
 * қалып қойса (нағыз әкімші бар), ештеңе өшірілмейді.
 */
import { portalMode } from './helpers/mode'

/** Сервер күтілген режимде жұмыс істеп тұр ма: /api/portal/kpi corporate-та 404 {error:'not-found'}, full-да 401/403 */
async function assertServerMode() {
  const base = `http://localhost:${process.env.PORT ?? 3000}`
  let status = 0
  let body = ''
  try {
    const response = await fetch(`${base}/api/portal/kpi`)
    status = response.status
    body = await response.text()
  } catch {
    return // сервер әлі жоқ: webServer өзі іске қосады
  }
  const serverMode = status === 404 && body.includes('not-found') ? 'corporate' : 'full'
  if (serverMode !== portalMode) {
    throw new Error(`Сервер ${serverMode} режимінде, ал тест ${portalMode} режиміне арналған (PORTAL_MODE=${process.env.PORTAL_MODE ?? '(жоқ)'}). Серверді сол айнымалымен қайта іске қосыңыз.`)
  }
}

export default async function globalSetup() {
  await assertServerMode()
  const startedAt = new Date()

  return async () => {
    const pg = await import('pg')
    const client = new pg.default.Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://kfca:kfca@127.0.0.1:54329/kfca',
    })
    try {
      await client.connect()
      const { rows } = await client.query('select count(*)::int as n from admins')
      if (rows[0].n === 0) await client.query('delete from audit_log where at >= $1', [startedAt])
    } catch {
      // дерекқорға қосыла алмаса, тазалау өткізіледі: тест нәтижесіне әсер етпейді
    } finally {
      await client.end().catch(() => undefined)
    }
  }
}
