import { describe, expect, it } from 'vitest'

import { buildAuditEntry, diffDocs, SECRET_KEYS, snapshot, summarize } from '@/lib/audit'
import { csvCell, toCsv } from '@/lib/csv'
import { buildDashboard } from '@/lib/kpi/dashboard'

// 8-кезең: аудит журналының таза логикасы, CSV, KPI дашборд (төрт сома бөлек).

describe('audit: diffDocs / snapshot', () => {
  it('өзгерген өріске ескі және жаңа мән жазылады, өзгермеген өріс жазылмайды', () => {
    const changes = diffDocs({ status: 'new', name: 'A', n: 1 }, { status: 'accepted', name: 'A', n: 2 })
    expect(changes).toEqual({ status: { old: 'new', new: 'accepted' }, n: { old: 1, new: 2 } })
  })

  it('құпия және жүйелік өрістер журналға түспейді (хэш, TOTP кілті, сессия, id, уақыт)', () => {
    const before = { hash: 'x', salt: 's', totpSecret: 'enc', totpPending: 'p', sessions: [1], id: 1, updatedAt: 'a', loginHistory: [], title: 'old' }
    const after = { hash: 'y', salt: 't', totpSecret: 'enc2', totpPending: 'q', sessions: [2], id: 1, updatedAt: 'b', loginHistory: [{}], title: 'new' }
    expect(diffDocs(before, after)).toEqual({ title: { old: 'old', new: 'new' } })
    for (const key of ['hash', 'salt', 'password', 'totpSecret', 'totpPending', 'sessions', 'resetPasswordToken']) expect(SECRET_KEYS.has(key)).toBe(true)
    expect(Object.keys(snapshot({ password: 'p', hash: 'h', title: 't', id: 3 }))).toEqual(['title'])
  })

  it('ұзын мән қысқартылады, nested объект айырмасы табылады, бос мән null болады', () => {
    const long = 'я'.repeat(800)
    const summary = summarize(long) as string
    expect(summary.length).toBeLessThan(510)
    expect(summary.endsWith('…')).toBe(true)
    expect(diffDocs({ a: { x: 1 } }, { a: { x: 2 } }).a).toEqual({ old: { x: 1 }, new: { x: 2 } })
    expect(diffDocs({}, { a: undefined, b: 1 })).toEqual({ b: { old: null, new: 1 } })
  })

  it('жазба құрылымы: әрекет иесі жоқ болса, system', () => {
    const entry = buildAuditEntry({ action: 'update', collection: 'investors', docId: 5, changes: { grade: { old: 'B', new: 'A' } }, at: new Date('2026-11-05T10:00:00Z') })
    expect(entry).toMatchObject({ at: '2026-11-05T10:00:00.000Z', action: 'update', collection: 'investors', docId: '5', actorCollection: 'system' })
    expect(entry.changes).toEqual({ grade: { old: 'B', new: 'A' } })
    const withActor = buildAuditEntry({ action: 'login', collection: 'admins', actor: { collection: 'admins', id: 2, email: 'a@b.kz' }, ip: '203.0.113.5' })
    expect(withActor).toMatchObject({ actorCollection: 'admins', actorId: '2', actorEmail: 'a@b.kz', ip: '203.0.113.5' })
    expect(buildAuditEntry({ action: 'delete', collection: 'x', changes: {} }).changes).toBeUndefined()
  })
})

