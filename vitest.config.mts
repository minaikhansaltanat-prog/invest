import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// `npm test` тек таза логиканы тексереді (дерекқор мен серверді қажет етпейді).
// Файлдарда `// @vitest-environment jsdom` деп жазылса, компонент тесті жұмыс істейді.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
})
