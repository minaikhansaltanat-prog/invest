/**
 * Тесттер аудит журналына жазады (журнал append-only: REST арқылы өшірілмейді).
 * Іске қосу басталған уақытты еске сақтап, соңында сол уақыттан кейінгі жазбаларды тікелей SQL-мен тазалаймыз,
 * әйтпесе нағыз басшы админкада жүздеген «e2e» жазбасын көреді.
 *
 * Қорғаныс: тесттер тек «бірінші әкімші» күйінде жұмыс істейді (өздері уақытша әкімші жасайды). Егер дерекқорда әкімші
 * қалып қойса (нағыз әкімші бар), ештеңе өшірілмейді.
 */
export default async function globalSetup() {
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
