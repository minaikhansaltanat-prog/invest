import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'

// SVG сол домен астынан берілсе XSS векторы, сонымен қатар sharp/librsvg шабуыл беті.
// Сондықтан медиа жинағына тек растрлық сурет, PDF және MP4 жүктеледі.
const mimeTypes = (typeof Media.upload === 'object' ? Media.upload.mimeTypes : undefined) ?? []

describe('Медиа жүктеу қауіпсіздігі', () => {
  it('тізім ашық емес: image/* және */* жоқ', () => {
    expect(mimeTypes.length).toBeGreaterThan(0)
    expect(mimeTypes).not.toContain('image/*')
    expect(mimeTypes).not.toContain('*/*')
  })

  it('SVG қабылданбайды', () => {
    expect(mimeTypes.some((type) => type.toLowerCase().includes('svg'))).toBe(false)
  })

  it('қажетті түрлер рұқсат: JPEG, PNG, WebP, AVIF, PDF, MP4', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf', 'video/mp4']) {
      expect(mimeTypes, type).toContain(type)
    }
  })

  it('жүктеу, өзгерту, өшіру тек әкімшілерге ашық; оқу жария', async () => {
    type Req = { user: { collection: string } | null }
    type AccessFn = (args: { req: Req }) => boolean | Promise<boolean>
    const access = (Media.access ?? {}) as unknown as Record<'read' | 'create' | 'update' | 'delete', AccessFn>
    const guest: Req = { user: null }
    const investor: Req = { user: { collection: 'users' } }
    const staff: Req = { user: { collection: 'admins' } }

    expect(await access.read({ req: guest })).toBe(true)
    for (const action of ['create', 'update', 'delete'] as const) {
      expect(await access[action]({ req: guest }), `${action}: қонақ`).toBe(false)
      expect(await access[action]({ req: investor }), `${action}: инвестор`).toBe(false)
      expect(await access[action]({ req: staff }), `${action}: қызметкер`).toBe(true)
    }
  })
})
