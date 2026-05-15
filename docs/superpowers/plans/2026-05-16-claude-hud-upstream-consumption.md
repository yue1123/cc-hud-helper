# claude-hud Config Tool — Plan 05: Consume Upstream Schema & Renderer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Prerequisite:** Plan 03 complete (tagged `v1.0-feature-complete`) + xterm.js preview wired (commit `235d290`) + `vendor/claude-hud` submodule pinned at `6f7d073` (commit `ddc28fb`).

**Goal:** Stop maintaining a hand-port. Make this project a pure **form layer + preview-display layer** over `jarrodwatts/claude-hud`. Schema and renderer come from the submodule; we only own the editor UI and IO/i18n/preset/share features.

**Architecture:**
- `src/lib/hud-schema.ts` becomes a **type-only re-export** from `@upstream/config` plus a small set of derived constants (`KNOWN_HUD_ELEMENTS`) upstream doesn't expose. Delete `src/lib/merge-config.ts` — use `mergeConfig` from upstream.
- `src/preview/` lines + render-line + render-ansi are deleted. Replace with `src/preview/upstream-bridge.ts` that calls upstream's `render(ctx)` and captures `console.log` output into an ANSI string. `HudPreviewXterm.vue` writes that string to xterm.
- Upstream's renderer transitively imports Node-only modules. We provide **browser shims** at the Vite alias layer: empty-or-throwing stubs for `node:fs`/`node:path`/`node:os`/etc., plus per-module shims for upstream's `stdin` / `i18n` / `transcript` / `git` / `cost` / `speed-tracker` / `external-usage` / `claude-config-dir` / `version` / `extra-cmd` / `debug` / `utils/terminal`.
- A fixed `MOCK_RENDER_CONTEXT` constructed from our existing `MOCK_CONTEXT` provides the `RenderContext` upstream expects.

**Out of scope:** UI changes, new features, deployment (Plan 04). Upstream PR contributions.

**Why now:** Plan 03 shipped feature-complete v1, but our preview's *content* is a hand-port and already diverges from upstream (e.g. our `usage` line ignores `usageThreshold`, doesn't render `isLimitReached`, etc.). The fix isn't to keep porting — it's to consume upstream directly.

**Tech Stack:** Same as Plan 03 + Vite browser-stub aliases (no new deps).

---

## File Structure

```
src/
├── lib/
│   ├── hud-schema.ts                  # REWRITTEN — re-export types/constants from @upstream/config
│   └── merge-config.ts                # DELETED — replaced by @upstream/config.mergeConfig
├── preview/
│   ├── HudPreviewXterm.vue            # MODIFIED — call upstream-bridge instead of render-ansi
│   ├── upstream-bridge.ts             # NEW — renderToString(ctx) wrapper
│   ├── mock-render-context.ts         # NEW — build upstream RenderContext from our MockContext
│   ├── lines/                         # DELETED — all 8 files
│   ├── render-line.ts                 # DELETED
│   ├── render-ansi.ts                 # DELETED
│   ├── color-map.ts                   # DELETED
│   └── types.ts                       # DELETED — RenderSpan/RenderLine no longer used
├── upstream-shims/                    # NEW — Vite-aliased browser shims
│   ├── node/
│   │   ├── fs.ts                      # NEW — readFileSync throws; existsSync returns false
│   │   ├── path.ts                    # NEW — minimal pure JS subset
│   │   ├── os.ts                      # NEW — homedir/tmpdir return safe strings
│   │   ├── url.ts                     # NEW — pathToFileURL pure JS
│   │   ├── crypto.ts                  # NEW — empty (we don't call any)
│   │   ├── child_process.ts           # NEW — execSync throws
│   │   ├── util.ts                    # NEW — empty
│   │   └── readline.ts                # NEW — empty
│   ├── stdin.ts                       # NEW — replaces @upstream/stdin
│   ├── i18n.ts                        # NEW — replaces @upstream/i18n with en-only stub
│   ├── transcript.ts                  # NEW — replaces @upstream/transcript
│   ├── git.ts                         # NEW — replaces @upstream/git
│   ├── cost.ts                        # NEW — replaces @upstream/cost
│   ├── speed-tracker.ts               # NEW — replaces @upstream/speed-tracker
│   ├── external-usage.ts              # NEW — replaces @upstream/external-usage
│   ├── claude-config-dir.ts           # NEW — replaces @upstream/claude-config-dir
│   ├── version.ts                     # NEW — replaces @upstream/version
│   ├── extra-cmd.ts                   # NEW — replaces @upstream/extra-cmd
│   ├── debug.ts                       # NEW — replaces @upstream/debug
│   ├── config-reader.ts               # NEW — replaces @upstream/config-reader
│   └── terminal.ts                    # NEW — replaces @upstream/utils/terminal

tests/
├── unit/
│   ├── hud-schema.test.ts             # MODIFIED — assert upstream re-exports work
│   ├── merge-config.test.ts           # KEPT — now exercises upstream's mergeConfig
│   ├── color-map.test.ts              # DELETED
│   ├── render-ansi.test.ts            # DELETED
│   ├── preview/                       # DELETED — all 8 line-renderer tests
│   └── preview/render-line.test.ts    # DELETED
└── unit/upstream-bridge.test.ts       # NEW — verify renderToString produces non-empty ANSI

vite.config.ts                         # MODIFIED — extensive alias map
tsconfig.app.json                      # MODIFIED — include all upstream src files
```

---

## Phase 1: Schema Consumption (ship-able alone)

Phase 1 makes our codebase consume upstream `config.ts` for types, constants, and `mergeConfig`. After Phase 1, Phase 2 still uses our preview pipeline — preview drift is unchanged but the schema is single-source.

---

### Task 1: Browser stubs for `node:*` modules

