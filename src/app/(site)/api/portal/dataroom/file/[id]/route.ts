import fs from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

import { watermarkText } from '@/lib/investment/dataroom'
import { dataroomDecision, logDataroom } from '@/lib/portal/dataroom'
import { json, payloadClient } from '@/lib/portal/http'

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`)

/** Суреттерге жеке су белгісін (аты | күні) қайталап басады; PDF-ке burn-in үшін pdf-lib қажет (орнатылмаған), оны UI қабаты жабады */
async function watermarkImage(buffer: Buffer, text: string): Promise<Buffer> {
  const image = sharp(buffer)
  const { width = 1000, height = 800 } = await image.metadata()
  const label = escapeXml(text)
  const size = Math.max(16, Math.round(Math.min(width, height) / 28))
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><pattern id="w" width="${size * 14}" height="${size * 6}" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)"><text x="0" y="${size * 2}" font-family="sans-serif" font-size="${size}" font-weight="700" fill="rgba(255,255,255,0.5)" stroke="rgba(0,0,0,0.35)" stroke-width="0.6">${label}</text></pattern></defs><rect width="100%" height="100%" fill="url(#w)"/></svg>`
  return image.composite([{ input: Buffer.from(svg) }]).toBuffer()
}

/**
 * Файлды тек қарау үшін береді (ТТ 8.6): қатынас шешімі `/api/portal/dataroom/<жоба>` сияқты, әр қарау журналға жазылады.
 * Жауап `inline`, кэшсіз, `nosniff`; жүктеп алу (attachment) берілмейді.
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const payload = await payloadClient()
  const file = await payload.findByID({ collection: 'dataroomFiles', id, overrideAccess: true, depth: 0 }).catch(() => null)
  if (!file) return json({ error: 'no-access' }, 403)

  const projectId = typeof file.project === 'object' ? (file.project as { id: number }).id : file.project
  const decision = await dataroomDecision(request.headers, projectId)
  if (decision.kind === 'unauthorized') return json({ error: 'unauthorized' }, 401)
  if (decision.kind === 'denied') {
    await logDataroom(payload, { userId: decision.session.user!.id, action: 'denied', projectId, fileId: id, request, reason: decision.reason })
    return json({ error: 'no-access' }, 403)
  }

  // Қойма жолын коллекцияның өз баптауынан аламыз (build/dev айырмашылығы жолды өзгертпейді)
  const root = path.resolve(String(payload.collections.dataroomFiles.config.upload.staticDir))
  const target = path.resolve(root, String(file.filename))
  if (!target.startsWith(root + path.sep)) return json({ error: 'no-access' }, 403)
  let bytes: Buffer
  try {
    bytes = await fs.readFile(target)
  } catch {
    return json({ error: 'not-found' }, 404)
  }

  const user = decision.session.user!
  await logDataroom(payload, { userId: user.id, action: 'view', projectId, fileId: id, request })
  const mime = String(file.mimeType ?? 'application/octet-stream')
  const body = mime.startsWith('image/') ? await watermarkImage(bytes, watermarkText(String(user.name ?? user.email), new Date())) : bytes
  return new Response(new Uint8Array(body), {
    headers: {
      'content-type': mime,
      'content-disposition': 'inline',
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "sandbox; default-src 'none'",
    },
  })
}
