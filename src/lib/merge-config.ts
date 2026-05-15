import {
  DEFAULT_CONFIG,
  DEFAULT_ELEMENT_ORDER,
  DEFAULT_MERGE_GROUPS,
  KNOWN_HUD_ELEMENTS,
  type HudConfig,
  type HudElement,
  type HudColorValue,
  type HudColorName,
  type Language,
  type LineLayoutType,
  type AutocompactBufferMode,
  type ContextValueMode,
  type UsageValueMode,
  type GitBranchOverflowMode,
  type ModelFormatMode,
  type TimeFormatMode,
  type AddedDirsLayout,
} from '@/lib/hud-schema'

const NAMED_COLORS: ReadonlySet<HudColorName> = new Set([
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

function validLanguage(v: unknown): v is Language {
  return v === 'en' || v === 'zh'
}
function validLineLayout(v: unknown): v is LineLayoutType {
  return v === 'compact' || v === 'expanded'
}
function validPathLevels(v: unknown): v is 1 | 2 | 3 {
  return v === 1 || v === 2 || v === 3
}
function validAutocompact(v: unknown): v is AutocompactBufferMode {
  return v === 'enabled' || v === 'disabled'
}
function validBranchOverflow(v: unknown): v is GitBranchOverflowMode {
  return v === 'truncate' || v === 'wrap'
}
function validContextValue(v: unknown): v is ContextValueMode {
  return v === 'percent' || v === 'tokens' || v === 'remaining' || v === 'both'
}
function validUsageValue(v: unknown): v is UsageValueMode {
  return v === 'percent' || v === 'remaining'
}
function validModelFormat(v: unknown): v is ModelFormatMode {
  return v === 'full' || v === 'compact' || v === 'short'
}
function validTimeFormat(v: unknown): v is TimeFormatMode {
  return v === 'relative' || v === 'absolute' || v === 'both'
}
function validAddedDirsLayout(v: unknown): v is AddedDirsLayout {
  return v === 'inline' || v === 'line'
}
function validColor(v: unknown): v is HudColorValue {
  if (typeof v === 'string' && NAMED_COLORS.has(v as HudColorName)) return true
  if (typeof v === 'string' && HEX_PATTERN.test(v)) return true
  if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 255) return true
  return false
}
function validBarChar(v: unknown): v is string {
  if (typeof v !== 'string' || v.length === 0) return false
  const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  return Array.from(seg.segment(v)).length === 1
}

function clamp(v: unknown, max: number, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  return Math.max(0, Math.min(max, v))
}
function clampInt(v: unknown, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) return fallback
  return Math.max(0, Math.floor(v))
}
function clampDuration(v: unknown, fallback: number): number {
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return fallback
  return Math.floor(v)
}
function trimOptional(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}
function clampStr(v: unknown, max: number, fallback: string): string {
  return typeof v === 'string' ? v.slice(0, max) : fallback
}

function validElementOrder(v: unknown): HudElement[] {
  if (!Array.isArray(v) || v.length === 0) return [...DEFAULT_ELEMENT_ORDER]
  const seen = new Set<HudElement>()
  const out: HudElement[] = []
  for (const item of v) {
    if (typeof item !== 'string' || !KNOWN_HUD_ELEMENTS.has(item as HudElement)) continue
    const el = item as HudElement
    if (seen.has(el)) continue
    seen.add(el)
    out.push(el)
  }
  return out.length > 0 ? out : [...DEFAULT_ELEMENT_ORDER]
}

function validMergeGroups(v: unknown): HudElement[][] {
  if (!Array.isArray(v)) return DEFAULT_MERGE_GROUPS.map((g) => [...g])
  if (v.length === 0) return []
  const usedElements = new Set<HudElement>()
  const result: HudElement[][] = []
  for (const group of v) {
    if (!Array.isArray(group)) continue
    const seen = new Set<HudElement>()
    const normalized: HudElement[] = []
    for (const item of group) {
      if (typeof item !== 'string' || !KNOWN_HUD_ELEMENTS.has(item as HudElement)) continue
      const el = item as HudElement
      if (seen.has(el) || usedElements.has(el)) continue
      seen.add(el)
      normalized.push(el)
    }
    if (normalized.length >= 2) {
      for (const el of normalized) usedElements.add(el)
      result.push(normalized)
    }
  }
  return result.length > 0 ? result : DEFAULT_MERGE_GROUPS.map((g) => [...g])
}

interface LegacyConfig {
  layout?: 'default' | 'separators' | Record<string, unknown>
}