**Files:**
- Create: `src/upstream-shims/node/fs.ts`, `path.ts`, `os.ts`, `url.ts`, `crypto.ts`, `child_process.ts`, `util.ts`, `readline.ts`
- Modify: `vite.config.ts`

Upstream `config.ts` imports `node:fs`, `node:path`, `node:os` at module top. To import it from a browser bundle we need each `node:*` specifier to resolve to a browser-safe stub. Throwing stubs make accidental I/O loud; identity stubs make pure-string fns work.

- [ ] **Step 1: Create `src/upstream-shims/node/fs.ts`**

```typescript
const NOT_SUPPORTED = () => {
  throw new Error('Node fs API is not available in the browser bundle')
}

export const readFileSync = NOT_SUPPORTED
export const writeFileSync = NOT_SUPPORTED
export const existsSync = (): boolean => false
export const statSync = NOT_SUPPORTED
export const mkdirSync = NOT_SUPPORTED
export const readdirSync = (): string[] => []
export default {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
}
```

- [ ] **Step 2: Create `src/upstream-shims/node/path.ts`**

```typescript
function normalize(p: string): string {
  return p.replace(/\\/g, '/').replace(/\/+/g, '/')
}
export const sep = '/'
export const delimiter = ':'
export function join(...parts: string[]): string {
  return normalize(parts.filter(Boolean).join('/'))
}
export function resolve(...parts: string[]): string {
  let out = ''
  for (const part of parts) {
    if (!part) continue
    out = part.startsWith('/') ? part : out ? out + '/' + part : part
  }
  return normalize(out || '/')
}
export function dirname(p: string): string {
  const i = normalize(p).lastIndexOf('/')
  return i <= 0 ? '/' : p.slice(0, i)
}
export function basename(p: string, ext?: string): string {
  const n = normalize(p)
  const i = n.lastIndexOf('/')
  let name = i >= 0 ? n.slice(i + 1) : n
  if (ext && name.endsWith(ext)) name = name.slice(0, -ext.length)
  return name
}
export function extname(p: string): string {
  const n = basename(p)
  const i = n.lastIndexOf('.')
  return i <= 0 ? '' : n.slice(i)
}
export function relative(from: string, to: string): string {
  const fromParts = normalize(from).split('/').filter(Boolean)
  const toParts = normalize(to).split('/').filter(Boolean)
  let i = 0
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) i++
  const ups = Array(fromParts.length - i).fill('..')
  return [...ups, ...toParts.slice(i)].join('/')
}
export function isAbsolute(p: string): boolean {
  return p.startsWith('/')
}
export default { sep, delimiter, join, resolve, dirname, basename, extname, relative, isAbsolute }
```

- [ ] **Step 3: Create `src/upstream-shims/node/os.ts`**

```typescript
export function homedir(): string {
  return '/'
}
export function tmpdir(): string {
  return '/tmp'
}
export function platform(): string {
  return 'browser'
}
export function totalmem(): number {
  return 0
}
export function freemem(): number {
  return 0
}
export const EOL = '\n'
export default { homedir, tmpdir, platform, totalmem, freemem, EOL }
```

- [ ] **Step 4: Create `src/upstream-shims/node/url.ts`**

```typescript
export function pathToFileURL(p: string): URL {
  const path = p.startsWith('/') ? p : '/' + p
  return new URL('file://' + encodeURI(path))
}
export function fileURLToPath(u: string | URL): string {
  const url = typeof u === 'string' ? new URL(u) : u
  return decodeURI(url.pathname)
}
export { URL }
export default { pathToFileURL, fileURLToPath, URL }
```

- [ ] **Step 5: Create `src/upstream-shims/node/crypto.ts`, `child_process.ts`, `util.ts`, `readline.ts` as empty-stub modules**

`src/upstream-shims/node/crypto.ts`:
```typescript
const NOT_SUPPORTED = () => {
  throw new Error('Node crypto API is not available in the browser bundle')
}
export const randomBytes = NOT_SUPPORTED
export const createHash = NOT_SUPPORTED
export default { randomBytes, createHash }
```

`src/upstream-shims/node/child_process.ts`:
```typescript
const NOT_SUPPORTED = () => {
  throw new Error('Node child_process is not available in the browser bundle')
}
export const execSync = NOT_SUPPORTED
export const spawn = NOT_SUPPORTED
export const spawnSync = NOT_SUPPORTED
export default { execSync, spawn, spawnSync }
```

`src/upstream-shims/node/util.ts`:
```typescript
export const promisify = <T>(fn: T): T => fn
export const inspect = (v: unknown): string => String(v)
export default { promisify, inspect }
```

`src/upstream-shims/node/readline.ts`:
```typescript
const NOT_SUPPORTED = () => {
  throw new Error('Node readline is not available in the browser bundle')
}
export const createInterface = NOT_SUPPORTED
export default { createInterface }
```

- [ ] **Step 6: Add Vite aliases for every `node:*` specifier**

