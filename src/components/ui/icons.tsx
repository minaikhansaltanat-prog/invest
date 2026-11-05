import type { ReactNode, SVGProps } from 'react'

// Барлық иконка SVG, бір стиль: жіңішке сызық, дөңгеленген ұштар. Эмодзи иконка ретінде қолданылмайды.

type SvgProps = Omit<SVGProps<SVGSVGElement>, 'name'>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/* ---------- 24 px: интерфейс иконкалары ---------- */
const ui = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  'arrow-left': <path d="M19 12H5M11 6l-6 6 6 6" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 2.5 4.2 5.5 4.2 9S15 18.5 12 21c-3-2.5-4.2-5.5-4.2-9S9 5.5 12 3z" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5-8 8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v5M12 17.6v.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.6v.4" />
    </>
  ),
  shield: <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  document: (
    <>
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5M9 13h7M9 17h7" />
    </>
  ),
  wechat: (
    <>
      <path d="M9.5 4C5.4 4 2.5 6.6 2.5 9.8c0 1.8 1 3.4 2.6 4.4L4.5 16.5l2.5-1.2c.8.2 1.6.3 2.5.3" />
      <path d="M14.5 9c-3.3 0-6 2.1-6 4.8s2.7 4.7 6 4.7c.7 0 1.4-.1 2-.3l2.2 1.1-.5-2c1.3-.9 2.3-2.1 2.3-3.5 0-2.7-2.7-4.8-6-4.8z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  sparkle: <path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ui

export function Icon({ name, size = 20, strokeWidth = 2, ...rest }: SvgProps & { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
      {...base}
      {...rest}
    >
      {ui[name]}
    </svg>
  )
}

/* ---------- 40 px: қызмет иконкалары (дизайн үлгісінен) ---------- */
const service = {
  globe: (
    <>
      <circle cx="20" cy="20" r="15" />
      <path d="M5 20h30M20 5c5 4 7 9 7 15s-2 11-7 15c-5-4-7-9-7-15s2-11 7-15" />
    </>
  ),
  layers: (
    <>
      <path d="M20 6 34 13 20 20 6 13z" />
      <path d="m6 20 14 7 14-7M6 27l14 7 14-7" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M20 5 33 10v9c0 8-5.5 13.5-13 16-7.5-2.5-13-8-13-16v-9z" />
      <path d="m14 20 4 4 8-8" />
    </>
  ),
  factory: (
    <>
      <path d="M5 34V18l9 5v-5l9 5v-5l9 5V8h3v26z" />
      <path d="M11 29h3M18 29h3M25 29h3" />
    </>
  ),
  chart: (
    <>
      <path d="M6 33h28" />
      <path d="M10 33V22M17 33V15M24 33V19M31 33V9" />
      <path d="m8 16 8-7 7 5 9-7" />
    </>
  ),
  columns: (
    <>
      <path d="M5 14 20 6l15 8z" />
      <path d="M8 14v16M14 14v16M20 14v16M26 14v16M32 14v16M5 33h30" />
    </>
  ),
  compass: (
    <>
      <circle cx="20" cy="20" r="15" />
      <path d="m26 14-4 8-8 4 4-8z" />
    </>
  ),
  leaf: (
    <>
      <path d="M9 31C9 17 18 9 33 8c-1 15-9 24-23 23z" />
      <path d="M9 31 22 18" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type ServiceIconName = keyof typeof service

export function ServiceGlyph({ name, size = 38, ...rest }: SvgProps & { name: ServiceIconName; size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} strokeWidth={1.4} aria-hidden="true" focusable="false" {...base} {...rest}>
      {service[name]}
    </svg>
  )
}

/* ---------- 60 px: жоба карточкасының иконкалары ---------- */
const project = {
  solar: (
    <>
      <circle cx="30" cy="20" r="8" />
      <path d="M30 4v4M30 32v4M14 20h4M42 20h4M19 9l3 3M38 28l3 3M41 9l-3 3M22 28l-3 3" />
      <path d="M10 54l6-14h28l6 14z" />
      <path d="M13 47h34M27 40l-2 14M33 40l2 14" />
    </>
  ),
  port: (
    <>
      <path d="M6 46h48" />
      <rect x="10" y="30" width="14" height="10" />
      <rect x="26" y="30" width="14" height="10" />
      <rect x="18" y="20" width="14" height="10" />
      <path d="M46 46V10M46 12h-12M40 12v8" />
      <circle cx="14" cy="50" r="2.5" />
      <circle cx="30" cy="50" r="2.5" />
    </>
  ),
  factory: <path d="M6 54V28l14 8V28l14 8V28l14 8V10h6v44zM16 46h4M26 46h4M36 46h4" />,
  wind: (
    <>
      <path d="M30 31v23M22 54h16" />
      <circle cx="30" cy="27" r="3" />
      <path d="M30 24V6M32.6 28.5 47 37M27.4 28.5 13 37" />
    </>
  ),
  agro: (
    <>
      <path d="M30 54V20" />
      <path d="M30 22c-5-2-7-6-7-10 5 0 7 4 7 10zM30 22c5-2 7-6 7-10-5 0-7 4-7 10zM30 34c-5-2-7-6-7-10 5 0 7 4 7 10zM30 34c5-2 7-6 7-10-5 0-7 4-7 10zM30 46c-5-2-7-6-7-10 5 0 7 4 7 10zM30 46c5-2 7-6 7-10-5 0-7 4-7 10z" />
    </>
  ),
  rail: (
    <>
      <path d="M20 6 10 54M40 6l10 48M30 6v48" />
      <path d="M15 28h30M12 42h36" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type ProjectGlyphName = keyof typeof project

export function ProjectGlyph({ name, size = 76, ...rest }: SvgProps & { name: ProjectGlyphName; size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} strokeWidth={1.3} aria-hidden="true" focusable="false" {...base} {...rest}>
      {project[name]}
    </svg>
  )
}
