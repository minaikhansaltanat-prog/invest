import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { migrations } from '@/migrations'

// Өндірісте `push` өшірулі: схема тек src/migrations ішіндегі файлдардан келеді (prodMigrations).
// Тест миграция файлы index.ts-ке қосылмай қалмауын және әр миграцияның толық болуын қамтамасыз етеді.
const dir = path.join(process.cwd(), 'src', 'migrations')
const names = fs
  .readdirSync(dir)
  .filter((file) => /^\d{8}_\d{6}_.+\.ts$/.test(file))
  .map((file) => file.replace(/\.ts$/, ''))
  .sort()

describe('Payload миграциялары', () => {
  it('кемінде бір миграция бар (бос дерекқорда кестелер жасалады)', () => {
    expect(names.length).toBeGreaterThan(0)
  })

  it('index.ts барлық миграция файлын тізімдейді және реті уақыт бойынша', () => {
    const listed = migrations.map((migration) => migration.name)
    expect([...listed].sort()).toEqual(names)
    expect(listed).toEqual([...listed].sort())
  })

  it('әр миграцияда up және down функциясы бар', () => {
    for (const migration of migrations) {
      expect(typeof migration.up, `${migration.name}.up`).toBe('function')
      expect(typeof migration.down, `${migration.name}.down`).toBe('function')
    }
  })

  it('әр миграцияның схема суреті (JSON) бар: келесі migrate:create соны негізге алады', () => {
    for (const name of names) {
      const snapshot = path.join(dir, `${name}.json`)
      expect(fs.existsSync(snapshot), `${name}.json`).toBe(true)
      const parsed = JSON.parse(fs.readFileSync(snapshot, 'utf8')) as { tables?: Record<string, unknown> }
      expect(Object.keys(parsed.tables ?? {}).length, `${name}.json кестелері`).toBeGreaterThan(0)
    }
  })
})
