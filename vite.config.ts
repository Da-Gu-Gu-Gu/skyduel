import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
// `test` is a Vitest option; typing the object as a variable avoids the
// excess-property check on the Vite `UserConfig` type.
const config: UserConfig & { test: Record<string, unknown> } = {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
}

export default defineConfig(config)
