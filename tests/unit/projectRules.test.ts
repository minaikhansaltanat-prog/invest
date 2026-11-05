import { describe, expect, it } from 'vitest'

import {
  canPromoteToLevel,
  canPublishToCatalog,
  type ProjectRecord,
  toPublicProject,
} from '@/lib/investment/projectRules'
import type { ProjectLevelValue } from '@/lib/taxonomy'

// Жоба деңгейлері мен ашық каталог (ТТ 8.3, 7.4).

const concept: ProjectRecord = {
  title: 'Түркістан облысындағы 100 МВт күн электр стансасы',
  summary: 'Қуаты 100 МВт күн электр стансасын МЖӘ моделімен салу',
  sector: 'energy',
  region: 'turkistan',
  model: 'ppp',
  amountMusd: 120,
  level: '1',
  owner: { id: 'org-17', name: 'ТОО «Нұр-Энерго Инвест»' },
  purpose: '100 МВт күн электр стансасын салу және желіге қосу',
  responsibleManager: { name: 'Әлия Сәрсенбай' },
}

const verified: ProjectRecord = {
  documentsVerified: true,
  landStatusVerified: true,
  initialRisksVerified: true,
}

const approved: ProjectRecord = {
  committeeDecision: 'approved',
  passportReady: true,
  feasibilityStudyReady: true,
}

const funded: ProjectRecord = {
  amounts: {
    declared: 120,
    loi: 80,
    contract: 60,
    received: 15,
    receivedEvidenceFiles: 2,
    associationContribution: 'direct',
  },
}

describe('canPromoteToLevel: 1-деңгей (иесі, орны, мақсаты)', () => {
  it('иесі, орны және мақсаты жазылса, жоба 1-деңгейге қабылданады', () => {
    const result = canPromoteToLevel({ ...concept, level: null }, '1')
    expect(result).toEqual({ ok: true, missing: [] })
  })

  it('иесі жоқ болса, owner жетіспейді', () => {
    const result = canPromoteToLevel({ ...concept, level: null, owner: null }, '1')
    expect(result).toEqual({ ok: false, missing: ['owner'] })
  })

  it('орны (өңір) мен мақсаты жоқ немесе бос болса, екеуі де жетіспейді', () => {
    const result = canPromoteToLevel({ ...concept, level: null, region: null, purpose: '   ' }, '1')
    expect(result).toEqual({ ok: false, missing: ['location', 'purpose'] })
  })

  it('иесі тек атымен берілсе де есептеледі', () => {
    const project: ProjectRecord = { ...concept, level: null, owner: { name: 'Silk Road Energy Ltd' } }
    expect(canPromoteToLevel(project, '1').ok).toBe(true)
  })
})

describe('canPromoteToLevel: 2-деңгей (құжаттар, жер мәртебесі, бастапқы тәуекелдер)', () => {
  it('құжаттар, жер мәртебесі және бастапқы тәуекелдер тексерілсе, 2-деңгейге көтеріледі', () => {
    expect(canPromoteToLevel({ ...concept, ...verified }, '2')).toEqual({ ok: true, missing: [] })
  })

  it('тексерілмеген құжаттар мен тәуекелдер жетіспейтін талап ретінде көрсетіледі', () => {
    const result = canPromoteToLevel({ ...concept, landStatusVerified: true }, '2')
    expect(result).toEqual({ ok: false, missing: ['documents', 'initialRisks'] })
  })
})

describe('canPromoteToLevel: 3-деңгей (комитет, паспорт, ТЭН)', () => {
  it('комитет бекітіп, паспорт пен алдын ала ТЭН дайын болса, 3-деңгейге көтеріледі', () => {
    const project: ProjectRecord = { ...concept, level: '2', ...verified, ...approved }
    expect(canPromoteToLevel(project, '3')).toEqual({ ok: true, missing: [] })
  })

  it('1-деңгейден тікелей 3-деңгейге секіруге болмайды (барлық шарт орындалса да)', () => {
    const project: ProjectRecord = { ...concept, level: '1', ...verified, ...approved }
    expect(canPromoteToLevel(project, '3')).toEqual({ ok: false, missing: ['level-skip'] })
  })

  it('1-деңгейден тікелей 4-деңгейге де секіруге болмайды', () => {
    const project: ProjectRecord = { ...concept, level: '1', ...verified, ...approved, ...funded }
    expect(canPromoteToLevel(project, '4').missing).toEqual(['level-skip'])
  })

  it('тексерілмеген жоба 3-деңгейге көтерілмейді: комитет шешімі жоқ', () => {
    const project: ProjectRecord = {
      ...concept,
      level: '2',
      ...verified,
      passportReady: true,
      feasibilityStudyReady: true,
    }
    expect(canPromoteToLevel(project, '3')).toEqual({ ok: false, missing: ['committeeApproval'] })
  })

  it('комитет шешімі күтілуде немесе қабылданбаған болса да 3-деңгейге көтерілмейді', () => {
    for (const committeeDecision of ['pending', 'rejected', null] as const) {
      const project: ProjectRecord = { ...concept, level: '2', ...verified, ...approved, committeeDecision }
      expect(canPromoteToLevel(project, '3').missing).toEqual(['committeeApproval'])
    }
  })

  it('паспорт пен ТЭН дайын болмаса, комитет бекіткен жоба да көтерілмейді', () => {
    const project: ProjectRecord = {
      ...concept,
      level: '2',
      ...verified,
      committeeDecision: 'approved',
    }
    expect(canPromoteToLevel(project, '3').missing).toEqual(['passport', 'feasibilityStudy'])
  })

  it('міндетті өрістер жоқ болса, комитет бекітсе де 3-деңгейге көтерілмейді', () => {
    const project: ProjectRecord = { ...concept, level: '2', owner: null, purpose: null, ...approved }
    const result = canPromoteToLevel(project, '3')
    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(['owner', 'purpose', 'documents', 'landStatus', 'initialRisks'])
  })
})

