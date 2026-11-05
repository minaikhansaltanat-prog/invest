import type { PayloadRequest } from 'payload'

import { hasAdminRole } from '@/access'
import { writeAudit } from '@/hooks/audit'
import { type CsvColumn, toCsv } from '@/lib/csv'
import { toFourAmounts } from '@/lib/investment/records'
import { loadDashboard } from '@/lib/kpi/load'
import { json, sessionOf } from '@/lib/portal/http'

type Doc = Record<string, unknown>
const reports = ['projects', 'investors', 'kpi'] as const

/**
 * CSV есептер (ТТ 10.2: 12-модуль): жобалар, инвесторлар (дербес деректерсіз), KPI. Төрт сома бөлек бағанда, ешқашан қосылмайды.
 * Рөл: төраға, ревизор, аналитик, хатшылық. Әр экспорт аудит журналына жазылады (ТТ 10.2).
 */
export async function GET(request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params
  if (!(reports as readonly string[]).includes(name)) return json({ error: 'not-found' }, 404)

  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'admins' || !hasAdminRole({ user: user as never, headers: request.headers }, 'chair', 'auditor', 'analyst', 'secretariat')) {
    return json({ error: 'forbidden' }, 403)
  }

  let csv = ''
  if (name === 'projects') {
    const { docs } = await payload.find({ collection: 'projects', limit: 5000, depth: 0, overrideAccess: true, locale: 'kk', fallbackLocale: false, sort: 'slug' })
    const columns: CsvColumn<Doc>[] = [
      { header: 'slug', value: (row) => row.slug },
      { header: 'title', value: (row) => row.title },
      { header: 'sector', value: (row) => row.sector },
      { header: 'region', value: (row) => row.region },
      { header: 'level', value: (row) => row.level },
      { header: 'stage', value: (row) => row.stage },
      { header: 'publishToCatalog', value: (row) => row.publishToCatalog },
      { header: 'declared_musd', value: (row) => toFourAmounts((row.internal as Doc | undefined)?.amounts as never).declared },
      { header: 'loi_musd', value: (row) => toFourAmounts((row.internal as Doc | undefined)?.amounts as never).loi },
      { header: 'contract_musd', value: (row) => toFourAmounts((row.internal as Doc | undefined)?.amounts as never).contract },
      { header: 'received_musd', value: (row) => toFourAmounts((row.internal as Doc | undefined)?.amounts as never).received },
      { header: 'association_contribution', value: (row) => ((row.internal as Doc | undefined)?.amounts as Doc | undefined)?.associationContribution },
      { header: 'interested_investors', value: (row) => (row.internal as Doc | undefined)?.interestedInvestorCount },
    ]
    csv = toCsv(docs as unknown as Doc[], columns)
  } else if (name === 'investors') {
    const { docs } = await payload.find({ collection: 'investors', limit: 5000, depth: 0, overrideAccess: true, sort: 'displayName' })
    const columns: CsvColumn<Doc>[] = ['displayName', 'kind', 'direction', 'grade', 'status', 'totalScore', 'lastAssessedAt'].map((key) => ({ header: key, value: (row: Doc) => row[key] }))
    csv = toCsv(docs as unknown as Doc[], columns)
  } else {
    const dashboard = await loadDashboard(payload)
    const rows: [string, unknown][] = [
      ['declared_musd', dashboard.amounts.declared],
      ['loi_musd', dashboard.amounts.loi],
      ['contract_musd', dashboard.amounts.contract],
      ['received_musd', dashboard.amounts.received],
      ['projects', dashboard.amounts.projectCount],
      ['funnel_investors', dashboard.funnel.investors],
      ['funnel_screened', dashboard.funnel.screened],
      ['funnel_negotiating', dashboard.funnel.negotiating],
      ['funnel_contracted', dashboard.funnel.contracted],
      ['funnel_received', dashboard.funnel.received],
      ['overdue_steps', dashboard.overdue.length],
      ['new_submissions', dashboard.newSubmissions],
    ]
    csv = toCsv(rows, [
      { header: 'metric', value: (row) => row[0] },
      { header: 'value', value: (row) => row[1] },
    ])
  }

  await writeAudit({ payload, user, headers: request.headers, context: {} } as unknown as PayloadRequest, { action: 'export', collection: `report:${name}`, note: `${csv.split('\r\n').length - 2} rows` })
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="kfca-${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  })
}
