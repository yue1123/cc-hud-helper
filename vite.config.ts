import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const u = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: [
      { find: '@', replacement: u('./src') },
      { find: '@upstream', replacement: u('./vendor/claude-hud/src') },
      // Node built-ins → browser stubs
      { find: 'node:fs', replacement: u('./src/upstream-shims/node/fs.ts') },
      { find: 'node:path', replacement: u('./src/upstream-shims/node/path.ts') },
      { find: 'node:os', replacement: u('./src/upstream-shims/node/os.ts') },
      { find: 'node:url', replacement: u('./src/upstream-shims/node/url.ts') },
      { find: 'node:crypto', replacement: u('./src/upstream-shims/node/crypto.ts') },
      { find: 'node:child_process', replacement: u('./src/upstream-shims/node/child_process.ts') },
      { find: 'node:util', replacement: u('./src/upstream-shims/node/util.ts') },
      { find: 'node:readline', replacement: u('./src/upstream-shims/node/readline.ts') },
    ],
  },
})