Edit `vite.config.ts`:

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const u = (p: string) => fileURLToPath(new URL(p, import.meta.url))

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
```

- [ ] **Step 7: Verify build still passes (no consumers yet — sanity check)**

```bash
pnpm build 2>&1 | tail -5
```

Expected: succeeds. No new shims are imported by anyone yet.

- [ ] **Step 8: Commit**

```bash
git add src/upstream-shims/node/ vite.config.ts
git commit -m "feat(shims): browser stubs for node:* built-ins"
```

---

### Task 2: Re-export schema from upstream

**Files:**
- Modify: `src/lib/hud-schema.ts`
- Modify: `tsconfig.app.json`
- Modify: `tests/unit/hud-schema.test.ts`

Upstream's `config.ts` exports the canonical schema. We replace our hand-port with type-only and constant re-exports. The one thing upstream doesn't export is `KNOWN_HUD_ELEMENTS` (it's a private const), so we derive it ourselves.

- [ ] **Step 1: Widen tsconfig include to cover all upstream source**

Edit `tsconfig.app.json` — replace the `include` array:

```json
{
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue",
    "vendor/claude-hud/src/**/*.ts"
  ],
  ...
}
```

- [ ] **Step 2: Verify type-check still passes**

```bash
pnpm type-check 2>&1 | tail -8
```

Expected: clean. (Step 1 of Task 1 already added Node module stubs, so upstream `node:fs` imports type-check.)

- [ ] **Step 3: Rewrite `src/lib/hud-schema.ts` as re-export**

```typescript
/**
 * Source of truth: vendor/claude-hud/src/config.ts (submodule pinned at 6f7d073).
 *
 * This file is a thin re-export. Types and DEFAULT_CONFIG come from upstream.
 * Only KNOWN_HUD_ELEMENTS is derived locally because upstream keeps it private.
 *
 * If a future upstream change makes any type unsuitable for form rendering
 * (e.g. introduces a non-JSON-safe shape), add a local override here and
 * document why.
 */
export type {
  Language,
  LineLayoutType,
  AutocompactBufferMode,
  ContextValueMode,
  UsageValueMode,
  GitBranchOverflowMode,
  ModelFormatMode,
  TimeFormatMode,
  HudElement,
  AddedDirsLayout,
  HudColorName,
  HudColorValue,
  HudColorOverrides,
  HudGitStatusConfig,
  HudDisplayConfig,
  HudConfig,
} from '@upstream/config'

export {
  DEFAULT_ELEMENT_ORDER,
  DEFAULT_MERGE_GROUPS,
  DEFAULT_CONFIG,
} from '@upstream/config'

import { DEFAULT_ELEMENT_ORDER, type HudElement } from '@upstream/config'

export const KNOWN_HUD_ELEMENTS: ReadonlySet<HudElement> = new Set(DEFAULT_ELEMENT_ORDER)
```

- [ ] **Step 4: Update `tests/unit/hud-schema.test.ts`**

Replace the file (assuming the existing test asserts on field presence — adjust if it asserts implementation details):

```typescript
import { describe, it, expect } from 'vitest'
import {
  DEFAULT_CONFIG,
  DEFAULT_ELEMENT_ORDER,
  DEFAULT_MERGE_GROUPS,
  KNOWN_HUD_ELEMENTS,
} from '@/lib/hud-schema'

describe('hud-schema (upstream re-export)', () => {
  it('DEFAULT_CONFIG has expected top-level keys', () => {
    expect(Object.keys(DEFAULT_CONFIG).sort()).toEqual(
      ['language', 'lineLayout', 'showSeparators', 'pathLevels', 'maxWidth',
       'forceMaxWidth', 'elementOrder', 'gitStatus', 'display', 'colors'].sort(),
    )
  })

  it('DEFAULT_ELEMENT_ORDER lists 11 elements', () => {
    expect(DEFAULT_ELEMENT_ORDER).toHaveLength(11)
  })

  it('KNOWN_HUD_ELEMENTS contains the same set as DEFAULT_ELEMENT_ORDER', () => {
    expect(new Set(DEFAULT_ELEMENT_ORDER)).toEqual(KNOWN_HUD_ELEMENTS)
  })

  it('DEFAULT_MERGE_GROUPS is non-empty', () => {
    expect(DEFAULT_MERGE_GROUPS.length).toBeGreaterThan(0)
  })

  it('DEFAULT_CONFIG.lineLayout is "expanded"', () => {
    expect(DEFAULT_CONFIG.lineLayout).toBe('expanded')
  })
})
```

- [ ] **Step 5: Run tests**

```bash
pnpm test:run -- hud-schema 2>&1 | tail -5
```

Expected: all pass.

- [ ] **Step 6: Run full suite — most should pass, some will fail if upstream's schema drifted from our hand-port**

```bash
pnpm test:run 2>&1 | tail -10
```

If failures occur, they identify real drift. For each failure: prefer adjusting **our** code/tests to match upstream rather than overriding upstream. Document any forced overrides in a comment in `src/lib/hud-schema.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/hud-schema.ts tests/unit/hud-schema.test.ts tsconfig.app.json
git commit -m "feat(schema): hud-schema is now a type-only re-export from upstream"
```

---

### Task 3: Replace mergeConfig with upstream

**Files:**
- Modify: `src/stores/config.ts`
- Modify: `tests/unit/merge-config.test.ts`
- Delete: `src/lib/merge-config.ts`

- [ ] **Step 1: Switch the store's mergeConfig import**

In `src/stores/config.ts`, change:
```typescript
import { mergeConfig } from '@/lib/merge-config'
```
to:
```typescript
import { mergeConfig } from '@upstream/config'
```

- [ ] **Step 2: Update `tests/unit/merge-config.test.ts` to test upstream directly**

Change line 2:
```typescript
import { mergeConfig } from '@/lib/merge-config'
```
to:
```typescript
import { mergeConfig } from '@upstream/config'
```

(All 15 existing assertions stay. The test now exercises upstream's `mergeConfig`. If any assertions fail, they identify a behavioral difference between our hand-port and upstream — investigate per-case and update the test if upstream's behavior is the desired one.)

- [ ] **Step 3: Run tests**

```bash
pnpm test:run -- merge-config 2>&1 | tail -10
```

Expected: 15 passing. If failures, adjust assertions to match upstream's behavior (which is now ground truth).

- [ ] **Step 4: Delete the hand-port**

```bash
rm src/lib/merge-config.ts
```

- [ ] **Step 5: Final verification**

```bash
pnpm type-check && pnpm test:run 2>&1 | tail -5
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/stores/config.ts tests/unit/merge-config.test.ts
git rm src/lib/merge-config.ts
git commit -m "feat(schema): replace hand-port mergeConfig with upstream's"
```

---

### Task 4: Phase 1 verification

- [ ] **Step 1: Full pipeline**

```bash
pnpm type-check && pnpm lint && pnpm test:run && pnpm build 2>&1 | tail -10
```

Expected: all green. The preview should look identical to before because Phase 1 only swapped the schema layer; the preview pipeline (our render-ansi + xterm) is unchanged.

- [ ] **Step 2: Manual smoke**

```bash
pnpm dev
```

Open `http://localhost:5173`. Verify:
- Preview renders all current lines (project / context / usage / etc.)
- Editing any field still updates preview live
- Importing a config with unknown fields (e.g. `{"display": {"futureField": 42}}`) still triggers the unknown-field diagnostic in the banner

