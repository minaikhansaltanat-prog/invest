// Төрт бөлек сома (ТТ 8.7): мәлімделген, ниет құжаты бойынша, ресми шарт бойынша, нақты түскен.
// ЕРЕЖЕ: төрт сома ешқашан қосылмайды. Бұл файлда төрт санатты біріктіретін функция жоқ және
// болмауы тиіс; санаттар бойынша бөлек қосындыны `@/lib/kpi` береді.
// Бірлік: млн $ (Projects.amountMusd сияқты).
//
// Болжам: `received` тек дәлел файлымен (банк құжаты, аудит) толтырылады. Мұнда дәлел файлдарының
//   саны ғана тексеріледі; файл түрін (банк құжаты немесе аудит) жүктеу кезінде қойма тексереді.
// Болжам: `received: 0` дәлелсіз де рұқсат (ештеңе түспеген, ол ешнәрсені арттырмайды); 0-ден
//   үлкен сома кемінде бір дәлел файлын талап етеді.
// Болжам: «Қауымдастықтың үлесі» (associationContribution) бос (null) болуы мүмкін.

export const amountFields = ['declared', 'loi', 'contract', 'received'] as const
export type AmountField = (typeof amountFields)[number]

export type AssociationContribution = 'direct' | 'indirect'

export type FourAmounts = {
  /** Мәлімделген */
  declared?: number | null
  /** Ниет құжаты бойынша */
  loi?: number | null
  /** Ресми шарт бойынша */
  contract?: number | null
  /** Нақты түскен: тек дәлел файлымен */
  received?: number | null
  /** `received` дәлел файлдарының саны (банк құжаты, аудит) */
  receivedEvidenceFiles?: number | null
  /** Қауымдастық тікелей жәрдемдесті ме, әлде жанама қатысты ма */
  associationContribution?: AssociationContribution | null
}

export type AmountErrorCode =
  | 'amount-not-a-number'
  | 'amount-negative'
  | 'received-without-evidence'
  | 'invalid-association-contribution'

export type AmountError = { code: AmountErrorCode; field: AmountField | 'associationContribution' }

/** `received` үшін кемінде бір дәлел файлы бар ма */
export function hasReceivedEvidence(amounts: FourAmounts): boolean {
  return typeof amounts.receivedEvidenceFiles === 'number' && amounts.receivedEvidenceFiles >= 1
}

/**
 * Төрт сома өрісін тексереді: теріс немесе санға жатпайтын мән жоқ, 0-ден үлкен `received`
 * дәлел файлымен ғана, `associationContribution` тек 'direct', 'indirect' немесе null.
 */
export function validateFourAmounts(amounts: FourAmounts): { ok: boolean; errors: AmountError[] } {
  const errors: AmountError[] = []

  for (const field of amountFields) {
    const value = amounts[field]
    if (value === null || value === undefined) continue
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      errors.push({ code: 'amount-not-a-number', field })
    } else if (value < 0) {
      errors.push({ code: 'amount-negative', field })
    }
  }

  const { received, associationContribution } = amounts
  if (typeof received === 'number' && received > 0 && !hasReceivedEvidence(amounts)) {
    errors.push({ code: 'received-without-evidence', field: 'received' })
  }

  const contributionKnown =
    associationContribution === null ||
    associationContribution === undefined ||
    associationContribution === 'direct' ||
    associationContribution === 'indirect'
  if (!contributionKnown) {
    errors.push({ code: 'invalid-association-contribution', field: 'associationContribution' })
  }

  return { ok: errors.length === 0, errors }
}
