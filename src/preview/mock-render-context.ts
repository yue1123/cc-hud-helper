import type { HudConfig } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

// ============================================================================
// Inlined upstream types
// ----------------------------------------------------------------------------
// Copied verbatim from vendor/claude-hud/src/types.ts and git.ts.
// We can't `import type` from those modules because tsc would then include
// them in our project graph, and upstream's git.ts triggers ~5 strict-TS
// errors under our `noUncheckedIndexedAccess` setting (string-array indexing).
// Task 12 will introduce a sibling tsconfig.upstream.json with relaxed rules;
// until then, inline the type definitions here.
//
// SYNC: When bumping the vendor/claude-hud submodule, re-check that the
// RenderContext / StdinData / TranscriptData / UsageData / MemoryInfo /
// ToolEntry / AgentEntry / TodoItem / SessionTokenUsage / GitStatus shapes
// below still match upstream verbatim.
// ============================================================================

interface StdinData {
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

interface ToolEntry {
  id: string
  name: string
  target?: string
  status: 'running' | 'completed' | 'error'
  startTime: Date
  endTime?: Date
}

interface AgentEntry {
  id: string
  type: string
  model?: string
  description?: string
  status: 'running' | 'completed'
  startTime: Date
  endTime?: Date
  background?: boolean
}

interface TodoItem {
  content: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface UsageData {
  fiveHour: number | null
  sevenDay: number | null
  fiveHourResetAt: Date | null
  sevenDayResetAt: Date | null
  balanceLabel?: string | null
}

interface MemoryInfo {
  totalBytes: number
  usedBytes: number
  freeBytes: number
  usedPercent: number
}

interface SessionTokenUsage {
  inputTokens: number
  outputTokens: number
  cacheCreationTokens: number
  cacheReadTokens: number
}

interface TranscriptData {
  tools: ToolEntry[]
  skills: string[]
  mcpServers: string[]
  agents: AgentEntry[]
  todos: TodoItem[]
  sessionStart?: Date
  sessionName?: string
  lastAssistantResponseAt?: Date
  sessionTokens?: SessionTokenUsage
  lastCompactBoundaryAt?: Date
  lastCompactPostTokens?: number
  compactionCount?: number
  advisorModel?: string
}

interface LineDiff {
  added: number
  removed: number
}

interface TrackedFile {
  path: string
  status: string
  staged: boolean
}

interface FileStats {
  modified: number
  added: number
  deleted: number
  untracked: number
  files?: TrackedFile[]
}

interface GitStatus {
  branch: string
  isDirty: boolean
  ahead: number
  behind: number
  fileStats?: FileStats
  lineDiff?: LineDiff
  branchUrl?: string
}

export interface RenderContext {
  stdin: StdinData
  transcript: TranscriptData
  claudeMdCount: number
  rulesCount: number
  mcpCount: number
  hooksCount: number
  sessionDuration: string
  gitStatus: GitStatus | null
  usageData: UsageData | null
  memoryUsage: MemoryInfo | null
  config: HudConfig
  extraLabel: string | null
  outputStyle?: string
  claudeCodeVersion?: string
  effortLevel?: string
  effortSymbol?: string
}

// ============================================================================
// Builder
// ============================================================================

/**
 * Build an upstream-compatible RenderContext from MOCK_CONTEXT + the user's
 * HudConfig. The shape must satisfy upstream's `RenderContext` exactly so
 * Task 12's upstream-bridge can hand it to renderAll() without adapter code.
 */
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

  const tools: ToolEntry[] = MOCK_CONTEXT.tools.map((t, i) => ({
    id: `tool-${i}`,
    name: t.name,
    target: t.target,
    status: 'completed' as const,
    startTime: new Date(now - 60_000),
  }))

  const agents: AgentEntry[] = MOCK_CONTEXT.agents.map((a, i) => ({
    id: `agent-${i}`,
    type: a.type,
    status: a.status,
    startTime: new Date(now - 30_000),
  }))

  const transcript: TranscriptData = {
    tools,
    skills: MOCK_CONTEXT.skills,
    mcpServers: MOCK_CONTEXT.mcpServers,
    agents,
    todos: MOCK_CONTEXT.todos,
    sessionStart: new Date(now - 14 * 60_000),
    sessionName: MOCK_CONTEXT.project.sessionName,
    sessionTokens: {
      inputTokens: MOCK_CONTEXT.context.inputTokens,
      outputTokens: MOCK_CONTEXT.context.outputTokens,
      cacheCreationTokens: MOCK_CONTEXT.context.cacheCreationTokens,
      cacheReadTokens: MOCK_CONTEXT.context.cacheReadTokens,
    },
    lastAssistantResponseAt: new Date(now - 12_000),
    lastCompactBoundaryAt: new Date(now - 8 * 60_000),
    compactionCount: MOCK_CONTEXT.session.compactionCount,
    advisorModel: MOCK_CONTEXT.advisorModel,
  }

  const stdin: StdinData = {
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
  }

  const gitStatus: GitStatus = {
    branch: MOCK_CONTEXT.git.branch,
    isDirty: MOCK_CONTEXT.git.dirty,
    ahead: MOCK_CONTEXT.git.ahead,
    behind: MOCK_CONTEXT.git.behind,
  }

  return {
    config,
    stdin,
    transcript,
    claudeMdCount: MOCK_CONTEXT.environment.claudeMdCount,
    rulesCount: MOCK_CONTEXT.environment.rulesCount,
    mcpCount: MOCK_CONTEXT.environment.mcpCount,
    hooksCount: MOCK_CONTEXT.environment.hooksCount,
    sessionDuration: MOCK_CONTEXT.session.durationLabel,
    gitStatus,
    usageData,
    memoryUsage,
    extraLabel: null,
    outputStyle: MOCK_CONTEXT.outputStyle,
    claudeCodeVersion: MOCK_CONTEXT.claudeCodeVersion,
    // Upstream's entry point (index.ts) only populates effort on the context
    // when showEffortLevel is on — and the model badge renders effort purely
    // on its presence, without re-checking the flag. Mirror that gating here
    // so toggling showEffortLevel actually changes the preview.
    effortLevel: config.display.showEffortLevel ? MOCK_CONTEXT.effort.level : undefined,
    effortSymbol: config.display.showEffortLevel ? MOCK_CONTEXT.effort.symbol : undefined,
  }
}
