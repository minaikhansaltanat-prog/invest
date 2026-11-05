import type { Payload } from 'payload'

import { toFourAmounts } from '@/lib/investment/records'

import { buildDashboard, type Dashboard, type DashboardProject } from './dashboard'

type Doc = Record<string, unknown>

/** Дашборд деректерін жинайды (тек сервер, overrideAccess: рөл тексеруін шақырушы жасайды). Жеке дерек оқылмайды. */
export async function loadDashboard(payload: Payload, now: Date = new Date()): Promise<Dashboard> {
  const [projects, investors, negotiating, fresh] = await Promise.all([
    payload.find({ collection: 'projects', limit: 2000, depth: 0, overrideAccess: true, locale: 'kk', fallbackLocale: false }),
    payload.find({ collection: 'investors', limit: 5000, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'matches', where: { status: { equals: 'negotiating' } }, limit: 5000, depth: 0, overrideAccess: true }),
    payload.count({ collection: 'submissions', where: { status: { equals: 'new' } }, overrideAccess: true }),
  ])

  const mapped: DashboardProject[] = projects.docs.map((project) => {
    const internal = ((project as unknown as Doc).internal ?? {}) as {
      amounts?: Parameters<typeof toFourAmounts>[0]
      contractSigned?: boolean | null
      pipelineSteps?: { nextAction?: string | null; dueDate?: string | null; completedAt?: string | null; responsible?: unknown }[] | null
    }
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      level: project.level,
      stage: project.stage,
      publishToCatalog: project.publishToCatalog,
      amounts: toFourAmounts(internal.amounts),
      contractSigned: internal.contractSigned,
      steps: (internal.pipelineSteps ?? []).map((step) => ({
        nextAction: step.nextAction,
        dueDate: step.dueDate,
        completedAt: step.completedAt,
        responsibleId: step.responsible && typeof step.responsible === 'object' ? String((step.responsible as { id: unknown }).id) : step.responsible ? String(step.responsible) : null,
      })),
    }
  })

  return buildDashboard({
    projects: mapped,
    investors: investors.docs.map((investor) => ({ id: investor.id, grade: investor.grade, status: investor.status })),
    negotiatingProjectIds: negotiating.docs.map((match) => (typeof match.project === 'object' ? (match.project as { id: number }).id : match.project)),
    newSubmissions: fresh.totalDocs,
    now,
  })
}
