import type { Media } from '@/payload-types'

export type ResolvedMedia = { src: string; alt: string; width: number; height: number }

/**
 * Payload жүктемесі (depth >= 1 болғанда толық нысан) next/image-ке ыңғайлы түрге.
 * Нысан толтырылмаса (тек id) немесе файл жоқ болса, null қайтарады.
 */
export function mediaOf(value: number | Media | null | undefined): ResolvedMedia | null {
  if (!value || typeof value === 'number' || !value.url) return null
  return {
    src: value.url,
    alt: value.alt ?? '',
    width: value.width ?? 1200,
    height: value.height ?? 800,
  }
}
