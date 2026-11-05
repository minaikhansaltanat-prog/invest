import { type FourAmounts } from '@/lib/investment/amounts'
import { overdueSteps, type PipelineStep } from '@/lib/investment/pipeline'
import { type FunnelCounts, funnelCounts, aggregateKpi, type KpiAggregate } from '@/lib/kpi'

// Басқару дашборды (ТТ 10.2: 1-модуль): төрт соманың БӨЛЕК қосындылары, воронка, мерзімі өткен қадамдар, жаңа өтініштер.
// Жеке дерек жоқ: тек сандар мен жоба атаулары. Төрт сома ешқашан қосылмайды (`aggregateKpi` бөлек санаттарды береді).

export type DashboardProject = {
  id: string | number
  title?: string | null
  slug?: string | null
  level?: string | null
  stage?: string | null
  publishToCatalog?: boolean | null
  amounts?: FourAmounts | null
  contractSigned?: boolean | null
  steps?: { nextAction?: string | null; dueDate?: string | null; completedAt?: string | null; responsibleId?: string | null }[]
}

export type DashboardInput = {
  projects: readonly DashboardProject[]
  investors: readonly { id: string | number; grade?: string | null; status?: string | null }[]
  negotiatingProjectIds: readonly (string | number)[]
  newSubmissions: number
  now: Date
}

export type Dashboard = {
  amounts: KpiAggregate
  funnel: FunnelCounts
  byLevel: Record<string, number>
  byStage: Record<string, number>
  investorsByGrade: Record<string, number>
  newSubmissions: number
  overdue: { projectId: string; title: string; nextAction: string; dueDate: string; daysOverdue: number }[]
}

const tally = (values: readonly (string | null | undefined)[]) => {
  const out: Record<string, number> = {}
  for (const value of values) if (value) out[value] = (out[value] ?? 0) + 1
  return out
}

export function buildDashboard(input: DashboardInput): Dashboard {
  const { projects, investors, now } = input

  const screened = investors.filter((investor) => investor.grade === 'A' || investor.grade === 'B')
  const funnel = funnelCounts({
    investors: investors.length,
    screened: screened.length,
    negotiating: new Set(input.negotiatingProjectIds.map(String)).size,
    contracted: projects.filter((project) => project.contractSigned).length,
    received: projects.filter((project) => (project.amounts?.received ?? 0) > 0 && (project.amounts?.receivedEvidenceFiles ?? 0) > 0).length,
  })

  const steps: (PipelineStep & { title: string })[] = projects.flatMap((project) =>
    (project.steps ?? []).map((step, index) => ({
      id: `${project.id}:${index}`,
      projectId: String(project.id),
      title: project.title ?? String(project.slug ?? project.id),
      nextAction: step.nextAction ?? null,
      dueDate: step.dueDate ?? null,
      completedAt: step.completedAt ?? null,
      responsibleId: step.responsibleId ?? null,
    })),
  )
  const titles = new Map(steps.map((step) => [step.id, step.title]))
  const overdue = overdueSteps(steps, now).overdue.map((item) => ({
    projectId: String(item.step.projectId),
    title: titles.get(item.step.id) ?? '',
    nextAction: item.step.nextAction ?? '',
    dueDate: new Date(item.step.dueDate as string).toISOString(),
    daysOverdue: item.daysOverdue,
  }))

  return {
    amounts: aggregateKpi(projects),
    funnel,
    byLevel: tally(projects.map((project) => project.level)),
    byStage: tally(projects.map((project) => project.stage)),
    investorsByGrade: tally(investors.map((investor) => investor.grade)),
    newSubmissions: input.newSubmissions,
    overdue,
  }
}
