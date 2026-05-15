/**
 * Browser shim for upstream's `stdin.ts`.
 *
 * The renderer needs the synchronous accessor functions (getModelName,
 * formatModelName, getContextPercent, etc.), all of which are pure given a
 * `StdinData` payload. The only browser-incompatible parts are:
 *
 *   1. `readStdin` — touches `process.stdin`. The renderer never calls it,
 *      but we keep a stub in case bundling drags it in.
 *   2. `getProviderLabel` — reads `process.env.CLAUDE_CODE_USE_BEDROCK` /
 *      `CLAUDE_CODE_USE_VERTEX`. In a browser preview there is no env, so
 *      we skip the env branches and fall back to model-id detection only.
 *
 * Every other function is reproduced verbatim from upstream to preserve
 * signature + behavior parity. Keep this file in sync whenever upstream's
 * stdin.ts changes.
 */
import type { ModelFormatMode } from '@upstream/config.js'
import { AUTOCOMPACT_BUFFER_PERCENT } from '@upstream/constants.js'

/**
 * Local type duplicates of `StdinData` and `UsageData` from `@upstream/types.js`.
 *
 * Why duplicate instead of `import type`?
 *   Upstream's types.ts does `import type { GitStatus } from './git.js'`. With
 *   `moduleResolution: bundler`, even type-only imports add the target file to
 *   the program — and git.ts has `noUncheckedIndexedAccess` errors that are
 *   waiting on a `tsconfig.upstream.json` with relaxed rules (per the comment
 *   in tsconfig.app.json). Inlining the type subset we need keeps this shim
 *   compileable today without that wider scaffolding.
 *
 *   Drift risk is bounded: these mirror Claude Code's stdin contract, which
 *   is part of Claude Code's public statusline protocol — stable across
 *   versions. Re-sync if upstream's types.ts changes.
 */
export interface StdinData {
  transcript_path?: string
  cwd?: string
  workspace?: {
    current_dir?: string
    project_dir?: string
    added_dirs?: string[]
    git_worktree?: string
  } | null
  model?: {
    id?: string
    display_name?: string
  }
  context_window?: {
    context_window_size?: number
    total_input_tokens?: number | null
    total_output_tokens?: number | null
    current_usage?: {
      input_tokens?: number
      output_tokens?: number
      cache_creation_input_tokens?: number
      cache_read_input_tokens?: number
    } | null
    used_percentage?: number | null
    remaining_percentage?: number | null
  }
  cost?: {
    total_cost_usd?: number | null
    total_duration_ms?: number | null
    total_api_duration_ms?: number | null
    total_lines_added?: number | null
    total_lines_removed?: number | null
  } | null
  rate_limits?: {
    five_hour?: {
      used_percentage?: number | null
      resets_at?: number | null
    } | null
    seven_day?: {
      used_percentage?: number | null
      resets_at?: number | null
    } | null
  } | null
  effort?: string | { level?: string | null; [key: string]: unknown } | null
}

export interface UsageData {
  fiveHour: number | null
  sevenDay: number | null
  fiveHourResetAt: Date | null
  sevenDayResetAt: Date | null
  balanceLabel?: string | null
}

/** Renderer doesn't call this — stub returns null (same as TTY-detected branch upstream). */
export async function readStdin(): Promise<StdinData | null> {
  return null
}

export function getTotalTokens(stdin: StdinData): number {
  const usage = stdin.context_window?.current_usage
  return (
    (usage?.input_tokens ?? 0) +
    (usage?.cache_creation_input_tokens ?? 0) +
    (usage?.cache_read_input_tokens ?? 0)
  )
}

/**
 * Get native percentage from Claude Code v2.1.6+ if available.
 * Returns null if not available or invalid, triggering fallback to manual calculation.
 */
function getNativePercent(stdin: StdinData): number | null {
  const nativePercent = stdin.context_window?.used_percentage
  if (typeof nativePercent === 'number' && !Number.isNaN(nativePercent) && nativePercent > 0) {
    return Math.min(100, Math.max(0, Math.round(nativePercent)))
  }
  return null
}

export function getContextPercent(stdin: StdinData): number {
  const native = getNativePercent(stdin)
  if (native !== null) {
    return native
  }

  const size = stdin.context_window?.context_window_size
  if (!size || size <= 0) {
    return 0
  }

  const totalTokens = getTotalTokens(stdin)
  return Math.min(100, Math.round((totalTokens / size) * 100))
}

export function getBufferedPercent(stdin: StdinData): number {
  const native = getNativePercent(stdin)
  if (native !== null) {
    return native
  }

  const size = stdin.context_window?.context_window_size
  if (!size || size <= 0) {
    return 0
  }

  const totalTokens = getTotalTokens(stdin)
  const rawRatio = totalTokens / size
  const LOW = 0.05
  const HIGH = 0.5
  const scale = Math.min(1, Math.max(0, (rawRatio - LOW) / (HIGH - LOW)))
  const buffer = size * AUTOCOMPACT_BUFFER_PERCENT * scale

  return Math.min(100, Math.round(((totalTokens + buffer) / size) * 100))
}

// Enterprise plan alias → human-readable display name
const ENTERPRISE_ALIAS_LABELS: Record<string, string> = {
  opusplan: 'Claude Opus',
  sonnetplan: 'Claude Sonnet',
  haikuplan: 'Claude Haiku',
}

