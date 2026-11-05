import type { MetadataRoute } from 'next'

import { siteIndexable } from '@/lib/indexing'

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** robots.txt (ТТ 15): ашық бет индекстеледі, әкімші панелі, API және жеке кабинет жабық */
export default function robots(): MetadataRoute.Robots {
  // Vercel preview және басқа жабық орнатулар: барлығы жабық, sitemap жоқ (src/lib/indexing.ts)
  if (!siteIndexable()) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/kk/account', '/ru/account', '/en/account', '/zh/account'] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
