import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Әзірлеу ортасы үшін қауіпсіз әдепкілер. `.env` файлына тиілмейді (NIGHT_TASK 3.5).
// Өндірісте (NODE_ENV=production) бұл мәндер міндетті түрде ортадан берілуі тиіс.
if (process.env.NODE_ENV !== 'production') {
  process.env.PAYLOAD_SECRET ||= 'dev-only-placeholder-not-a-secret'
  process.env.DATABASE_URL ||= 'postgresql://kfca:kfca@127.0.0.1:54329/kfca'
}
// Vercel-де NEXT_PUBLIC_SITE_URL берілмесе, canonical/hreflang/sitemap осы орнатудың өз адресіне сүйенеді (VERCEL_URL)
process.env.NEXT_PUBLIC_SITE_URL ||= process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const isProd = process.env.NODE_ENV === 'production'

// Қауіпсіздік тақырыптары (ТТ 14.1, 9-кезең). Сыртқы доменге рұқсат жоқ (Google/YouTube/CDN жоқ).
// 'unsafe-inline' скрипт/стиль үшін Next-тің ішкі скрипттері мен reveal-boot үшін әлі қажет; nonce негізді қатаң CSP (proxy.ts ішінде nonce беру) 9-кезеңнің келесі қадамы.
// Dev режимінде HMR үшін 'unsafe-eval' және ws қосылады.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${isProd ? '' : ' ws: wss:'}`,
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // HSTS тек өндірісте (HTTPS): localhost-та браузерді http-ге қатып қалдырмау үшін
  ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // Dev индикаторы скриншоттарда көрінбесін
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 78, 82, 90],
    deviceSizes: [360, 390, 640, 768, 1080, 1280, 1440, 1920],
    imageSizes: [48, 96, 168, 256, 384],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
