/**
 * Сайт іздеу жүйелеріне ашық па. Vercel preview/development орнатуларында жабық (robots, X-Robots-Tag, meta robots, sitemap бос);
 * өндірісте (Vercel production, Docker, жергілікті `next start`) ашық. `ALLOW_INDEXING=true|false` мұны қолмен басады
 * (мысалы, Vercel production-ды іске қосылғанға дейін жабық ұстау: ALLOW_INDEXING=false).
 */
export function siteIndexable(env: Record<string, string | undefined> = process.env): boolean {
  const flag = env.ALLOW_INDEXING?.trim().toLowerCase()
  if (flag === 'true') return true
  if (flag === 'false') return false
  return !env.VERCEL_ENV || env.VERCEL_ENV === 'production'
}

/** Жабық орнатуларға қосылатын тақырып мәні */
export const noindexHeader = 'noindex, nofollow, noarchive'
