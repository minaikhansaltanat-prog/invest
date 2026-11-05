import 'dotenv/config'

import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3000)
const channel = process.env.PW_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : undefined)

export default defineConfig({
  testDir: './tests/e2e',
  // Іске қосу соңында аудит журналындағы тест жазбаларын тазалайды (tests/e2e/global-setup.ts)
  globalSetup: './tests/e2e/global-setup.ts',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list']],
  outputDir: 'test-results',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    // Windows-та жүйедегі Edge қолданылады (браузер жүктеудің қажеті жоқ). Басқа браузер: PW_CHANNEL=chrome
    ...(channel ? { channel } : {}),
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'node scripts/dev-all.mjs',
    url: `http://localhost:${PORT}/admin`,
    reuseExistingServer: true,
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
