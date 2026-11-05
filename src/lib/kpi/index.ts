// Ашық KPI мен дашборд есептері (ТТ 7.6, 8.7, 10.2).
// ЕРЕЖЕ: төрт сома (declared, loi, contract, received) ешқашан қосылмайды. Әр санат өз
// қосындысын бөлек алады; нәтижеде біріккен жалпы сан жоқ және болмауы тиіс.
//
// Болжам: жобаның сомалары `project.amounts` тобында (FourAmounts) тұрады.
// Болжам: `received` қосындысына тек дәлел файлы бар жазбалар кіреді; дәлелсіз `received`
//   қосылмайды, тек `unverifiedReceivedCount` санауышында көрінеді. Мәлімделген сома
//   `received`-ке ешқашан әсер етпейді.
// Болжам: теріс немесе жарамсыз сома есепке алынбайды (0 деп саналады); оны `validateFourAmounts`
//   сақтау кезінде ұстайды.
// Болжам: `funnelCounts` кірісі санауыш немесе тізім бола алады (тізімнің ұзындығы алынады).

import { type FourAmounts, hasReceivedEvidence } from '@/lib/investment/amounts'

export type KpiProject = { amounts?: FourAmounts | null }

export type KpiAggregate = {
  declared: number
  loi: number
  contract: number
  received: number
  projectCount: number
  /** `received` қосындысына енген (дәлелі бар) жоба саны */
  receivedCount: number
  /** `received` көрсетілген, бірақ дәлелсіз болғандықтан қосылмаған жоба саны */
  unverifiedReceivedCount: number
}

const roundAmount = (value: number): number => Math.round(value * 1e6) / 1e6

const positiveAmount = (value: number | null | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0

/** Әр санат бойынша БӨЛЕК қосынды. Төрт санатты біріктіретін мән қайтарылмайды. */
export function aggregateKpi(projects: readonly KpiProject[]): KpiAggregate {
  let declared = 0
  let loi = 0
  let contract = 0
  let received = 0
  let receivedCount = 0
  let unverifiedReceivedCount = 0

  for (const { amounts } of projects) {
    if (!amounts) continue
    declared += positiveAmount(amounts.declared)
    loi += positiveAmount(amounts.loi)
    contract += positiveAmount(amounts.contract)

    const receivedAmount = positiveAmount(amounts.received)
    if (receivedAmount === 0) continue
    if (hasReceivedEvidence(amounts)) {
      received += receivedAmount
      receivedCount += 1
    } else {
      unverifiedReceivedCount += 1
    }
  }

  return {
    declared: roundAmount(declared),
    loi: roundAmount(loi),
    contract: roundAmount(contract),
    received: roundAmount(received),
    projectCount: projects.length,
    receivedCount,
    unverifiedReceivedCount,
  }
}

/** Воронка кезеңінің көзі: дайын сан немесе санауға тиісті тізім */
export type FunnelSource = number | readonly unknown[] | null | undefined

export type FunnelInput = {
  investors: FunnelSource
  screened: FunnelSource
  negotiating: FunnelSource
  contracted: FunnelSource
  received: FunnelSource
}

export type FunnelCounts = {
  investors: number
  screened: number
  negotiating: number
  contracted: number
  received: number
}

const countOf = (source: FunnelSource): number => {
  const value = typeof source === 'number' ? source : Array.isArray(source) ? source.length : 0
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
}

/**
 * Воронка: инвестор -> тексеру -> келіссөз -> шарт -> түскен қаражат (ТТ 10.2).
 * Бес бөлек санауыш; кезеңдер қиылысады, сондықтан олар ешқашан қосылмайды.
 */
export function funnelCounts(input: FunnelInput): FunnelCounts {
  return {
    investors: countOf(input.investors),
    screened: countOf(input.screened),
    negotiating: countOf(input.negotiating),
    contracted: countOf(input.contracted),
    received: countOf(input.received),
  }
}
