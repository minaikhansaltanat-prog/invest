// Эмблемадан favicon және PWA белгішелерін жасайды (ТТ 12.3: 32/180/512 px).
// Ескерту: векторлық SVG логотип дизайнерден келгенше, растрлық эмблема қолданылады.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'src', 'assets', 'images', 'emblem.png')
const outDir = path.join(root, 'public', 'icons')
fs.mkdirSync(outDir, { recursive: true })

const square = (size, background) =>
  sharp(source)
    .resize(size, size, { fit: 'contain', background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })

await square(32).toFile(path.join(outDir, 'icon-32.png'))
await square(192).toFile(path.join(outDir, 'icon-192.png'))
await square(512).toFile(path.join(outDir, 'icon-512.png'))
// Apple touch icon: ақ фонда, шет аралықпен
await sharp(source)
  .resize(150, 150, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile(path.join(outDir, 'apple-180.png'))

console.log('[icons] public/icons ішінде 4 файл жасалды')