describe('canPromoteToLevel: 4-деңгей (қаражат түсуі құжатпен расталды)', () => {
  const level3: ProjectRecord = { ...concept, level: '3', ...verified, ...approved }

  it('қаражаттың түсуі дәлел файлымен расталса, 4-деңгейге көтеріледі', () => {
    expect(canPromoteToLevel({ ...level3, ...funded }, '4')).toEqual({ ok: true, missing: [] })
  })

  it('түскен сома бар, бірақ дәлел файлы жоқ болса, 4-деңгейге көтерілмейді', () => {
    const project: ProjectRecord = { ...level3, amounts: { received: 15, receivedEvidenceFiles: 0 } }
    expect(canPromoteToLevel(project, '4').missing).toEqual(['fundsReceiptEvidence'])
  })

  it('мәлімделген сома қаражат түскеніне дәлел емес', () => {
    const project: ProjectRecord = { ...level3, amounts: { declared: 500, loi: 300, contract: 200 } }
    expect(canPromoteToLevel(project, '4').missing).toEqual(['fundsReceiptEvidence'])
  })

  it('түскен сома 0 болса, дәлел файлымен де 4-деңгейге көтерілмейді', () => {
    const project: ProjectRecord = { ...level3, amounts: { received: 0, receivedEvidenceFiles: 1 } }
    expect(canPromoteToLevel(project, '4').ok).toBe(false)
  })
})

describe('canPromoteToLevel: жалпы ережелер', () => {
  it('сол немесе төменгі деңгейге көтеру жоқ', () => {
    const project: ProjectRecord = { ...concept, level: '3', ...verified, ...approved }
    expect(canPromoteToLevel(project, '3').missing).toEqual(['target-not-higher'])
    expect(canPromoteToLevel(project, '2').missing).toEqual(['target-not-higher'])
  })

  it('жарамсыз деңгей қабылданбайды', () => {
    expect(canPromoteToLevel(concept, '5' as ProjectLevelValue)).toEqual({
      ok: false,
      missing: ['invalid-level'],
    })
  })

  it('сан түрінде берілген деңгей де танылады (URL параметрінен келгенде)', () => {
    const project: ProjectRecord = { ...concept, ...verified }
    expect(canPromoteToLevel(project, 2 as unknown as ProjectLevelValue).ok).toBe(true)
    expect(canPromoteToLevel(project, 3 as unknown as ProjectLevelValue).missing).toEqual([
      'level-skip',
    ])
  })

  it('деңгейі жоқ жоба 2-деңгейге тікелей көтерілмейді', () => {
    const project: ProjectRecord = { ...concept, level: null, ...verified }
    expect(canPromoteToLevel(project, '2').missing).toEqual(['level-skip'])
  })
})

