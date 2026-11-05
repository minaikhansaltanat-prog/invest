import fs from 'node:fs'
import path from 'node:path'

import type { Page } from '@playwright/test'

export const SCREENS_DIR = path.join(process.cwd(), 'docs', 'screens')

/** Бетті соңына дейін айналдырып, lazy суреттер мен қаріптердің жүктелуін күтеді, содан кейін басына оралады */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.8)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 140))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((resolve) => setTimeout(resolve, 200))
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((resolve) => ((img.onload = img.onerror = () => resolve(null)), undefined)),
      ),
    )
    await document.fonts.ready
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(350)
}

/**
 * Скриншотты docs/screens/<name>-<width>.png файлына жазады (әр кезеңнің көрнекі тексеруі).
 * Әр ені үшін viewport ауыстырылып, бет «тұрақтандырылады» (settle).
 */
export async function shot(
  page: Page,
  name: string,
  widths: number[] = [1440, 390],
  options: { fullPage?: boolean } = {},
) {
  fs.mkdirSync(SCREENS_DIR, { recursive: true })
  for (const width of widths) {
    await page.setViewportSize({ width, height: width >= 1000 ? 900 : 844 })
    await settle(page)
    await page.screenshot({
      path: path.join(SCREENS_DIR, `${name}-${width}.png`),
      fullPage: options.fullPage ?? true,
    })
  }
}
