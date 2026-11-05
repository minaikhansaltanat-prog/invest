// Портал режимі e2e үшін: PORTAL_MODE=full болса толық нұсқа, әйтпесе corporate (src/lib/mode.ts-пен бірдей ереже).
// Сервер де осы айнымалымен іске қосылуы тиіс (npm run test:e2e = corporate, npm run test:e2e:full = full).
export const portalMode: 'corporate' | 'full' = (process.env.PORTAL_MODE ?? '').trim().toLowerCase() === 'full' ? 'full' : 'corporate'
export const isFullMode = portalMode === 'full'
export const isCorporateMode = !isFullMode

/** Corporate режимінде тексерілмейтін (инвестициялық) спектер: толық нұсқаға арналған */
export const fullOnlySpecs = ['**/stage2.spec.ts', '**/stage5.spec.ts', '**/stage6.spec.ts', '**/stage7-ui.spec.ts', '**/stage7.spec.ts', '**/stage8.spec.ts']