describe('csv', () => {
  it('үтір, тырнақша, жол үзілімі бар ұяшық дұрыс қорғалады', () => {
    expect(csvCell('a,b')).toBe('"a,b"')
    expect(csvCell('сөз "тырнақша"')).toBe('"сөз ""тырнақша"""')
    expect(csvCell('жол\nекінші')).toBe('"жол\nекінші"')
    expect(csvCell(null)).toBe('')
    expect(csvCell(12.5)).toBe('12.5')
    expect(csvCell(true)).toBe('true')
  })

  it('Excel формула инъекциясынан қорғау: =, +, -, @ басталған мәтін', () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe(`"'=HYPERLINK(""http://x"")"`)
    expect(csvCell('+1+1')).toBe("'+1+1")
    expect(csvCell('-cmd')).toBe("'-cmd")
    expect(csvCell('@SUM(A1)')).toBe("'@SUM(A1)")
    expect(csvCell(-5)).toBe('-5') // сан формула емес
  })

  it('BOM, тақырып және CRLF', () => {
    const csv = toCsv([{ a: 1, b: 'x' }], [
      { header: 'a', value: (row) => row.a },
      { header: 'b', value: (row) => row.b },
    ])
    expect(csv.startsWith('﻿a,b\r\n1,x\r\n')).toBe(true)
  })
})

describe('buildDashboard: төрт сома бөлек, ешқашан қосылмайды (ТТ 8.7)', () => {
  const now = new Date('2026-11-05T00:00:00Z')
  const input = {
    now,
    projects: [
      { id: 1, title: 'A', level: '2', stage: '3', amounts: { declared: 40, loi: 30, contract: 20, received: 5, receivedEvidenceFiles: 1 }, contractSigned: true, steps: [{ nextAction: 'Кездесу', dueDate: '2026-10-25T00:00:00Z', completedAt: null, responsibleId: '9' }] },
      { id: 2, title: 'B', level: '3', stage: '1', amounts: { declared: 10, loi: null, contract: null, received: 7, receivedEvidenceFiles: 0 }, steps: [{ nextAction: 'Орындалды', dueDate: '2026-10-01T00:00:00Z', completedAt: '2026-10-02T00:00:00Z' }] },
    ],
    investors: [
      { id: 1, grade: 'A' },
      { id: 2, grade: 'B' },
      { id: 3, grade: 'C' },
      { id: 4, grade: null },
    ],
    negotiatingProjectIds: [1, 1, 2],
    newSubmissions: 3,
  }
  const dashboard = buildDashboard(input)

  it('төрт санат бөлек қосылады; дәлелсіз «түскен» қосылмайды', () => {
    expect(dashboard.amounts).toMatchObject({ declared: 50, loi: 30, contract: 20, received: 5, projectCount: 2, receivedCount: 1, unverifiedReceivedCount: 1 })
  })

  it('біріктірілген жалпы сан жоқ (ешқандай total/sum/combined/overall)', () => {
    const keys = JSON.stringify(dashboard).match(/"[A-Za-z_]+":/g) ?? []
    for (const key of keys) expect(key).not.toMatch(/total|sum|combined|overall/i)
  })

  it('воронка: тексеруден тек A/B өтеді, келіссөз бірегей жоба, «түскен» тек дәлелмен', () => {
    expect(dashboard.funnel).toEqual({ investors: 4, screened: 2, negotiating: 2, contracted: 1, received: 1 })
  })

  it('деңгей мен кезең бойынша таралу, жаңа өтініштер', () => {
    expect(dashboard.byLevel).toEqual({ '2': 1, '3': 1 })
    expect(dashboard.byStage).toEqual({ '3': 1, '1': 1 })
    expect(dashboard.investorsByGrade).toEqual({ A: 1, B: 1, C: 1 })
    expect(dashboard.newSubmissions).toBe(3)
  })

  it('мерзімі өткен қадам: орындалмаған және мерзімі өткені ғана, күн саны дұрыс', () => {
    expect(dashboard.overdue).toHaveLength(1)
    expect(dashboard.overdue[0]).toMatchObject({ projectId: '1', title: 'A', nextAction: 'Кездесу', daysOverdue: 11 })
  })

  it('жеке дерек жоқ: нәтижеде пошта, аты-жөні өрістері жоқ', () => {
    expect(JSON.stringify(dashboard)).not.toMatch(/email|phone|beneficiary|displayName/)
  })
})
