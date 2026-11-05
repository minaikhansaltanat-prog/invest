// Дизайн үлгісінің (design/index.html) эталон скриншотын жасайды: docs/screens/reference-prototype-<ені>.png
// Прототип Google Fonts-қа сілтейді (офлайн/Қытайда жүктелмейді), сондықтан өзіміздің self-host қаріптерімізді енгізеді.
// Сондай-ақ design/ қалтасын уақытша статикалық серверден (localhost) береді: file:/// скриншот жасалмайды.
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const designDir = path.join(root, 'design')
const fontsCss = fs
  .readFileSync(path.join(root, 'src', 'app', '(site)', '[locale]', 'fonts.css'), 'utf8')
  .replaceAll("url('/fonts/", "url('http://127.0.0.1:3101/fonts/")

const types = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' }
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0])
  const file = url.startsWith('/fonts/')
    ? path.join(root, 'public', url)
    : path.join(designDir, url === '/' ? 'index.html' : url)
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})
await new Promise((resolve) => server.listen(3101, '127.0.0.1', resolve))

const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined })
const outDir = path.join(root, 'docs', 'screens')
fs.mkdirSync(outDir, { recursive: true })

for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width > 1000 ? 900 : 844 } })
  // Google Fonts сұрауларын тоқтатамыз (жауап бермей, уақыт жоғалтпау үшін)
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort())
  await page.goto('http://127.0.0.1:3101/', { waitUntil: 'load' })
  await page.addStyleTag({ content: fontsCss })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(outDir, `reference-prototype-${width}.png`), fullPage: true })
  await page.close()
}
await browser.close()
server.close()
console.log('[reference] docs/screens/reference-prototype-1440.png, -390.png')
