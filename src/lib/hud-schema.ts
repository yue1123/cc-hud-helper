export type Language = 'en' | 'zh'
export type LineLayoutType = 'compact' | 'expanded'
export type AutocompactBufferMode = 'enabled' | 'disabled'
export type ContextValueMode = 'percent' | 'tokens' | 'remaining' | 'both'
export type UsageValueMode = 'percent' | 'remaining'
export type GitBranchOverflowMode = 'truncate' | 'wrap'
export type ModelFormatMode = 'full' | 'compact' | 'short'
export type TimeFormatMode = 'relative' | 'absolute' | 'both'
export type AddedDirsLayout = 'inline' | 'line'

export type HudElement =
  | 'project'
  | 'addedDirs'
  | 'context'
  | 'usage'
  | 'promptCache'
  | 'memory'
  | 'environment'
  | 'tools'
  | 'agents'
  | 'todos'
  | 'sessionTime'

export type HudColorName =
  | 'dim'
  | 'red'
  | 'green'
  | 'yellow'
  | 'magenta'
  | 'cyan'
  | 'brightBlue'
  | 'brightMagenta'

export type HudColorValue = HudColorName | number | string

export interface HudColorOverrides {
  context: HudColorValue
  usage: HudColorValue
  warning: HudColorValue
  usageWarning: HudColorValue
  critical: HudColorValue
  model: HudColorValue
  project: HudColorValue
  git: HudColorValue
  gitBranch: HudColorValue
  label: HudColorValue
  custom: HudColorValue
  barFilled: string
  barEmpty: string
}

export interface HudGitStatusConfig {
  enabled: boolean
  showDirty: boolean
  showAheadBehind: boolean
  showFileStats: boolean
  branchOverflow: GitBranchOverflowMode
  pushWarningThreshold: number
  pushCriticalThreshold: number
}

export interface HudDisplayConfig {
  showModel: boolean
  showProject: boolean
  showAddedDirs: boolean
  addedDirsLayout: AddedDirsLayout
  showContextBar: boolean
  contextValue: ContextValueMode
  showConfigCounts: boolean
  showCost: boolean
  showDuration: boolean
  showSpeed: boolean
  showTokenBreakdown: boolean
  showUsage: boolean
  usageValue: UsageValueMode
  usageBarEnabled: boolean
  showResetLabel: boolean
  usageCompact: boolean
  showTools: boolean
  showAgents: boolean
  showTodos: boolean
  showSessionName: boolean
  showClaudeCodeVersion: boolean
  showEffortLevel: boolean
  showMemoryUsage: boolean
  showPromptCache: boolean
  promptCacheTtlSeconds: number
  showSessionTokens: boolean
  showOutputStyle: boolean
  showSessionStartDate: boolean
  showLastResponseAt: boolean
  mergeGroups: HudElement[][]
  autocompactBuffer: AutocompactBufferMode
  contextWarningThreshold: number
  contextCriticalThreshold: number
  usageThreshold: number
  sevenDayThreshold: number
  environmentThreshold: number
  externalUsagePath: string
  externalUsageFreshnessMs: number
  modelFormat: ModelFormatMode
  modelOverride: string
  customLine: string
  timeFormat: TimeFormatMode
}

export interface HudConfig {
  language: Language
  lineLayout: LineLayoutType
  showSeparators: boolean
  pathLevels: 1 | 2 | 3
  maxWidth: number | null
  forceMaxWidth: boolean
  elementOrder: HudElement[]
  gitStatus: HudGitStatusConfig
  display: HudDisplayConfig
  colors: HudColorOverrides
}

export const DEFAULT_ELEMENT_ORDER: HudElement[] = [
  'project',
  'addedDirs',
  'context',
  'usage',
  'promptCache',
  'memory',
  'environment',
  'tools',
  'agents',
  'todos',
  'sessionTime',
]

export const KNOWN_HUD_ELEMENTS: ReadonlySet<HudElement> = new Set(DEFAULT_ELEMENT_ORDER)

export const DEFAULT_MERGE_GROUPS: HudElement[][] = [
  ['context', 'usage'],
]

export const DEFAULT_CONFIG: HudConfig = {
  language: 'en',
  lineLayout: 'expanded',
  showSeparators: false,
  pathLevels: 1,
  maxWidth: null,
  forceMaxWidth: false,
  elementOrder: [...DEFAULT_ELEMENT_ORDER],
  gitStatus: {
    enabled: true,
    showDirty: true,
    showAheadBehind: false,
    showFileStats: false,
    branchOverflow: 'truncate',
    pushWarningThreshold: 0,
    pushCriticalThreshold: 0,
  },
  display: {
    showModel: true,
    showProject: true,
    showAddedDirs: true,
    addedDirsLayout: 'inline',
    showContextBar: true,
    contextValue: 'percent',
    showConfigCounts: false,
    showCost: false,
    showDuration: false,
    showSpeed: false,
    showTokenBreakdown: true,
    showUsage: true,
    usageValue: 'percent',
    usageBarEnabled: true,
    showResetLabel: true,
    usageCompact: false,
    showTools: false,
    showAgents: false,
    showTodos: false,
    showSessionName: false,
    showClaudeCodeVersion: false,
    showEffortLevel: false,
    showMemoryUsage: false,
    showPromptCache: false,
    promptCacheTtlSeconds: 300,
    showSessionTokens: false,
    showOutputStyle: false,
    showSessionStartDate: false,
    showLastResponseAt: false,
    mergeGroups: DEFAULT_MERGE_GROUPS.map(g => [...g]),
    autocompactBuffer: 'enabled',
    contextWarningThreshold: 70,
    contextCriticalThreshold: 85,
    usageThreshold: 0,
    sevenDayThreshold: 80,
    environmentThreshold: 0,
    externalUsagePath: '',
    externalUsageFreshnessMs: 300000,
    modelFormat: 'full',
    modelOverride: '',
    customLine: '',
    timeFormat: 'relative',
  },
  colors: {
    context: 'green',
    usage: 'brightBlue',
    warning: 'yellow',
    usageWarning: 'brightMagenta',
    critical: 'red',
    model: 'cyan',
    project: 'yellow',
    git: 'magenta',
    gitBranch: 'cyan',
    label: 'dim',
    custom: 208,
    barFilled: '█',
    barEmpty: '░',
  },
}