Stop with Ctrl+C.

- [ ] **Step 3: Tag Phase 1**

```bash
git tag v1.1-upstream-schema
```

Phase 1 is now complete and could ship alone if you want to stop here. Phase 2 swaps the preview renderer.

---

## Phase 2: Renderer Consumption

Phase 2 replaces our preview pipeline (`src/preview/lines/*` + `render-line.ts` + `render-ansi.ts`) with upstream's `render(ctx)`. After Phase 2, the preview is byte-identical to what `claude-hud` writes to the terminal.

---

### Task 5: Survey upstream renderer dependency tree

**Files:**
- Read-only: `vendor/claude-hud/src/render/index.ts`, `vendor/claude-hud/src/render/lines/*.ts`, `vendor/claude-hud/src/render/colors.ts`

Before writing shims, list which upstream modules each render path actually imports.

- [ ] **Step 1: List render entry's transitive imports**

```bash
grep -h "^import\|^} from" vendor/claude-hud/src/render/*.ts vendor/claude-hud/src/render/lines/*.ts | \
  grep -oE "from ['\"][^'\"]+['\"]" | sort -u
```

Document the output in the task. Expected modules to shim (from earlier inspection):
- `../stdin.js` — used by render lines to pull model/effort/provider data
- `../i18n/index.js` — `t()` lookups
- `../transcript.js` — tool/agent/todo entries (already part of RenderContext, but render lines may also import helpers)
- `../git.js` — types
- `../speed-tracker.js` — `getOutputSpeed`
- `../external-usage.js` — usage data freshness
- `../version.js` — Claude Code version string
- `../extra-cmd.js` — custom command label
- `../debug.js` — debug logging (no-op for us)
- `../claude-config-dir.js` — config path
- `../config-reader.js` — MCP/rules count readers
- `../utils/terminal.js` — terminal width
- `./cost.js` (under render/) — cost line renderer (uses Node)
- `./width.js` — pure utility, no shim needed

- [ ] **Step 2: For each module above, record whether it does I/O (needs shim) or pure logic (vendor as-is)**

Pure modules (no shim): `colors.ts`, `format-reset-time.ts`, `label-align.ts`, `width.ts`, `i18n/types.ts`.

Shim required (each becomes its own task): `stdin.ts`, `i18n/index.ts`, `transcript.ts`, `git.ts`, `speed-tracker.ts`, `external-usage.ts`, `version.ts`, `extra-cmd.ts`, `debug.ts`, `claude-config-dir.ts`, `config-reader.ts`, `utils/terminal.ts`, `render/lines/cost.ts`.

- [ ] **Step 3: No commit (read-only survey)**

---

### Task 6: Shim `stdin`

**Files:**
- Create: `src/upstream-shims/stdin.ts`
- Modify: `vite.config.ts` (add alias)

Upstream's `stdin.ts` reads JSON from `process.stdin` and exposes helpers like `getModelName(stdin)`, `formatModelName(...)`, `getProviderLabel(stdin)`, `shouldHideUsage(stdin)`. In the browser we synthesize the same return shapes from our `MockContext`.

- [ ] **Step 1: Read upstream signatures**

```bash
grep "^export" vendor/claude-hud/src/stdin.ts
```

Record every exported function name and its return type. Common ones (per `project.ts`): `getModelName(stdin)`, `formatModelName(name, mode, override)`, `getProviderLabel(stdin)`, `shouldHideUsage(stdin)`.

- [ ] **Step 2: Create `src/upstream-shims/stdin.ts` with matching signatures**

```typescript
import type { StdinData } from '@upstream/types'
import type { ModelFormatMode } from '@upstream/config'

export function readStdinJson(): StdinData {
  // Browser has no stdin — return an empty shape.
  return {}
}

export function getModelName(stdin: StdinData): string {
  return stdin.model?.display_name ?? 'Claude'
}

export function formatModelName(
  name: string,
  mode: ModelFormatMode | undefined,
  override: string | undefined,
): string {
  if (override && override.trim()) return override.trim()
  if (mode === 'full' || !mode) return name
  const withoutCtx = name.replace(/\s*\([^)]*context[^)]*\)\s*$/i, '').trim()
  if (mode === 'compact') return withoutCtx
  return withoutCtx.replace(/^Claude\s+/i, '')
}

export function getProviderLabel(stdin: StdinData): string | null {
  // Upstream extracts this from stdin.model.id prefix; mock returns null.
  void stdin
  return null
}

export function shouldHideUsage(stdin: StdinData): boolean {
  void stdin
  return false
}
```

If upstream's `stdin.ts` exports additional functions found in Step 1 that aren't listed above, add stub returns matching their signatures (consult upstream source for shape).

- [ ] **Step 3: Add Vite alias**

Edit `vite.config.ts`, add to the `alias` array:

```typescript
{ find: /^@upstream\/stdin(\.js)?$/, replacement: u('./src/upstream-shims/stdin.ts') },
```

