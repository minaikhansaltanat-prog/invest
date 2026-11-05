import { createHash, randomInt } from 'node:crypto'

import type { FormKind } from '@/lib/forms/definitions'

// Өтініш нөмірі мен келісім жазбасының көмекшілері (таза функциялар, тесттеледі).

/** Келісім мәтінінің нұсқасы: /legal/consent мәтіні өзгерсе, осы мән өзгертіледі (ТТ 14.2) */
export const CONSENT_VERSION = '2026-11-05'

const prefix: Record<FormKind, string> = { contact: 'C', investor: 'INV', project: 'PRJ', membership: 'MEM' }

// Ұқсас таңбалар (0/O, 1/I) жоқ алфавит: нөмірді телефонмен айтуға ыңғайлы
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function buildReference(kind: FormKind, now: Date = new Date(), random: (max: number) => number = (max) => randomInt(0, max)): string {
  const year = String(now.getUTCFullYear()).slice(2)
  const code = Array.from({ length: 6 }, () => ALPHABET[random(ALPHABET.length)]).join('')
  return `KF-${year}-${prefix[kind]}-${code}`
}

/** IP-ді сақтамай, қайтымсыз қысқа хэшін ғана жазамыз (қайта қолдану/спам талдауы үшін) */
export const hashIp = (ip: string, secret: string): string =>
  createHash('sha256').update(`ip:${secret}:${ip}`).digest('hex').slice(0, 16)
