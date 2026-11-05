import type { MetadataRoute } from 'next'

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/** robots.txt (ТТ 15): ашық бет индекстеледі, әкімші панелі, API және жеке кабинет жабық */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/kk/account', '/ru/account', '/en/account', '/zh/account'] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