Note: use regex form for the alias so both `@upstream/stdin` and `@upstream/stdin.js` (upstream's .js-extension convention) resolve correctly.

- [ ] **Step 4: Verify type-check still passes**

```bash
pnpm type-check 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/upstream-shims/stdin.ts vite.config.ts
git commit -m "feat(shims): stdin shim — synthesize StdinData from mock context"
```

---

### Task 7: Shim `i18n`

**Files:**
- Create: `src/upstream-shims/i18n.ts`
- Modify: `vite.config.ts`

Upstream's `i18n/index.ts` loads JSON locale files via `fs.readFileSync` and exposes `t(key)`. Browser shim reads from a small static dictionary covering only the keys used in render code.

- [ ] **Step 1: List i18n keys used in the renderer**

```bash
grep -RhoE "t\(['\"]([^'\"]+)['\"]" vendor/claude-hud/src/render/ | sort -u | head -40
```

Record each key.

- [ ] **Step 2: Read upstream's English locale to copy the values**

```bash
cat vendor/claude-hud/src/i18n/locales/en.json 2>/dev/null | head -60
```

(If the locale isn't a single JSON file but a TS module, adjust path.)

- [ ] **Step 3: Create `src/upstream-shims/i18n.ts`**

```typescript
// Inline copy of upstream's English locale values for the keys the renderer
// uses. Keep in sync with vendor/claude-hud/src/i18n/locales/en.json on each
// submodule bump.
const EN: Record<string, string> = {
  // populate from Step 2 — exact keys/values from upstream en.json
  'label.usage': 'Usage',
  'label.weekly': 'Weekly',
  'format.resets': 'resets',
  'format.resetsIn': 'resets in',
  'format.out': 'out',
  'format.tokPerSec': 'tok/s',
  'status.limitReached': 'Limit reached',
  // …all other keys discovered in Step 1
}

export function t(key: string): string {
  return EN[key] ?? key
}

export function setLocale(_locale: string): void {
  // Browser shim is English-only; future locales can be added when the
  // editor UI exposes a language toggle that should affect preview text.
}
```

- [ ] **Step 4: Add Vite aliases**

```typescript
{ find: /^@upstream\/i18n\/index(\.js)?$/, replacement: u('./src/upstream-shims/i18n.ts') },
{ find: /^@upstream\/i18n(\.js)?$/, replacement: u('./src/upstream-shims/i18n.ts') },
```

- [ ] **Step 5: Verify type-check**

```bash
pnpm type-check 2>&1 | tail -5
```

- [ ] **Step 6: Commit**

```bash
git add src/upstream-shims/i18n.ts vite.config.ts
git commit -m "feat(shims): i18n shim — inline EN keys for render-time t()"
```

---

### Task 8: Shim `transcript`, `cost`, `speed-tracker`, `external-usage`, `version`, `extra-cmd`, `debug`, `claude-config-dir`, `config-reader`

**Files:**
- Create: 9 files under `src/upstream-shims/`
- Modify: `vite.config.ts`

These modules either do file I/O (transcript JSONL parse, MCP config read), spawn processes (version), or accumulate runtime state (speed-tracker). All of them are replaced with deterministic stubs returning either our `MOCK_CONTEXT` data or safe defaults.

- [ ] **Step 1: Create each shim**

`src/upstream-shims/transcript.ts`:
```typescript
import type { TranscriptData } from '@upstream/types'
import { MOCK_CONTEXT } from '@/lib/mock-context'

export function parseTranscript(_path: string | undefined): TranscriptData {
  return {
    tools: MOCK_CONTEXT.tools.map((t, i) => ({
      id: `tool-${i}`,
      name: t.name,
      target: t.target,
      status: 'completed',
      startTime: new Date(Date.now() - 60_000),
    })),
    agents: MOCK_CONTEXT.agents.map((a, i) => ({
      id: `agent-${i}`,
      type: a.type,
      status: a.status,
      startTime: new Date(Date.now() - 30_000),
    })),
    todos: MOCK_CONTEXT.todos,
    sessionStart: new Date(Date.now() - 14 * 60_000),
    sessionName: MOCK_CONTEXT.project.sessionName,
  }
}
```

`src/upstream-shims/cost.ts`:
```typescript
import type { RenderContext } from '@upstream/types'

export function renderCostEstimate(_ctx: RenderContext): string | null {
  return null  // preview never shows cost estimate
}
```

`src/upstream-shims/speed-tracker.ts`:
```typescript
import type { StdinData } from '@upstream/types'

export function getOutputSpeed(_stdin: StdinData): number | null {
  return null
}
```

`src/upstream-shims/external-usage.ts`:
```typescript
import type { ExternalUsageSnapshot } from '@upstream/types'

export function readExternalUsage(_path: string): ExternalUsageSnapshot | null {
  return null
}
```

`src/upstream-shims/version.ts`:
```typescript
import { MOCK_CONTEXT } from '@/lib/mock-context'

export function getClaudeCodeVersion(): string {
  return MOCK_CONTEXT.claudeCodeVersion
}
```

`src/upstream-shims/extra-cmd.ts`:
```typescript
export function getExtraLabel(): string | null {
  return null
}
```

`src/upstream-shims/debug.ts`:
```typescript
export function debug(..._args: unknown[]): void {
  // no-op in browser
}
export const isDebugEnabled = false
```

`src/upstream-shims/claude-config-dir.ts`:
```typescript
export function getHudPluginDir(): string {
  return '/claude-hud'  // never actually read
}
export function getClaudeConfigDir(): string {
  return '/.claude'
}
```

`src/upstream-shims/config-reader.ts`:
```typescript
import { MOCK_CONTEXT } from '@/lib/mock-context'

export function countMcpServers(): number {
  return MOCK_CONTEXT.environment.mcpCount
}
export function countHooks(): number {
  return MOCK_CONTEXT.environment.hooksCount
}
export function countClaudeMd(): number {
  return MOCK_CONTEXT.environment.claudeMdCount
}
export function countRules(): number {
  return MOCK_CONTEXT.environment.rulesCount
}
```

- [ ] **Step 2: Verify exports against upstream**

For each shim, run `grep "^export" vendor/claude-hud/src/<module>.ts` to confirm signatures. Add any missing exports as stub returns matching the upstream type.

- [ ] **Step 3: Add Vite aliases for all 9**

In `vite.config.ts`:
```typescript
{ find: /^@upstream\/transcript(\.js)?$/, replacement: u('./src/upstream-shims/transcript.ts') },
{ find: /^@upstream\/render\/lines\/cost(\.js)?$/, replacement: u('./src/upstream-shims/cost.ts') },
{ find: /^@upstream\/speed-tracker(\.js)?$/, replacement: u('./src/upstream-shims/speed-tracker.ts') },
{ find: /^@upstream\/external-usage(\.js)?$/, replacement: u('./src/upstream-shims/external-usage.ts') },
{ find: /^@upstream\/version(\.js)?$/, replacement: u('./src/upstream-shims/version.ts') },
{ find: /^@upstream\/extra-cmd(\.js)?$/, replacement: u('./src/upstream-shims/extra-cmd.ts') },
{ find: /^@upstream\/debug(\.js)?$/, replacement: u('./src/upstream-shims/debug.ts') },
{ find: /^@upstream\/claude-config-dir(\.js)?$/, replacement: u('./src/upstream-shims/claude-config-dir.ts') },
{ find: /^@upstream\/config-reader(\.js)?$/, replacement: u('./src/upstream-shims/config-reader.ts') },
```

- [ ] **Step 4: Verify type-check**

```bash
pnpm type-check 2>&1 | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add src/upstream-shims/*.ts vite.config.ts
git commit -m "feat(shims): transcript/cost/speed/version/etc. — deterministic mock data"
```

---

### Task 9: Shim `git`

**Files:**
- Create: `src/upstream-shims/git.ts`
- Modify: `vite.config.ts`

Upstream's `git.ts` runs `git` subprocess commands. Browser shim returns mock data shaped as upstream's `GitStatus`.

- [ ] **Step 1: Read upstream `GitStatus` shape**

```bash
grep -A 30 "export interface GitStatus" vendor/claude-hud/src/git.ts
```

- [ ] **Step 2: Create `src/upstream-shims/git.ts`**

```typescript
import type { GitStatus } from '@upstream/git'
import { MOCK_CONTEXT } from '@/lib/mock-context'

export function getGitStatus(): GitStatus | null {
  const g = MOCK_CONTEXT.git
  return {
    branch: g.branch,
    branchUrl: undefined,
    isDirty: g.dirty,
    ahead: g.ahead,
    behind: g.behind,
    fileStats: g.modifiedFiles || g.untrackedFiles
      ? { trackedFiles: [], untracked: g.untrackedFiles }
      : undefined,
    lineDiff: undefined,
  }
}

// Re-export the type so upstream's type imports continue to resolve to the same shape.
export type { GitStatus } from '@upstream/git'
```

If upstream's `GitStatus` has additional fields the renderer reads, populate them from `MOCK_CONTEXT.git`. Add fields to `MockContext` if missing.

- [ ] **Step 3: Add Vite alias**

```typescript
{ find: /^@upstream\/git(\.js)?$/, replacement: u('./src/upstream-shims/git.ts') },
```

But: upstream files use `import type { GitStatus } from '../git.js'`. With our alias, that import resolves to our shim, which re-exports the type — but our shim itself imports the type from `@upstream/git` to re-export, which loops. Fix: have the shim import the type directly from upstream source bypassing the alias. Use the absolute submodule path:

```typescript
import type { GitStatus } from '../../vendor/claude-hud/src/git.ts'
// rest of shim
```

(Or define a separate types-only alias that doesn't redirect through the shim.)

- [ ] **Step 4: Type-check**

```bash
pnpm type-check 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add src/upstream-shims/git.ts vite.config.ts
git commit -m "feat(shims): git — return mock GitStatus"
```

---

### Task 10: Shim `utils/terminal`

**Files:**
- Create: `src/upstream-shims/terminal.ts`
- Modify: `vite.config.ts`

Upstream's `utils/terminal.ts` reads `process.stdout.columns`. Shim returns a fixed wide width (matching xterm's `cols` setting).

- [ ] **Step 1: Read upstream signatures**

```bash
grep "^export" vendor/claude-hud/src/utils/terminal.ts
```

Expected exports: `getTerminalWidth(opts?)`, `getAdaptiveBarWidth()`, `UNKNOWN_TERMINAL_WIDTH`.

- [ ] **Step 2: Create `src/upstream-shims/terminal.ts`**

```typescript
export const UNKNOWN_TERMINAL_WIDTH = 0

// Must match HudPreviewXterm's Terminal({ cols }) — 120 by default.
const FIXED_WIDTH = 120

export function getTerminalWidth(_opts?: {
  preferEnv?: boolean
  fallback?: number
}): number {
  return FIXED_WIDTH
}

export function getAdaptiveBarWidth(): number {
  return 30
}
```

- [ ] **Step 3: Add Vite alias**

```typescript
{ find: /^@upstream\/utils\/terminal(\.js)?$/, replacement: u('./src/upstream-shims/terminal.ts') },
```

- [ ] **Step 4: Commit**

```bash
git add src/upstream-shims/terminal.ts vite.config.ts
git commit -m "feat(shims): utils/terminal — fixed 120-column width"
```

---

### Task 11: Build MOCK_RENDER_CONTEXT

**Files:**
- Create: `src/preview/mock-render-context.ts`

Construct upstream's `RenderContext` from our `MockContext` + `parsedConfig`.

- [ ] **Step 1: Create the file**

```typescript
import type { RenderContext, UsageData, MemoryInfo } from '@upstream/types'
import type { HudConfig } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'
import { parseTranscript } from '@/upstream-shims/transcript'
import { getGitStatus } from '@/upstream-shims/git'

export function buildMockRenderContext(config: HudConfig): RenderContext {
  const now = Date.now()
  const usageData: UsageData = {
    fiveHour: MOCK_CONTEXT.usage.fiveHour,
    sevenDay: MOCK_CONTEXT.usage.sevenDay,
    fiveHourResetAt: new Date(now + MOCK_CONTEXT.usage.fiveHourResetAtMinutes * 60_000),
    sevenDayResetAt: new Date(now + MOCK_CONTEXT.usage.sevenDayResetAtMinutes * 60_000),
  }
  const memoryUsage: MemoryInfo = {
    totalBytes: MOCK_CONTEXT.memory.totalGb * 1024 ** 3,
    usedBytes: MOCK_CONTEXT.memory.usedGb * 1024 ** 3,
    freeBytes: (MOCK_CONTEXT.memory.totalGb - MOCK_CONTEXT.memory.usedGb) * 1024 ** 3,
    usedPercent: MOCK_CONTEXT.memory.usedPercent,
  }
  return {
    config,
    stdin: {
      cwd: MOCK_CONTEXT.project.cwd,
      workspace: {
        current_dir: MOCK_CONTEXT.project.cwd,
        added_dirs: MOCK_CONTEXT.project.addedDirs,
      },
      model: {
        id: MOCK_CONTEXT.model.id,
        display_name: MOCK_CONTEXT.model.displayName,
      },
      context_window: {
        context_window_size: MOCK_CONTEXT.context.contextWindow,
        used_percentage: MOCK_CONTEXT.context.usedPercentage,
        current_usage: {
          input_tokens: MOCK_CONTEXT.context.inputTokens,
          output_tokens: MOCK_CONTEXT.context.outputTokens,
          cache_creation_input_tokens: MOCK_CONTEXT.context.cacheCreationTokens,
          cache_read_input_tokens: MOCK_CONTEXT.context.cacheReadTokens,
        },
      },
      cost: {
        total_cost_usd: MOCK_CONTEXT.cost.totalUsd,
        total_duration_ms: MOCK_CONTEXT.cost.durationMs,
        total_lines_added: MOCK_CONTEXT.cost.linesAdded,
        total_lines_removed: MOCK_CONTEXT.cost.linesRemoved,
      },
      effort: { level: MOCK_CONTEXT.effort.level },
    },
    transcript: parseTranscript(undefined),
    claudeMdCount: MOCK_CONTEXT.environment.claudeMdCount,
    rulesCount: MOCK_CONTEXT.environment.rulesCount,
    mcpCount: MOCK_CONTEXT.environment.mcpCount,
    hooksCount: MOCK_CONTEXT.environment.hooksCount,
    sessionDuration: MOCK_CONTEXT.session.durationLabel,
    gitStatus: getGitStatus(),
    usageData,
    memoryUsage,
    extraLabel: null,
    outputStyle: MOCK_CONTEXT.outputStyle,
    claudeCodeVersion: MOCK_CONTEXT.claudeCodeVersion,
    effortLevel: MOCK_CONTEXT.effort.level,
    effortSymbol: MOCK_CONTEXT.effort.symbol,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/preview/mock-render-context.ts
git commit -m "feat(preview): build upstream RenderContext from our MockContext"
```

---

### Task 12: Build upstream-bridge — renderToString

**Files:**
- Create: `src/preview/upstream-bridge.ts`
- Create: `tests/unit/upstream-bridge.test.ts`

Upstream's `render(ctx)` writes lines via `console.log`. The bridge intercepts that synchronously for the duration of one call and returns the captured ANSI string.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/upstream-bridge.test.ts
import { describe, it, expect } from 'vitest'
import { renderToString } from '@/preview/upstream-bridge'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'

describe('renderToString', () => {
  it('produces a non-empty string for DEFAULT_CONFIG', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  it('contains the project segment', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('claude-uhd-cc')
  })

  it('uses CRLF line endings (for xterm consumption)', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('\r\n')
  })

  it('emits ANSI reset escapes', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('\x1b[0m')
  })

  it('restores console.log after running', () => {
    const original = console.log
    renderToString(DEFAULT_CONFIG)
    expect(console.log).toBe(original)
  })

  it('restores console.log even if upstream throws', () => {
    const original = console.log
    try {
      // Force a throw by passing a config that triggers something invalid.
      // (If no path throws naturally, the next assertion still holds via finally.)
      renderToString({ ...DEFAULT_CONFIG, lineLayout: 'expanded' })
    } catch {
      // ignore
    }
    expect(console.log).toBe(original)
  })
})
```

- [ ] **Step 2: Run, verify FAIL**

```bash
pnpm test:run -- upstream-bridge 2>&1 | tail -5
```

Expected: module not found.

- [ ] **Step 3: Create `src/preview/upstream-bridge.ts`**

```typescript
import type { HudConfig } from '@/lib/hud-schema'
import { render } from '@upstream/render'
import { buildMockRenderContext } from '@/preview/mock-render-context'

