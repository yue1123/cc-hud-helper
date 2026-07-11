import type { HudConfig, HudElement } from '@/lib/hud-schema'
import { DEFAULT_CONFIG, KNOWN_HUD_ELEMENTS } from '@/lib/hud-schema'
import { getPath, type JsonObject } from '@/lib/path-set'

export type DiagnosticKind =
  | 'clamped'
  | 'unknownEnum'
  | 'unknownElement'
  | 'duplicateInGroup'
  | 'invalidColor'
  | 'unknownField'

export type DiagnosticSeverity = 'info' | 'warn' | 'error'

export interface Diagnostic {
  path: string
  kind: DiagnosticKind
  severity: DiagnosticSeverity
  message: string
  from?: unknown
  to?: unknown
}

const CLAMPED_PATHS: Array<{ path: string; max: number }> = [
  { path: 'display.contextWarningThreshold', max: 100 },
  { path: 'display.contextCriticalThreshold', max: 100 },
  { path: 'display.usageThreshold', max: 100 },
  { path: 'display.sevenDayThreshold', max: 100 },
  { path: 'display.environmentThreshold', max: 100 },
]

const ENUM_PATHS: Array<{ path: string; values: ReadonlyArray<string> }> = [
  { path: 'lineLayout', values: ['compact', 'expanded'] },
  { path: 'language', values: ['en', 'zh', 'zh-Hans'] },
  { path: 'display.contextValue', values: ['percent', 'tokens', 'remaining', 'both'] },
  { path: 'display.usageValue', values: ['percent', 'remaining'] },
  { path: 'display.modelFormat', values: ['full', 'compact', 'short'] },
  {
    path: 'display.timeFormat',
    values: ['relative', 'absolute', 'both', 'elapsed', 'elapsedAndAbsolute'],
  },
  { path: 'display.customLinePosition', values: ['first', 'last'] },
  { path: 'display.addedDirsLayout', values: ['inline', 'line'] },
  { path: 'display.autocompactBuffer', values: ['enabled', 'disabled'] },
  { path: 'gitStatus.branchOverflow', values: ['truncate', 'wrap'] },
]

const COLOR_PATHS = [
  'colors.context',
  'colors.usage',
  'colors.warning',
  'colors.usageWarning',
  'colors.critical',
  'colors.model',
  'colors.project',
  'colors.git',
  'colors.gitBranch',
  'colors.label',
  'colors.custom',
]

const NAMED_COLORS = new Set([
  'dim',
  'red',
  'green',
  'yellow',
  'magenta',
  'cyan',
  'brightBlue',
  'brightMagenta',
])
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

function isValidColor(v: unknown): boolean {
  if (typeof v === 'string' && NAMED_COLORS.has(v)) return true
  if (typeof v === 'string' && HEX_PATTERN.test(v)) return true
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 255) return true
  return false
}

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function collectUnknownPaths(raw: JsonObject, ref: JsonObject, prefix = ''): string[] {
  const found: string[] = []
  for (const key of Object.keys(raw)) {
    const here = prefix ? `${prefix}.${key}` : key
    if (!(key in ref)) {
      found.push(here)
      continue
    }
    const rawV = raw[key]
    const refV = ref[key]
    if (isObject(rawV) && isObject(refV)) {
      found.push(...collectUnknownPaths(rawV, refV, here))
    }
  }
  return found
}

export function generateDiagnostics(rawJson: JsonObject, parsed: HudConfig): Diagnostic[] {
  const out: Diagnostic[] = []

  // 1. Clamped numerics
  for (const { path, max } of CLAMPED_PATHS) {
    const raw = getPath(rawJson, path)
    if (typeof raw !== 'number') continue
    if (raw > max || raw < 0) {
      const clamped = Math.max(0, Math.min(max, raw))
      out.push({
        path,
        kind: 'clamped',
        severity: 'warn',
        message: `Clamped to [0,${max}].`,
        from: raw,
        to: clamped,
      })
    }
  }

  // 2. Invalid enums
  for (const { path, values } of ENUM_PATHS) {
    const raw = getPath(rawJson, path)
    if (raw === undefined) continue
    if (typeof raw !== 'string' || !values.includes(raw)) {
      out.push({
        path,
        kind: 'unknownEnum',
        severity: 'warn',
        message: `Invalid value — fell back to default.`,
        from: raw,
        to: getPath(parsed as unknown as JsonObject, path),
      })
    }
  }

  // 3. Invalid colors
  for (const path of COLOR_PATHS) {
    const raw = getPath(rawJson, path)
    if (raw === undefined) continue
    if (!isValidColor(raw)) {
      out.push({
        path,
        kind: 'invalidColor',
        severity: 'warn',
        message: 'Not a valid color — fell back to default.',
        from: raw,
        to: getPath(parsed as unknown as JsonObject, path),
      })
    }
  }

  // 4. Unknown elements in elementOrder
  const rawOrder = getPath(rawJson, 'elementOrder')
  if (Array.isArray(rawOrder)) {
    const unknown = rawOrder.filter(
      (e) => typeof e !== 'string' || !KNOWN_HUD_ELEMENTS.has(e as HudElement),
    )
    if (unknown.length > 0) {
      out.push({
        path: 'elementOrder',
        kind: 'unknownElement',
        severity: 'info',
        message: `Removed unknown: ${unknown.join(', ')}`,
        from: unknown,
      })
    }
  }

  // 5. Unknown fields (anywhere in raw that's not in DEFAULT_CONFIG shape)
  const unknownFieldPaths = collectUnknownPaths(rawJson, DEFAULT_CONFIG as unknown as JsonObject)
  for (const path of unknownFieldPaths) {
    out.push({
      path,
      kind: 'unknownField',
      severity: 'info',
      message: 'Preserved on export, but not editable in the visual form.',
      from: getPath(rawJson, path),
    })
  }

  return out
}
