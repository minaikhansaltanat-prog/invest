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
process.env.NEXT_PUBLIC_SITE_URL ||= 'http://localhost:3000'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 82, 90],
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