function migrate(input: Partial<HudConfig> & LegacyConfig): Partial<HudConfig> {
  const m = { ...input } as Partial<HudConfig> & LegacyConfig
  if ('layout' in input && !('lineLayout' in input)) {
    if (typeof input.layout === 'string') {
      if (input.layout === 'separators') {
        m.lineLayout = 'compact'
        m.showSeparators = true
      } else {
        m.lineLayout = 'compact'
        m.showSeparators = false
      }
    } else if (input.layout && typeof input.layout === 'object') {
      const obj = input.layout as Record<string, unknown>
      if (typeof obj.lineLayout === 'string') m.lineLayout = obj.lineLayout as LineLayoutType
      if (typeof obj.showSeparators === 'boolean') m.showSeparators = obj.showSeparators
      if (typeof obj.pathLevels === 'number') m.pathLevels = obj.pathLevels as 1 | 2 | 3
    }
    delete m.layout
  }
  return m
}

function pickBool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

export function mergeConfig(input: Partial<HudConfig> | Record<string, unknown>): HudConfig {
  const m = migrate(input as Partial<HudConfig> & LegacyConfig)
  const D = DEFAULT_CONFIG
  const inDisp = (m.display ?? {}) as Partial<HudConfig['display']>
  const inGit = (m.gitStatus ?? {}) as Partial<HudConfig['gitStatus']>
  const inColors = (m.colors ?? {}) as Partial<HudConfig['colors']>

  const rawMax = (m as Record<string, unknown>).maxWidth
  const maxWidth =
    typeof rawMax === 'number' && Number.isFinite(rawMax) && rawMax > 0 ? Math.floor(rawMax) : null

  return {
    language: validLanguage(m.language) ? m.language : D.language,
    lineLayout: validLineLayout(m.lineLayout) ? m.lineLayout : D.lineLayout,
    showSeparators: pickBool(m.showSeparators, D.showSeparators),
    pathLevels: validPathLevels(m.pathLevels) ? m.pathLevels : D.pathLevels,
    maxWidth,
    forceMaxWidth: pickBool((m as Record<string, unknown>).forceMaxWidth, D.forceMaxWidth),
    elementOrder: validElementOrder(m.elementOrder),
    gitStatus: {
      enabled: pickBool(inGit.enabled, D.gitStatus.enabled),
      showDirty: pickBool(inGit.showDirty, D.gitStatus.showDirty),
      showAheadBehind: pickBool(inGit.showAheadBehind, D.gitStatus.showAheadBehind),
      showFileStats: pickBool(inGit.showFileStats, D.gitStatus.showFileStats),
      branchOverflow: validBranchOverflow(inGit.branchOverflow)
        ? inGit.branchOverflow
        : D.gitStatus.branchOverflow,
      pushWarningThreshold: clampInt(inGit.pushWarningThreshold, D.gitStatus.pushWarningThreshold),
      pushCriticalThreshold: clampInt(
        inGit.pushCriticalThreshold,
        D.gitStatus.pushCriticalThreshold,
      ),
    },
    display: {
      showModel: pickBool(inDisp.showModel, D.display.showModel),
      showProject: pickBool(inDisp.showProject, D.display.showProject),
      showAddedDirs: pickBool(inDisp.showAddedDirs, D.display.showAddedDirs),
      addedDirsLayout: validAddedDirsLayout(inDisp.addedDirsLayout)
        ? inDisp.addedDirsLayout
        : D.display.addedDirsLayout,
      showContextBar: pickBool(inDisp.showContextBar, D.display.showContextBar),
      contextValue: validContextValue(inDisp.contextValue)
        ? inDisp.contextValue
        : D.display.contextValue,
      showConfigCounts: pickBool(inDisp.showConfigCounts, D.display.showConfigCounts),
      showCost: pickBool(inDisp.showCost, D.display.showCost),
      showDuration: pickBool(inDisp.showDuration, D.display.showDuration),
      showSpeed: pickBool(inDisp.showSpeed, D.display.showSpeed),
      showTokenBreakdown: pickBool(inDisp.showTokenBreakdown, D.display.showTokenBreakdown),
      showUsage: pickBool(inDisp.showUsage, D.display.showUsage),
      usageValue: validUsageValue(inDisp.usageValue) ? inDisp.usageValue : D.display.usageValue,
      usageBarEnabled: pickBool(inDisp.usageBarEnabled, D.display.usageBarEnabled),
      showResetLabel: pickBool(inDisp.showResetLabel, D.display.showResetLabel),
      usageCompact: pickBool(inDisp.usageCompact, D.display.usageCompact),
      showTools: pickBool(inDisp.showTools, D.display.showTools),
      showAgents: pickBool(inDisp.showAgents, D.display.showAgents),
      showTodos: pickBool(inDisp.showTodos, D.display.showTodos),
      showSessionName: pickBool(inDisp.showSessionName, D.display.showSessionName),
      showClaudeCodeVersion: pickBool(
        inDisp.showClaudeCodeVersion,
        D.display.showClaudeCodeVersion,
      ),
      showEffortLevel: pickBool(inDisp.showEffortLevel, D.display.showEffortLevel),
      showMemoryUsage: pickBool(inDisp.showMemoryUsage, D.display.showMemoryUsage),
      showPromptCache: pickBool(inDisp.showPromptCache, D.display.showPromptCache),
      promptCacheTtlSeconds: clampDuration(
        inDisp.promptCacheTtlSeconds,
        D.display.promptCacheTtlSeconds,
      ),
      showSessionTokens: pickBool(inDisp.showSessionTokens, D.display.showSessionTokens),
      showOutputStyle: pickBool(inDisp.showOutputStyle, D.display.showOutputStyle),
      showSessionStartDate: pickBool(inDisp.showSessionStartDate, D.display.showSessionStartDate),
      showLastResponseAt: pickBool(inDisp.showLastResponseAt, D.display.showLastResponseAt),
      mergeGroups: validMergeGroups(inDisp.mergeGroups),
      autocompactBuffer: validAutocompact(inDisp.autocompactBuffer)
        ? inDisp.autocompactBuffer
        : D.display.autocompactBuffer,
      contextWarningThreshold: clamp(
        inDisp.contextWarningThreshold,
        100,
        D.display.contextWarningThreshold,
      ),
      contextCriticalThreshold: clamp(
        inDisp.contextCriticalThreshold,
        100,
        D.display.contextCriticalThreshold,
      ),
      usageThreshold: clamp(inDisp.usageThreshold, 100, D.display.usageThreshold),
      sevenDayThreshold: clamp(inDisp.sevenDayThreshold, 100, D.display.sevenDayThreshold),
      environmentThreshold: clamp(inDisp.environmentThreshold, 100, D.display.environmentThreshold),
      externalUsagePath: trimOptional(inDisp.externalUsagePath),
      externalUsageFreshnessMs: clampInt(
        inDisp.externalUsageFreshnessMs,
        D.display.externalUsageFreshnessMs,
      ),
      modelFormat: validModelFormat(inDisp.modelFormat)
        ? inDisp.modelFormat
        : D.display.modelFormat,
      modelOverride: clampStr(inDisp.modelOverride, 80, D.display.modelOverride),
      customLine: clampStr(inDisp.customLine, 80, D.display.customLine),
      timeFormat: validTimeFormat(inDisp.timeFormat) ? inDisp.timeFormat : D.display.timeFormat,
    },
    colors: {
      context: validColor(inColors.context) ? (inColors.context as HudColorValue) : D.colors.context,
      usage: validColor(inColors.usage) ? (inColors.usage as HudColorValue) : D.colors.usage,
      warning: validColor(inColors.warning) ? (inColors.warning as HudColorValue) : D.colors.warning,
      usageWarning: validColor(inColors.usageWarning)
        ? (inColors.usageWarning as HudColorValue)
        : D.colors.usageWarning,
      critical: validColor(inColors.critical)
        ? (inColors.critical as HudColorValue)
        : D.colors.critical,
      model: validColor(inColors.model) ? (inColors.model as HudColorValue) : D.colors.model,
      project: validColor(inColors.project) ? (inColors.project as HudColorValue) : D.colors.project,
      git: validColor(inColors.git) ? (inColors.git as HudColorValue) : D.colors.git,
      gitBranch: validColor(inColors.gitBranch)
        ? (inColors.gitBranch as HudColorValue)
        : D.colors.gitBranch,
      label: validColor(inColors.label) ? (inColors.label as HudColorValue) : D.colors.label,
      custom: validColor(inColors.custom) ? (inColors.custom as HudColorValue) : D.colors.custom,
      barFilled: validBarChar(inColors.barFilled) ? inColors.barFilled : D.colors.barFilled,
      barEmpty: validBarChar(inColors.barEmpty) ? inColors.barEmpty : D.colors.barEmpty,
    },
  }
}
