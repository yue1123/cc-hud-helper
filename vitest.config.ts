import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { sharedAliases } from './aliases.config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: sharedAliases,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
})
