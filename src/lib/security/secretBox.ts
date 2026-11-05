import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

// Деректер базасында сақталатын құпиялар (TOTP кілті) AES-256-GCM-мен шифрланады, кілт PAYLOAD_SECRET-тен алынады.
// Пішім: v1.<iv>.<tag>.<шифр> (base64url). Ашық мәтін базада ешқашан тұрмайды.

const keyFrom = (secret: string) => createHash('sha256').update(`kfca:secret-box:${secret}`).digest()

export function encryptSecret(plain: string, secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keyFrom(secret), iv)
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), body.toString('base64url')].join('.')
}

export function decryptSecret(boxed: string, secret: string): string {
  const [version, iv, tag, body] = boxed.split('.')
  if (version !== 'v1' || !iv || !tag || !body) throw new Error('invalid-secret-box')
  const decipher = createDecipheriv('aes-256-gcm', keyFrom(secret), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(body, 'base64url')), decipher.final()]).toString('utf8')
}
