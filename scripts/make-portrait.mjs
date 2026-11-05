// Негізатушы фотосы (NIGHT_TASK 3.1). Түпнұсқа (../ZH.jpeg) ЕШҚАШАН өзгертілмейді және өшірілмейді.
//  1) түпнұсқаның көшірмесі public/team/ZH.jpeg ішіне қойылады;
//  2) түпнұсқа ақ үстелдегі басылған фото болғандықтан (жиегі мен ақ фоны бар), басы мен иығы бар 4:5 кадр
//     сол көшірмеден қиылып, public/team/zh-portrait.jpg ретінде сақталады. next/image оны AVIF/WebP-ке айналдырады.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const teamDir = path.join(root, 'public', 'team')
fs.mkdirSync(teamDir, { recursive: true })

// Жоба папкасынан `zh.*` файлын іздейді (NIGHT_TASK 3.1): алдымен жоба ішінде, содан кейін жұмыс папкасында (ата-папка)
const candidates = [
  path.join(root, 'ZH.jpeg'),
  ...['jpg', 'jpeg', 'png', 'webp', 'heic'].flatMap((ext) => [
    path.join(root, '..', `ZH.${ext}`),
    path.join(root, '..', `Zh.${ext}`),
    path.join(root, '..', `zh.${ext}`),
  ]),
]
const original = candidates.find((file) => fs.existsSync(file))
if (!original) {
  console.error('[portrait] Zh фотосы табылмады: монограмма қалдырылады')
  process.exit(2)
}
console.log('[portrait] түпнұсқа:', path.relative(root, original))

const copy = path.join(teamDir, 'ZH.jpeg')
fs.copyFileSync(original, copy)

// Қию координаталары 896x1195 түпнұсқа үшін өлшенген: басылған фотоның ішкі аймағы, 4:5
const meta = await sharp(copy).metadata()
const crop = { left: 190, top: 262, width: 520, height: 650 }
if (meta.width !== 896 || meta.height !== 1195) {
  console.warn(`[portrait] күтілмеген өлшем ${meta.width}x${meta.height}: қию координаттарын тексеріңіз`)
}
await sharp(copy)
  .rotate() // EXIF бағытын ескереді
  .extract(crop)
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(path.join(teamDir, 'zh-portrait.jpg'))

const out = await sharp(path.join(teamDir, 'zh-portrait.jpg')).metadata()
console.log(`[portrait] zh-portrait.jpg ${out.width}x${out.height} (4:5)`)
