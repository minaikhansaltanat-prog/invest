import { dataroomDecision, logDataroom } from '@/lib/portal/dataroom'
import { json } from '@/lib/portal/http'
import { watermarkText } from '@/lib/investment/dataroom'

/**
 * Деректер бөлмесінің тізімі (ТТ 8.6): тек NDA күшінде, инвестор A/B деңгейлі, ветосыз, 2FA расталған болса.
 * Бас тартқанда инвесторға нақты себеп айтылмайды (жалпы «қатынас жоқ»), себеп журналға жазылады.
 */
export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params
  const decision = await dataroomDecision(request.headers, projectId)
  if (decision.kind === 'unauthorized') return json({ error: 'unauthorized' }, 401)
  if (decision.kind === 'denied') {
    await logDataroom(decision.session.payload, { userId: decision.session.user!.id, action: 'denied', projectId, request, reason: decision.reason })
    return json({ error: 'no-access' }, 403)
  }

  const { payload, user } = decision.session
  const { docs } = await payload.find({ collection: 'dataroomFiles', where: { project: { equals: projectId } }, sort: 'title', limit: 200, depth: 0, overrideAccess: true })
  await logDataroom(payload, { userId: user!.id, action: 'open', projectId, request })
  return json({
    watermark: watermarkText(String(user!.name ?? user!.email), new Date()),
    files: docs.map((file) => ({ id: file.id, title: file.title, category: file.category, mimeType: file.mimeType, size: file.filesize })),
  })
}
