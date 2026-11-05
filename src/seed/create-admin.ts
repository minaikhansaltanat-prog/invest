/**
 * Бірінші (немесе қосымша) супер-администраторды Local API арқылы жасайды: `npm run create-admin`.
 * Қоғамдық серверде ашық first-register эндпойнтін қолданбау үшін (docs/DEPLOY_VERCEL.md). Құпия сөз экранға және журналға шықпайды.
 *
 * Орта айнымалылары: ADMIN_EMAIL, ADMIN_PASSWORD (12-128 таңба, әріп пен сан бар), ADMIN_NAME (міндетті емес),
 * DATABASE_URL, PAYLOAD_SECRET (сервердегімен бірдей). Пошта бұрыннан бар болса, ештеңе өзгертілмейді.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD ?? ''
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator'
  if (!email || !password) {
    console.error('[create-admin] ADMIN_EMAIL және ADMIN_PASSWORD міндетті (құпия сөз кемінде 12 таңба, әріп пен сан).')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'admins', where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true })
  if (existing.docs[0]) {
    console.log(`[create-admin] ${email} бұрыннан бар: өзгеріс жасалған жоқ.`)
    return
  }

  await payload.create({
    collection: 'admins',
    data: { email, password, name, roles: ['super-admin'] } as never,
    overrideAccess: true,
  })
  console.log(`[create-admin] супер-администратор жасалды: ${email}. /admin арқылы кіріп, 2FA қосыңыз (/kk/account/2fa).`)
}

// `payload run` модульді import етеді де, одан кейін процесті жабады: сондықтан top-level await қажет
try {
  await main()
} catch (error) {
  console.error('[create-admin] қате:', error instanceof Error ? error.message : error)
  process.exit(1)
}
