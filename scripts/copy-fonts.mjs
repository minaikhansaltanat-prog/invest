// Қаріптерді өз серверімізге көшіреді (self-host, Google Fonts жоқ). ТТ 11.3, ТТ 12.2.
// Дереккөзі: npm-дағы @fontsource-variable/* пакеттері (SIL OFL). Нәтиже:
//   public/fonts/<family>/*.woff2   және   src/app/(site)/[locale]/fonts.css
// Қытай қаріптері unicode-range бойынша ұсақ бөліктерге (subset) бөлінген, браузер тек керегін жүктейді.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outFontsDir = path.join(root, 'public', 'fonts')
const outCss = path.join(root, 'src', 'app', '(site)', '[locale]', 'fonts.css')

// Қазақ әріптері (Ә Ғ Қ Ң Ө Ұ Ү Һ І) cyrillic-ext бөлігінде, сондықтан екі cyrillic бөлігі де қажет.
const families = [
  {
    pkg: 'cormorant-garamond',
    family: 'Cormorant Garamond',
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  },
  {
    pkg: 'golos-text',
    family: 'Golos Text',
    subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  },
  { pkg: 'noto-serif-sc', family: 'Noto Serif SC', subsets: null },
  { pkg: 'noto-sans-sc', family: 'Noto Sans SC', subsets: null },
]

fs.rmSync(outFontsDir, { recursive: true, force: true })
fs.mkdirSync(outFontsDir, { recursive: true })

let css = `/* ГЕНЕРАЦИЯЛАНҒАН ФАЙЛ: \`npm run fonts\` командасымен жасалады. Қолмен өзгертпеңіз. */\n`
let totalFiles = 0
let totalBytes = 0

for (const { pkg, family, subsets } of families) {
  const pkgDir = path.join(root, 'node_modules', '@fontsource-variable', pkg)
  const cssFile = path.join(pkgDir, 'wght.css')
  if (!fs.existsSync(cssFile)) {
    console.error(`[fonts] табылмады: ${cssFile}. Алдымен npm install жасаңыз.`)
    process.exit(1)
  }
  const source = fs.readFileSync(cssFile, 'utf8')
  const blocks = source.match(/(?:\/\*[^*]*\*\/\s*)?@font-face\s*\{[^}]*\}/g) ?? []
  const targetDir = path.join(outFontsDir, pkg)
  fs.mkdirSync(targetDir, { recursive: true })

  for (const block of blocks) {
    const woff2 = block.match(/url\(\.\/files\/([^)]+\.woff2)\)\s*format\('woff2-variations'\)/)
    if (!woff2) continue
    const fileName = woff2[1]
    // Файл атауы: <pkg>-<subset>-wght-normal.woff2
    const subsetName = fileName.slice(pkg.length + 1, -'-wght-normal.woff2'.length)
    if (subsets && !subsets.includes(subsetName)) continue
    const weight = block.match(/font-weight:\s*([^;]+);/)?.[1] ?? '400'
    fs.copyFileSync(path.join(pkgDir, 'files', fileName), path.join(targetDir, fileName))
    totalFiles += 1
    totalBytes += fs.statSync(path.join(targetDir, fileName)).size

    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1]
    css += `@font-face {\n  font-family: '${family}';\n  font-style: normal;\n  font-display: swap;\n  font-weight: ${weight};\n  src: url('/fonts/${pkg}/${fileName}') format('woff2');\n${range ? `  unicode-range: ${range};\n` : ''}}\n`
  }
}

fs.mkdirSync(path.dirname(outCss), { recursive: true })
fs.writeFileSync(outCss, css)
console.log(`[fonts] ${totalFiles} файл, ${(totalBytes / 1024 / 1024).toFixed(1)} МБ -> public/fonts`)
console.log(`[fonts] CSS: ${path.relative(root, outCss)}`)