export function renderToString(config: HudConfig): string {
  const ctx = buildMockRenderContext(config)
  const lines: string[] = []
  const original = console.log
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(' '))
  }
  try {
    render(ctx)
  } finally {
    console.log = original
  }
  return lines.join('\r\n')
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test:run -- upstream-bridge 2>&1 | tail -10
```

Expected: all 6 pass. If a test fails because a required upstream module isn't shimmed, the error will say which one — add it to the shim set (Task 8) and retry.

- [ ] **Step 5: Commit**

```bash
git add src/preview/upstream-bridge.ts tests/unit/upstream-bridge.test.ts
git commit -m "feat(preview): upstream-bridge — capture render() output as ANSI string"
```

---

### Task 13: Wire upstream-bridge into HudPreviewXterm

**Files:**
- Modify: `src/preview/HudPreviewXterm.vue`

- [ ] **Step 1: Edit `src/preview/HudPreviewXterm.vue`**

Replace lines:
```typescript
import { renderAllAnsi } from '@/preview/render-ansi'
```
with:
```typescript
import { renderToString } from '@/preview/upstream-bridge'
```

Replace the `redraw()` function:
```typescript
function redraw() {
  if (!term) return
  term.reset()
  term.write(renderToString(props.config))
}
```

- [ ] **Step 2: Run dev server, visual check**

```bash
pnpm dev
```

Open `http://localhost:5173`. The preview should now look identical to running `claude-hud` in a terminal. Compare directly:

