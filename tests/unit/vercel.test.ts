import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { noindexHeader, siteIndexable } from '@/lib/indexing'
import { firstRegisterAllowed } from '@/lib/portal/setup'

// Vercel preview дайындығы (docs/DEPLOY_VERCEL.md): индекстеу жабық, бірінші әкімші қорғалған, медиа Blob-та, env атаулары құжатталған.
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('индекстеу (src/lib/indexing.ts)', () => {
  it('Vercel preview/development жабық, production және Vercel емес орта ашық', () => {
    expect(siteIndexable({ VERCEL_ENV: 'preview' })).toBe(false)
    expect(siteIndexable({ VERCEL_ENV: 'development' })).toBe(false)
    expect(siteIndexable({ VERCEL_ENV: 'production' })).toBe(true)
    expect(siteIndexable({})).toBe(true)
  })

  it('ALLOW_INDEXING қолмен басады', () => {
    expect(siteIndexable({ VERCEL_ENV: 'preview', ALLOW_INDEXING: 'true' })).toBe(true)
    expect(siteIndexable({ VERCEL_ENV: 'production', ALLOW_INDEXING: 'false' })).toBe(false)
    expect(siteIndexable({ ALLOW_INDEXING: ' FALSE ' })).toBe(false)
  })

  it('тақырып noindex, nofollow қамтиды', () => {
    expect(noindexHeader).toContain('noindex')
    expect(noindexHeader).toContain('nofollow')
  })

  it('robots, sitemap, layout және proxy осы функцияны қолданады', () => {
    expect(read('src/app/robots.ts')).toContain('siteIndexable')
    expect(read('src/app/sitemap.ts')).toContain('siteIndexable')
    expect(read('src/app/(site)/[locale]/layout.tsx')).toContain('siteIndexable')
    expect(read('src/proxy.ts')).toContain('X-Robots-Tag')
  })
})

describe('бірінші әкімшіні қорғау (src/lib/portal/setup.ts)', () => {
  const headers = (token?: string) => new Headers(token ? { 'x-setup-token': token } : {})
  const token = 'setup-token-0123456789'

  it('әзірлеуде еркін (тесттер мен жергілікті іске қосу)', () => {
    expect(firstRegisterAllowed(headers(), { NODE_ENV: 'development' })).toBe(true)
    expect(firstRegisterAllowed(headers(), {})).toBe(true)
  })

  it('өндірісте токен жоқ немесе қысқа болса, жабық', () => {
    expect(firstRegisterAllowed(headers(), { NODE_ENV: 'production' })).toBe(false)
    expect(firstRegisterAllowed(headers('abc'), { NODE_ENV: 'production', ADMIN_SETUP_TOKEN: 'abc' })).toBe(false)
  })

  it('өндірісте тек дұрыс x-setup-token ашады', () => {
    const env = { NODE_ENV: 'production', ADMIN_SETUP_TOKEN: token }
    expect(firstRegisterAllowed(headers(token), env)).toBe(true)
    expect(firstRegisterAllowed(headers(), env)).toBe(false)
    expect(firstRegisterAllowed(headers('setup-token-0123456780'), env)).toBe(false)
    expect(firstRegisterAllowed(headers(`${token}x`), env)).toBe(false)
  })

  it('proxy first-register-ді матчерге қосады', () => {
    const proxy = read('src/proxy.ts')
    expect(proxy).toContain("'/api/admins/first-register'")
    expect(proxy).toContain('firstRegisterAllowed')
  })
})

describe('Vercel конфигурациясы', () => {
  it('Blob плагині токен болғанда ғана қосылады, схема әрқашан бірдей (alwaysInsertFields)', () => {
    const config = read('src/payload.config.ts')
    expect(config).toContain('vercelBlobStorage')
    expect(config).toMatch(/enabled:\s*Boolean\(blobToken\)/)
    expect(config).toMatch(/alwaysInsertFields:\s*true/)
    expect(config).toMatch(/collections:\s*\{\s*media:\s*true\s*\}/)
  })

  it('Blob prefix миграциясы бар және index.ts-те тіркелген', () => {
    const files = fs.readdirSync(path.join(process.cwd(), 'src/migrations'))
    expect(files.some((file) => file.endsWith('_blob_prefix.ts'))).toBe(true)
    expect(read('src/migrations/index.ts')).toContain('blob_prefix')
  })

  it('vercel.json мен engines бар, build дерекқорсыз (layout dynamic)', () => {
    const vercel = JSON.parse(read('vercel.json')) as { framework: string; buildCommand: string }
    expect(vercel.framework).toBe('nextjs')
    expect(vercel.buildCommand).toBe('npm run build')
    expect((JSON.parse(read('package.json')) as { engines: { node: string } }).engines.node).toMatch(/^22/)
    expect(read('src/app/(site)/[locale]/layout.tsx')).toMatch(/export const dynamic = 'force-dynamic'/)
  })

  it('npm скриптері: migrate, create-admin, seed; env үлгісінде аттары бар (мәндері жоқ)', () => {
    const scripts = (JSON.parse(read('package.json')) as { scripts: Record<string, string> }).scripts
    for (const name of ['migrate', 'migrate:create', 'create-admin', 'seed']) expect(scripts[name], name).toBeTruthy()
    const env = read('.env.example')
    for (const name of ['DATABASE_URL', 'PAYLOAD_SECRET', 'BLOB_READ_WRITE_TOKEN', 'ADMIN_SETUP_TOKEN', 'ALLOW_INDEXING', 'PORTAL_MODE', 'NEXT_PUBLIC_SITE_URL']) {
      expect(env, name).toMatch(new RegExp(`^${name}=`, 'm'))
    }
    for (const secret of ['BLOB_READ_WRITE_TOKEN', 'ADMIN_SETUP_TOKEN', 'PAYLOAD_SECRET']) {
      expect(env, `${secret} мәні бос`).toMatch(new RegExp(`^${secret}=\\s*$`, 'm'))
    }
  })
})
