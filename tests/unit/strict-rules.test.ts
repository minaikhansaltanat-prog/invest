import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const root = process.cwd()

function walk(dir: string, accept: (file: string) => boolean, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.data'].includes(entry.name)) continue
      walk(full, accept, out)
    } else if (accept(full)) {
      out.push(full)
    }
  }
  return out
}

describe('қатаң ережелер (NIGHT_TASK 3.5)', () => {
  it('messages және content ішінде ұзын сызықша (U+2014) жоқ', () => {
    const files = [
      ...walk(path.join(root, 'messages'), () => true),
      ...walk(path.join(root, 'content'), () => true),
    ]
    const offenders = files.filter((file) => fs.readFileSync(file, 'utf8').includes('—'))
    expect(offenders.map((file) => path.relative(root, file))).toEqual([])
  })

  it('қолданба кодында Google сервистеріне тәуелділік жоқ (ТТ 11.3)', () => {
    const banned = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'maps.googleapis.com',
      'google.com/maps',
      'google.com/recaptcha',
      'gstatic.com/recaptcha',
      'youtube.com',
      'youtu.be',
      'googletagmanager.com',
      'google-analytics.com',
    ]
    const files = walk(path.join(root, 'src'), (file) => /\.(tsx?|css|scss|json|mjs)$/.test(file))
    const hits: string[] = []
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8')
      for (const needle of banned) {
        if (text.includes(needle)) hits.push(`${path.relative(root, file)}: ${needle}`)
      }
    }
    expect(hits).toEqual([])
  })

  it('.env.example ішінде нақты құпия мән жоқ', () => {
    const text = fs.readFileSync(path.join(root, '.env.example'), 'utf8')
    for (const key of ['PAYLOAD_SECRET', 'S3_SECRET_ACCESS_KEY', 'SMTP_PASS', 'ALTCHA_HMAC_KEY', 'TWOFA_ENC_KEY']) {
      const line = text.split('\n').find((row) => row.startsWith(`${key}=`))
      expect(line, key).toBeDefined()
      expect(line!.slice(key.length + 1).trim(), `${key} бос болуы тиіс`).toBe('')
    }
  })
})