```bash
# In another terminal (with MOCK stdin):
echo '{"model":{"display_name":"Opus 4.7"},"context_window":{"context_window_size":1000000,"used_percentage":58},"cwd":"/Users/dh/Desktop/code/claude-uhd-cc"}' | \
  node ~/.claude/plugins/marketplaces/claude-hud/dist/index.js
```

Lines from terminal `claude-hud` and the browser preview should match (allowing for env-driven differences: width, color depth).

Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/preview/HudPreviewXterm.vue
git commit -m "feat(preview): preview now uses upstream render() — byte-identical to terminal"
```

---

### Task 14: Delete obsolete preview files

**Files:**
- Delete: `src/preview/lines/` (entire directory — 8 files)
- Delete: `src/preview/render-line.ts`
- Delete: `src/preview/render-ansi.ts`
- Delete: `src/preview/color-map.ts`
- Delete: `src/preview/types.ts`
- Delete: `tests/unit/preview/` (entire directory)
- Delete: `tests/unit/color-map.test.ts`
- Delete: `tests/unit/render-ansi.test.ts`

- [ ] **Step 1: Confirm nothing imports them**

```bash
grep -rE "from '@/preview/(render-line|render-ansi|color-map|types|lines/)" src tests --include='*.ts' --include='*.vue'
```

Expected: no output. If any consumer remains, the previous tasks left something stale — investigate before deleting.

- [ ] **Step 2: Delete**

```bash
git rm -r src/preview/lines src/preview/render-line.ts src/preview/render-ansi.ts \
  src/preview/color-map.ts src/preview/types.ts \
  tests/unit/preview tests/unit/color-map.test.ts tests/unit/render-ansi.test.ts
