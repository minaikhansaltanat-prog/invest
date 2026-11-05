// WCAG 2.2 контраст есебі: мәтін кемінде 4.5:1, үлкен мәтін (24 px+ немесе 18.66 px+ қалың) кемінде 3:1 (ТТ 12.6).

/** Дизайн токендерінің HEX мәндері (globals.css ішіндегі @theme-мен сәйкес болуы тиіс: тест тексереді) */
export const tokens = {
  'navy-950': '#071631',
  'navy-900': '#0B1E3F',
  'navy-800': '#12295A',
  'navy-700': '#1B3A7A',
  'navy-600': '#25508F',
  sky: '#3BAEDC',
  'gold-300': '#E6CE8E',
  'gold-400': '#D7B868',
  'gold-500': '#C49A3C',
  'gold-600': '#A07A26',
  'gold-700': '#7F5F18',
  ivory: '#FAF7F0',
  paper: '#FFFFFF',
  sand: '#F2ECDF',
  ink: '#0E1A2B',
  muted: '#5A6A80',
  line: '#E5DDCB',
  success: '#1E7A4C',
  'success-bg': '#E9F7EF',
  'info-bg': '#EEF4FB',
  'warn-bg': '#FBF6EA',
  'warn-ink': '#6B5320',
  danger: '#A3322B',
  'danger-bg': '#FBECEB',
} as const

export type TokenName = keyof typeof tokens

const channel = (value: number) => {
  const v = value / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

export function luminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground)
  const b = luminance(background)
  const [light, dark] = a > b ? [a, b] : [b, a]
  return (light + 0.05) / (dark + 0.05)
}

export const tokenContrast = (fg: TokenName, bg: TokenName) => contrastRatio(tokens[fg], tokens[bg])
