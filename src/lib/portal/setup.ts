import { timingSafeEqual } from 'node:crypto'

/**
 * Бірінші әкімшіні ашық `POST /api/admins/first-register` арқылы жасау. Әзірлеуде (NODE_ENV!=production) еркін: тесттер мен жергілікті іске қосу.
 * Өндірісте (Vercel preview-ді қоса) қоғамдық серверде кез келген адам бірінші әкімші бола алмауы үшін жабық: тек `ADMIN_SETUP_TOKEN`
 * (кемінде 16 таңба) берілсе және сұраныс `x-setup-token` тақырыбымен дәл сол мәнді жіберсе ашылады.
 * Ұсынылатын жол: `npm run create-admin` (docs/DEPLOY_VERCEL.md), ол бұл эндпойнтті қолданбайды.
 */
export function firstRegisterAllowed(headers: Headers, env: Record<string, string | undefined> = process.env): boolean {
  if (env.NODE_ENV !== 'production') return true
  const expected = env.ADMIN_SETUP_TOKEN ?? ''
  if (expected.length < 16) return false
  const given = Buffer.from(headers.get('x-setup-token') ?? '')
  const wanted = Buffer.from(expected)
  return given.length === wanted.length && timingSafeEqual(given, wanted)
}