```

- [ ] **Step 3: Verify**

```bash
pnpm type-check && pnpm test:run 2>&1 | tail -5
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(preview): delete hand-port renderers — replaced by upstream"
```

---

### Task 15: Final pipeline + tag

- [ ] **Step 1: Full pipeline**

```bash
pnpm type-check && pnpm lint && pnpm test:run && pnpm build 2>&1 | tail -15
```

Expected: all green. Build size note: should be roughly the same as Plan 03 + xterm (167 KB gzipped) since upstream's renderer replaces our preview lines (similar size).

- [ ] **Step 2: Manual acceptance smoke**

```bash
pnpm dev
```

Verify in order:
1. Default page: preview shows project + context + usage at the configured defaults
2. Toggle `usageThreshold` to 50 in Thresholds tab — usage line *disappears* (upstream behavior: hide when below threshold). This is the key drift fix.
3. Change `modelOverride` to "Sonnet 4.6" — model badge updates
4. Change `showTools` / `showAgents` / `showTodos` — corresponding activity lines appear/disappear
5. Import a config with `{"display":{"futureField":99}}` — banner shows `1 unknownField`, preview unchanged

Stop with Ctrl+C.

- [ ] **Step 3: Tag**

```bash
git tag v1.2-upstream-renderer
```

- [ ] **Step 4: Update memory file**

Edit `/Users/dh/.claude/projects/-Users-dh-Desktop-code-claude-uhd-cc/memory/execution_state.md` to record completion of Plan 05 and that Plan 04 (deploy) is now the only remaining plan. Note the v1.2 tag.

---

## Self-review notes

- After Phase 1, `src/lib/hud-schema.ts` is 20 lines of re-exports; `src/lib/merge-config.ts` is deleted.
- After Phase 2, `src/preview/lines/` is gone; preview is byte-identical to terminal output.
- New surface area: `src/upstream-shims/` (~15 small files, mostly < 30 lines each) and `vite.config.ts`'s alias map.
- Upgrade flow for a future upstream commit:
  ```bash
  git -C vendor/claude-hud fetch && git -C vendor/claude-hud checkout <new-sha>
  pnpm test:run    # catches schema/render drift
  # if anything fails, the failure points to the shim or test to update
  git add vendor/claude-hud && git commit -m "chore: bump claude-hud to <sha>"
  ```
- The contract test from Plan 04 (`tests/contract/upstream-schema.test.ts`) becomes mostly redundant after Plan 05 — types are imported directly. Plan 04 should adjust its contract test to verify shim coverage instead (i.e. each upstream renderer-imported module has a shim).

**End state of Plan 05:** Preview is the canonical claude-hud output. We own the editor, not the renderer. Future upstream changes flow in via submodule bump and shim updates only when upstream introduces a new Node-only dep.

**Next plan:** Plan 04 (deploy + CI + contract test) — unchanged in scope but the contract test scope shifts from "schema field set matches" to "submodule shims cover all imports".