export function getModelName(stdin: StdinData): string {
  const displayName = stdin.model?.display_name?.trim()
  if (displayName) {
    return displayName
  }

  const modelId = stdin.model?.id?.trim()
  if (!modelId) {
    return 'Unknown'
  }

  const enterpriseLabel = ENTERPRISE_ALIAS_LABELS[modelId.toLowerCase()]
  if (enterpriseLabel) {
    return enterpriseLabel
  }

  const normalizedBedrockLabel = normalizeBedrockModelLabel(modelId)
  return normalizedBedrockLabel ?? modelId
}

export function isBedrockModelId(modelId?: string): boolean {
  if (!modelId) {
    return false
  }
  const normalized = modelId.toLowerCase()
  return normalized.includes('anthropic.claude-')
}

// Vertex AI model IDs use '@' as version separator (e.g. claude-3-5-sonnet@20241022)
export function isVertexModelId(modelId?: string): boolean {
  if (!modelId) {
    return false
  }
  return modelId.includes('@')
}

const ENTERPRISE_MODEL_IDS = new Set(['opusplan', 'sonnetplan', 'haikuplan'])

export function isEnterpriseModelId(modelId?: string): boolean {
  if (!modelId) {
    return false
  }
  return ENTERPRISE_MODEL_IDS.has(modelId.toLowerCase())
}

/**
 * Browser variant: upstream checks `process.env.CLAUDE_CODE_USE_BEDROCK` and
 * `CLAUDE_CODE_USE_VERTEX` first. In a browser preview there is no env, so
 * those branches are unreachable — we fall through to enterprise model-id
 * detection. The preview pane therefore can't synthesize 'Bedrock' / 'Vertex'
 * labels purely from env, but it can still surface 'Enterprise' from model id.
 */
export function getProviderLabel(stdin: StdinData): string | null {
  if (isEnterpriseModelId(stdin.model?.id)) {
    return 'Enterprise'
  }
  return null
}

export function shouldHideUsage(stdin: StdinData): boolean {
  return getProviderLabel(stdin) === 'Bedrock' || isBedrockModelId(stdin.model?.id)
}

function parseRateLimitPercent(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  return Math.round(Math.min(100, Math.max(0, value)))
}

function parseRateLimitResetAt(value: number | null | undefined): Date | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null
  }

  return new Date(value * 1000)
}

export function getUsageFromStdin(stdin: StdinData): UsageData | null {
  const rateLimits = stdin.rate_limits
  if (!rateLimits) {
    return null
  }

  const fiveHour = parseRateLimitPercent(rateLimits.five_hour?.used_percentage)
  const sevenDay = parseRateLimitPercent(rateLimits.seven_day?.used_percentage)
  if (fiveHour === null && sevenDay === null) {
    return null
  }

  return {
    fiveHour,
    sevenDay,
    fiveHourResetAt: parseRateLimitResetAt(rateLimits.five_hour?.resets_at),
    sevenDayResetAt: parseRateLimitResetAt(rateLimits.seven_day?.resets_at),
  }
}

/**
 * Strips redundant context-window size suffixes from model display names.
 */
export function stripContextSuffix(name: string): string {
  return name.replace(/\s*\([^)]*\bcontext\b[^)]*\)/i, '').trim()
}

/**
 * Formats a model name according to the user's chosen display settings.
 */
export function formatModelName(name: string, format?: ModelFormatMode, override?: string): string {
  if (override) {
    return override
  }

  if (!format || format === 'full') {
    return name
  }

  let result = stripContextSuffix(name)

  if (format === 'short') {
    result = result.replace(/^Claude\s+/i, '')
  }

  return result
}

function normalizeBedrockModelLabel(modelId: string): string | null {
  if (!isBedrockModelId(modelId)) {
    return null
  }

  const lowercaseId = modelId.toLowerCase()
  const claudePrefix = 'anthropic.claude-'
  const claudeIndex = lowercaseId.indexOf(claudePrefix)
  if (claudeIndex === -1) {
    return null
  }

  let suffix = lowercaseId.slice(claudeIndex + claudePrefix.length)
  suffix = suffix.replace(/-v\d+:\d+$/, '')
  suffix = suffix.replace(/-\d{8}$/, '')

  const tokens = suffix.split('-').filter(Boolean)
  if (tokens.length === 0) {
    return null
  }

  const familyIndex = tokens.findIndex((token) => token === 'haiku' || token === 'sonnet' || token === 'opus')
  if (familyIndex === -1) {
    return null
  }

  const family = tokens[familyIndex]
  if (!family) {
    return null
  }
  const beforeVersion = readNumericVersion(tokens, familyIndex - 1, -1).reverse()
  const afterVersion = readNumericVersion(tokens, familyIndex + 1, 1)
  const versionParts = beforeVersion.length >= afterVersion.length ? beforeVersion : afterVersion
  const version = versionParts.length ? versionParts.join('.') : null
  const familyLabel = family[0]!.toUpperCase() + family.slice(1)

  return version ? `Claude ${familyLabel} ${version}` : `Claude ${familyLabel}`
}

function readNumericVersion(tokens: string[], startIndex: number, step: -1 | 1): string[] {
  const parts: string[] = []
  for (let i = startIndex; i >= 0 && i < tokens.length; i += step) {
    const token = tokens[i]
    if (!token || !/^\d+$/.test(token)) {
      break
    }
    parts.push(token)
    if (parts.length === 2) {
      break
    }
  }
  return parts
}
