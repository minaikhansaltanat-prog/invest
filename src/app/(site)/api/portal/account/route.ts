import { json, sessionOf } from '@/lib/portal/http'

/**
 * Жеке деректер (ТТ 9, 14.2): GET: өз деректерін JSON ретінде жүктеп алу, DELETE: аккаунтты жоюға сұраныс (мерзімін қызметкер өңдейді).
 * Құпия сөз, TOTP кілті мен басқа өтініштер экспортқа кірмейді.
 */
export async function GET(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'users') return json({ error: 'unauthorized' }, 401)

  const profile = (await payload.findByID({ collection: 'users', id: user.id, overrideAccess: true, depth: 0 })) as unknown as Record<string, unknown>
  const { docs } = await payload.find({
    collection: 'submissions',
    where: { user: { equals: user.id } },
    overrideAccess: true,
    depth: 0,
    limit: 200,
  })

  const body = {
    exportedAt: new Date().toISOString(),
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      roles: profile.roles,
      locale: profile.locale,
      organization: profile.organization,
      country: profile.country,
      phone: profile.phone,
      consents: profile.consents,
      createdAt: profile.createdAt,
      loginHistory: profile.loginHistory,
    },
    submissions: docs.map((doc) => ({ reference: doc.reference, kind: doc.kind, status: doc.status, createdAt: doc.createdAt, data: doc.data, consent: doc.consent })),
  }
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': 'attachment; filename="kfca-my-data.json"',
      'cache-control': 'no-store',
    },
  })
}

export async function DELETE(request: Request) {
  const { payload, user } = await sessionOf(request.headers)
  if (!user || user.collection !== 'users') return json({ error: 'unauthorized' }, 401)
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { deletionRequestedAt: new Date().toISOString() },
    overrideAccess: true,
    depth: 0,
  })
  return json({ ok: true })
}
