import fs from 'node:fs'
import path from 'node:path'

import type { Page } from '@playwright/test'

export const SCREENS_DIR = path.join(process.cwd(), 'docs', 'screens')

/**
 * Скриншотты docs/screens/<name>-<width>.png файлына жазады (әр кезеңнің көрнекі тексеруі).
 * Әр ені үшін viewport ауыстырылады да, бет қайта өлшенеді.
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
    await page.evaluate(() => document.fonts?.ready)
    await page.waitForTimeout(350)
    await page.screenshot({
      path: path.join(SCREENS_DIR, `${name}-${width}.png`),
      fullPage: options.fullPage ?? true,
    })
  }
}
