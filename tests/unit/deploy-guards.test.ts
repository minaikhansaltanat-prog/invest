import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

// Өндіріс құрастыруын шын браузерде тексергенде табылған ақаулардың регрессия күзеті (docs/PROGRESS.md, 57-59).
// Бұлар мәтін деңгейіндегі тексерулер: нақты мінез-құлықты `next build` (CI) пен браузер тексерісі растайды.
const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

describe('Орналастыру күзеті', () => {
  it('сайт layout-ы әр сұраныста жасалады: `next build` дерекқорсыз (Docker, CI) өтеді', () => {
    const layout = read('src/app/(site)/[locale]/layout.tsx')
    expect(layout).toMatch(/export const dynamic = 'force-dynamic'/)
  })

  it('әкімші аватары Gravatar-дан жүктелмейді (дербес деректер үшінші жаққа кетпейді, CSP блоктамайды)', () => {
    expect(read('src/payload.config.ts')).toMatch(/avatar:\s*'default'/)
  })

  it('Zod JIT браузерде өшіріледі: схемалары бар файлдар zod-config-ті импорттайды', () => {
    for (const file of ['src/lib/forms/definitions.ts', 'src/lib/forms/auth.ts']) {
      expect(read(file), file).toContain("import '@/lib/forms/zod-config'")
    }
  })

  it('CSP `img-src` пен `connect-src` ішінде сыртқы хост жоқ', () => {
    const config = read('next.config.ts')
    for (const directive of ['img-src', 'connect-src', 'script-src', 'font-src', 'style-src']) {
      const line = config.split('\n').find((row) => row.includes(`${directive} `))
      expect(line, directive).toBeTruthy()
      expect(line, directive).not.toMatch(/https?:\/\//)
    }
  })
})
