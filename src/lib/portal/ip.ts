/** Сұраудың IP-ін алады (прокси арқылы x-forwarded-for). Жергілікті dev-те бос болуы мүмкін. */
export const clientIp = (headers: Pick<Headers, 'get'> | undefined): string => {
  // Тесттер әртүрлі IP-ді модельдей алуы үшін (rate limit тәуелсіз болсын): өндірісте бұл тақырып ескерілмейді
  const simulated = process.env.NODE_ENV === 'production' ? null : headers?.get('x-test-client-ip')
  return simulated || headers?.get('x-forwarded-for')?.split(',')[0]?.trim() || headers?.get('x-real-ip') || 'unknown'
}
