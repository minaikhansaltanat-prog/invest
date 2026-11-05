import { hasAdminRole } from '@/access'
import { json, sessionOf } from '@/lib/portal/http'
import { loadDashboard } from '@/lib/kpi/load'

/** KPI дашбордының JSON-ы (ТТ 10.2): төрт сома бөлек, воронка, мерзімі өткен қадамдар. Жеке дерексіз: төраға, ревизор, аналитик, хатшылық. */
export async function GET(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'admins' || !hasAdminRole({ user: user as never, headers: request.headers }, 'chair', 'auditor', 'analyst', 'secretariat')) {
    return json({ error: 'forbidden' }, 403)
  }
  return json(await loadDashboard(payload))
}
