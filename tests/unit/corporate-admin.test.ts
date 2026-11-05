import type { CollectionConfig, GlobalConfig } from 'payload'
import { afterEach, describe, expect, it } from 'vitest'

import { Admins } from '@/collections/Admins'
import { Albums } from '@/collections/Albums'
import { AuditLog } from '@/collections/AuditLog'
import { CoiDeclarations } from '@/collections/CoiDeclarations'
import { DataroomFiles } from '@/collections/DataroomFiles'
import { DataroomLog } from '@/collections/DataroomLog'
import { Documents } from '@/collections/Documents'
import { Events } from '@/collections/Events'
import { Investors } from '@/collections/Investors'
import { Matches } from '@/collections/Matches'
import { Media } from '@/collections/Media'
import { Ndas } from '@/collections/Ndas'
import { News } from '@/collections/News'
import { Organizations } from '@/collections/Organizations'
import { Pages } from '@/collections/Pages'
import { Partners } from '@/collections/Partners'
import { People } from '@/collections/People'
import { Projects } from '@/collections/Projects'
import { Agreements, Issues, Members } from '@/collections/Registry'
import { Scorecards } from '@/collections/Scorecards'
import { Services } from '@/collections/Services'
import { Submissions } from '@/collections/Submissions'
import { Users } from '@/collections/Users'
import { Videos } from '@/collections/Videos'
import { Home } from '@/globals/Home'
import { KpiTargets } from '@/globals/KpiTargets'
import { ScoringConfig } from '@/globals/ScoringConfig'
import { Settings } from '@/globals/Settings'
import {
  adminGroups,
  corporateHiddenCollections,
  corporateHiddenGlobals,
  corporateVisibleCollections,
  corporateVisibleGlobals,
} from '@/lib/admin-nav'

// Corporate режимінде админка: көрінетін жинақтар төрт топта (Мазмұн, Медиа, Өтініштер, Жүйе), инвестициялық модуль жасырын.
// Full режимінде бәрі бұрынғыдай көрінеді. Жасырын жинақ дерекқорда, миграцияда және API-да сол күйінде қалады.
const collections: CollectionConfig[] = [
  Admins, Albums, AuditLog, CoiDeclarations, DataroomFiles, DataroomLog, Documents, Events, Investors, Matches, Media, Ndas, News,
  Organizations, Pages, Partners, People, Projects, Agreements, Members, Issues, Scorecards, Services, Submissions, Users, Videos,
]
const globals: GlobalConfig[] = [Home, KpiTargets, ScoringConfig, Settings]

type Hidden = boolean | ((args: { user: never }) => boolean) | undefined
const isHidden = (hidden: Hidden) => (typeof hidden === 'function' ? hidden({ user: null as never }) : Boolean(hidden))
const hiddenIn = (config: CollectionConfig | GlobalConfig) => isHidden(config.admin?.hidden as Hidden)

const original = process.env.PORTAL_MODE
afterEach(() => {
  if (original === undefined) delete process.env.PORTAL_MODE
  else process.env.PORTAL_MODE = original
})

describe('админка: corporate режимі', () => {
  it('әр жинақ пен глобал бір тізімде: көрінетін немесе жасырын (жаңасы қосылса, шешім қабылдау керек)', () => {
    const visible = [...Object.values(corporateVisibleCollections).flat()] as string[]
    const hidden = [...corporateHiddenCollections] as string[]
    expect([...visible, ...hidden].sort()).toEqual(collections.map((collection) => collection.slug).sort())
    const visibleGlobals = [...Object.values(corporateVisibleGlobals).flat()] as string[]
    expect([...visibleGlobals, ...corporateHiddenGlobals].sort()).toEqual(globals.map((global) => global.slug).sort())
  })

  it('инвестициялық жинақтар, портал қолданушылары, KPI мен бағалау баптаулары жасырын', () => {
    process.env.PORTAL_MODE = 'corporate'
    for (const slug of corporateHiddenCollections) {
      const config = collections.find((collection) => collection.slug === slug)
      expect(config, slug).toBeDefined()
      expect(hiddenIn(config!), slug).toBe(true)
    }
    for (const slug of corporateHiddenGlobals) {
      expect(hiddenIn(globals.find((global) => global.slug === slug)!), slug).toBe(true)
    }
  })

  it('мазмұн, медиа, өтініштер, әкімшілер және Басты бет пен Баптаулар көрінеді', () => {
    process.env.PORTAL_MODE = 'corporate'
    for (const slug of Object.values(corporateVisibleCollections).flat()) {
      expect(hiddenIn(collections.find((collection) => collection.slug === slug)!), slug).toBe(false)
    }
    for (const slug of Object.values(corporateVisibleGlobals).flat()) {
      expect(hiddenIn(globals.find((global) => global.slug === slug)!), slug).toBe(false)
    }
  })

  it('full режимінде ештеңе жасырылмайды', () => {
    process.env.PORTAL_MODE = 'full'
    for (const config of [...collections, ...globals]) expect(hiddenIn(config), config.slug).toBe(false)
  })

  it('көрінетін жинақтар төрт қазақша топқа бөлінген', () => {
    expect(adminGroups.content.kk).toBe('Мазмұн')
    expect(adminGroups.media.kk).toBe('Медиа')
    expect(adminGroups.requests.kk).toBe('Өтініштер')
    expect(adminGroups.system.kk).toBe('Жүйе')
    for (const [group, slugs] of Object.entries(corporateVisibleCollections)) {
      for (const slug of slugs) {
        const config = collections.find((collection) => collection.slug === slug)!
        expect(config.admin?.group, slug).toBe(adminGroups[group as keyof typeof adminGroups])
      }
    }
    expect(Home.admin?.group).toBe(adminGroups.content)
    expect(Settings.admin?.group).toBe(adminGroups.system)
  })

  it('әр топтың атауы төрт тілде толық және em dash жоқ', () => {
    for (const group of Object.values(adminGroups)) {
      for (const text of Object.values(group)) {
        expect(text.length).toBeGreaterThan(0)
        expect(text).not.toContain('—')
      }
    }
  })

  it('Басты бет: инвестициялық қойындылар corporate-та жасырын, full-да көрінеді', () => {
    const tabs = (Home.fields.find((field) => field.type === 'tabs') as { tabs: { name?: string; admin?: { condition?: () => boolean } }[] }).tabs
    const investment = ['audience', 'results', 'lifecycle', 'projects', 'corridors', 'scoring', 'membership']
    const shared = ['hero', 'services', 'leadership', 'media']
    process.env.PORTAL_MODE = 'corporate'
    for (const name of investment) expect(tabs.find((tab) => tab.name === name)?.admin?.condition?.(), name).toBe(false)
    for (const name of shared) expect(tabs.find((tab) => tab.name === name)?.admin?.condition?.() ?? true, name).toBe(true)
    process.env.PORTAL_MODE = 'full'
    for (const name of investment) expect(tabs.find((tab) => tab.name === name)?.admin?.condition?.(), name).toBe(true)
  })
})
