/**
 * schema.org JSON-LD (ТТ 15). `<` таңбасы <-ға ауыстырылады: мазмұн `</script>` арқылы блоктан шыға алмайды (XSS жоқ).
 * type="application/ld+json" скрипті орындалмайды (деректер блогы).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export function organizationSchema(input: { name: string; legalName?: string; phone?: string | null; address?: string | null; locale: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.name,
    legalName: input.legalName ?? input.name,
    url: `${siteUrl()}/${input.locale}`,
    logo: `${siteUrl()}/icons/icon-192.png`,
    foundingDate: '2017-01-17',
    taxID: '170140015381',
    ...(input.phone ? { telephone: input.phone } : {}),
    ...(input.address ? { address: { '@type': 'PostalAddress', streetAddress: input.address, addressCountry: 'KZ' } } : {}),
  }
}

export function breadcrumbSchema(locale: string, crumbs: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.path !== undefined ? { item: `${siteUrl()}/${locale}${crumb.path === '/' ? '' : crumb.path}` } : {}),
    })),
  }
}
