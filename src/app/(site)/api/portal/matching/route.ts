import { hasAdminRole } from '@/access'
import { matchInvestors } from '@/lib/investment/matching'
import { type InvestorDoc, type ProjectDoc, toMatchInvestor, toMatchProject } from '@/lib/investment/records'
import { json, sessionOf } from '@/lib/portal/http'

/**
 * Жобаға сай инвесторлар тізімі (ТТ 8.5): хатшылық пен төраға ғана. Тізім тек ұсыныс: автоматты түрде ештеңе жіберілмейді,
 * ұсыныс `matches` жинағында менеджердің қолмен әрекеті арқылы жасалады (`requiresManagerDecision: true`).
 */
export async function POST(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'admins' || !hasAdminRole({ user: user as never, headers: request.headers }, 'secretariat', 'chair')) {
    return json({ error: 'forbidden' }, 403)
  }
  const body = (await request.json().catch(() => ({}))) as { projectId?: number | string }
  if (!body.projectId) return json({ error: 'bad-request' }, 400)

  const project = await payload.findByID({ collection: 'projects', id: body.projectId, overrideAccess: true, depth: 0 }).catch(() => null)
  if (!project) return json({ error: 'not-found' }, 404)
  const { docs } = await payload.find({ collection: 'investors', limit: 500, depth: 0, overrideAccess: true })
  const result = matchInvestors(toMatchProject(project.id, project as unknown as ProjectDoc), docs.map((doc) => toMatchInvestor(doc as unknown as InvestorDoc)), new Date())
  const names = new Map(docs.map((doc) => [String(doc.id), doc.displayName]))
  return json({
    requiresManagerDecision: result.requiresManagerDecision,
    suggestions: result.suggestions.map((item) => ({ ...item, displayName: names.get(item.investorId) ?? null })),
  })
}
