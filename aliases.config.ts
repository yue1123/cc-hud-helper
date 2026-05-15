import { fileURLToPath, URL } from 'node:url'

/**
 * Shared alias map for vite.config.ts AND vitest.config.ts.
 * Add new aliases here so both dev/build and test agree on resolution.
 */
const u = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export const sharedAliases = [
  { find: '@', replacement: u('./src') },
  // upstream stdin replacement (renderer-only subset). Regex form because
  // upstream uses `.js` import extensions but the shim is `.ts`. Must come
  // before the broad `@upstream` string-prefix alias to take precedence.
  { find: /^@upstream\/stdin(\.js)?$/, replacement: u('./src/upstream-shims/stdin.ts') },
  { find: /^@upstream\/speed-tracker(\.js)?$/, replacement: u('./src/upstream-shims/speed-tracker.ts') },
  { find: /^@upstream\/memory(\.js)?$/, replacement: u('./src/upstream-shims/memory.ts') },
  { find: /^@upstream\/utils\/terminal(\.js)?$/, replacement: u('./src/upstream-shims/terminal.ts') },
  { find: '@upstream', replacement: u('./vendor/claude-hud/src') },
  // Node built-ins → browser stubs (see src/upstream-shims/node/)
  { find: 'node:fs', replacement: u('./src/upstream-shims/node/fs.ts') },
  { find: 'node:path', replacement: u('./src/upstream-shims/node/path.ts') },
  { find: 'node:os', replacement: u('./src/upstream-shims/node/os.ts') },
  { find: 'node:url', replacement: u('./src/upstream-shims/node/url.ts') },
  { find: 'node:crypto', replacement: u('./src/upstream-shims/node/crypto.ts') },
  { find: 'node:child_process', replacement: u('./src/upstream-shims/node/child_process.ts') },
  { find: 'node:util', replacement: u('./src/upstream-shims/node/util.ts') },
  { find: 'node:readline', replacement: u('./src/upstream-shims/node/readline.ts') },
]
