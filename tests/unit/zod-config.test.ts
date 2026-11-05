import { afterEach, describe, expect, it, vi } from 'vitest'

// Браузердегі CSP `script-src` eval-ға тыйым салады, ал Zod 4 JIT үшін `new Function` сынайды (консольге CSP қатесі шығады).
// Сондықтан браузерде JIT өшіріледі, серверде қосулы қалады (src/lib/forms/zod-config.ts).
async function loadWith(browser: boolean) {
  if (browser) vi.stubGlobal('window', {})
  vi.resetModules()
  const core = await import('zod/v4/core')
  core.config({ jitless: false })
  await import('@/lib/forms/zod-config')
  return core.config().jitless
}

describe('Zod JIT конфигурациясы (CSP eval)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('серверде (window жоқ) JIT қосулы қалады', async () => {
    expect(await loadWith(false)).not.toBe(true)
  })

  it('браузерде (window бар) JIT өшіріледі: eval шақырылмайды', async () => {
    expect(await loadWith(true)).toBe(true)
  })

  it('JIT өшірулі болса да схемалар дұрыс тексереді', async () => {
    vi.stubGlobal('window', {})
    vi.resetModules()
    await import('@/lib/forms/zod-config')
    const { z } = await import('zod')
    const schema = z.object({ email: z.string().email(), age: z.number().int().min(18) })
    expect(schema.safeParse({ email: 'a@b.kz', age: 30 }).success).toBe(true)
    expect(schema.safeParse({ email: 'жоқ', age: 10 }).success).toBe(false)
  })
})
