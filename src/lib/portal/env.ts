// Серверлік құпиялар мен қауіпсіздік параметрлері (ТТ 14.1). Өндірісте құпия кілттер міндетті, dev-те ашық placeholder.

const isProd = () => process.env.NODE_ENV === 'production'

/** Payload құпиясы: сессия, шифрлау және cookie қолтаңбасы үшін негіз */
export function appSecret(): string {
  const value = process.env.PAYLOAD_SECRET || (isProd() ? '' : 'dev-only-placeholder-not-a-secret')
  if (!value) throw new Error('PAYLOAD_SECRET бос: өндірісте міндетті')
  return value
}

/** ALTCHA HMAC кілті: бөлек берілмесе, PAYLOAD_SECRET-тен туынды алынады (dev) */
export const altchaKey = (): string => process.env.ALTCHA_HMAC_KEY || `altcha:${appSecret()}`

/** TOTP кілтін шифрлау құпиясы */
export const twoFactorEncryptionSecret = (): string => process.env.TWOFA_ENC_KEY || `twofa:${appSecret()}`

/**
 * Әкімші панелі үшін 2FA міндетті ме (ТТ 14.1). Өндірісте әдепкіде иә, dev-те әдепкіде жоқ (ADMIN_2FA=on қосады, off өшіреді).
 * Dev-те өшірулі болуы тесттер мен жергілікті әзірлеуді жеңілдетеді; өндіріс конфигурациясын бұл өзгертпейді.
 */
export function adminTwoFactorRequired(): boolean {
  const flag = (process.env.ADMIN_2FA ?? '').toLowerCase()
  if (flag === 'on') return true
  if (flag === 'off') return false
  return isProd()
}

/** Cookie `Secure` белгісі: тек өндірісте (HTTPS), жергілікті http://localhost-та жоқ */
export const isSecureEnv = (): boolean => isProd()

/** Сайттың көрсетілетін атауы (2FA қосымшасындағы issuer) */
export const twoFactorIssuer = 'KFCA'