describe('canPublishToCatalog: ашық каталог (ТТ 8.3)', () => {
  const level2: ProjectRecord = { ...concept, ...verified, level: '2', publishToCatalog: true }
  const level3: ProjectRecord = { ...level2, level: '3', ...approved }

  it('2-деңгейлі жоба жариялауға рұқсат белгісі болса, жарияланады', () => {
    expect(canPublishToCatalog(level2)).toEqual({ ok: true, missing: [] })
  })

  it('рұқсат белгісі жоқ немесе өшірулі 2-деңгейлі жоба жарияланбайды', () => {
    for (const publishToCatalog of [false, null, undefined]) {
      expect(canPublishToCatalog({ ...level2, publishToCatalog }).missing).toEqual([
        'publish-permission',
      ])
    }
  })

  it('тексерілмеген 1-деңгейлі жоба каталогқа шықпайды, жариялау белгісі қойылса да', () => {
    const result = canPublishToCatalog({ ...concept, level: '1', publishToCatalog: true })
    expect(result).toEqual({ ok: false, missing: ['level-not-publishable'] })
  })

  it('3-деңгейлі жоба комитет шешімінсіз жарияланбайды', () => {
    for (const committeeDecision of ['pending', 'rejected', null, undefined] as const) {
      expect(canPublishToCatalog({ ...level3, committeeDecision }).missing).toEqual([
        'committeeApproval',
      ])
    }
  })

  it('3-деңгейлі жоба комитет бекітіп, рұқсат берсе, жарияланады', () => {
    expect(canPublishToCatalog(level3)).toEqual({ ok: true, missing: [] })
  })

  it('4-деңгейлі жоба каталогқа шықпайды: ол нәтиже ретінде көрсетіледі', () => {
    expect(canPublishToCatalog({ ...level3, level: '4' }).missing).toEqual(['level-not-publishable'])
  })

  it('деңгейі жоқ жоба жарияланбайды', () => {
    expect(canPublishToCatalog({ ...level2, level: null }).ok).toBe(false)
    expect(canPublishToCatalog({}).missing).toEqual(['level-not-publishable', 'publish-permission'])
  })
})

describe('toPublicProject: ашық карточка (ТТ 7.4)', () => {
  const internal: ProjectRecord = { ...concept, level: '3', ...verified, ...approved, ...funded }

  it('ашық карточкада тек ТТ 7.4 тізіміндегі 8 өріс бар', () => {
    expect(Object.keys(toPublicProject(internal)).sort()).toEqual([
      'amountMusd',
      'level',
      'model',
      'region',
      'responsibleManager',
      'sector',
      'summary',
      'title',
    ])
  })

  it('ашық өрістердің мәні дұрыс көшіріледі', () => {
    expect(toPublicProject(internal)).toEqual({
      title: 'Түркістан облысындағы 100 МВт күн электр стансасы',
      sector: 'energy',
      region: 'turkistan',
      amountMusd: 120,
      model: 'ppp',
      level: '3',
      summary: 'Қуаты 100 МВт күн электр стансасын МЖӘ моделімен салу',
      responsibleManager: 'Әлия Сәрсенбай',
    })
  })

  it('ашық проекцияда жоба иесінің аты мен идентификаторы жоқ', () => {
    const json = JSON.stringify(toPublicProject(internal))
    expect(json).not.toContain('Нұр-Энерго')
    expect(json).not.toContain('org-17')
    expect(json).not.toContain('owner')
  })

  it('төрт сома, құжаттар және құпия деректер ашық проекцияға кірмейді', () => {
    const withSecrets = {
      ...internal,
      ownerName: 'ТОО «Нұр-Энерго Инвест»',
      documents: [{ name: 'financial-model.xlsx' }],
      internalNotes: 'Комитетте екі мүше қарсы болды',
      bankAccount: 'KZ86125KZT5004100100',
    }
    const projection = toPublicProject(withSecrets)
    const json = JSON.stringify(projection)
    for (const secret of ['amounts', 'declared', 'loi', 'contract', 'received', 'documents']) {
      expect(json).not.toContain(secret)
    }
    for (const secret of ['Комитетте', 'KZ86125', 'financial-model', 'Нұр-Энерго']) {
      expect(json).not.toContain(secret)
    }
  })

  it('болжамды көлем ашық, бірақ ол төрт соманың бірі емес', () => {
    const projection = toPublicProject({ ...internal, amountMusd: 120, amounts: { declared: 999 } })
    expect(projection.amountMusd).toBe(120)
    expect(JSON.stringify(projection)).not.toContain('999')
  })

  it('жауапты менеджерден тек аты шығады (пошта мен рөл шықпайды)', () => {
    const project = {
      ...internal,
      responsibleManager: { name: ' Әлия Сәрсенбай ', email: 'aliya@example.org', roles: ['secretariat'] },
    }
    const projection = toPublicProject(project)
    expect(projection.responsibleManager).toBe('Әлия Сәрсенбай')
    expect(JSON.stringify(projection)).not.toContain('example.org')
    expect(JSON.stringify(projection)).not.toContain('secretariat')
  })

  it('бастапқы объектіні өзгертпейді және жаңа объект қайтарады', () => {
    const before = structuredClone(internal)
    const projection = toPublicProject(internal)
    expect(internal).toEqual(before)
    expect(projection).not.toBe(internal)
  })

  it('жетіспейтін немесе жарамсыз өрістер null болады', () => {
    expect(toPublicProject({})).toEqual({
      title: null,
      sector: null,
      region: null,
      amountMusd: null,
      model: null,
      level: null,
      summary: null,
      responsibleManager: null,
    })
    expect(toPublicProject({ amountMusd: Number.NaN }).amountMusd).toBeNull()
    expect(toPublicProject({ responsibleManager: { name: '  ' } }).responsibleManager).toBeNull()
  })
})
