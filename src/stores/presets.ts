import type { HudConfig } from '@/lib/hud-schema'
import type { JsonObject } from '@/lib/path-set'

export interface Preset {
  id: string
  labelKey: string
  descriptionKey: string
  config: Partial<HudConfig> & JsonObject
}

export const PRESETS: Preset[] = [
  {
    id: 'default',
    labelKey: 'presets.default.label',
    descriptionKey: 'presets.default.description',
    config: {},
  },
  {
    id: 'minimal',
    labelKey: 'presets.minimal.label',
    descriptionKey: 'presets.minimal.description',
    config: {
      elementOrder: ['project', 'context'],
      display: {
        showTokenBreakdown: false,
        showUsage: false,
      } as never,
    },
  },
  {
    id: 'full-featured',
    labelKey: 'presets.fullFeatured.label',
    descriptionKey: 'presets.fullFeatured.description',
    config: {
      showSeparators: true,
      display: {
        showCost: true,
        showDuration: true,
        showSpeed: true,
        showSessionTokens: true,
        showClaudeCodeVersion: true,
        showOutputStyle: true,
        showEffortLevel: true,
        showSessionStartDate: true,
        showLastResponseAt: true,
        showCompactions: true,
        showProvider: true,
        showAdvisor: true,
        showTools: true,
        showSkills: true,
        showMcp: true,
        showAgents: true,
        showTodos: true,
        showMemoryUsage: true,
        showPromptCache: true,
        showConfigCounts: true,
      } as never,
    },
  },
  {
    id: 'cjk',
    labelKey: 'presets.cjk.label',
    descriptionKey: 'presets.cjk.description',
    config: {
      language: 'zh',
      pathLevels: 1,
      lineLayout: 'compact',
      colors: {
        barFilled: '#',
        barEmpty: '-',
      } as never,
    },
  },
  {
    id: 'dev-mode',
    labelKey: 'presets.devMode.label',
    descriptionKey: 'presets.devMode.description',
    config: {
      display: {
        showCost: true,
        showDuration: true,
        showSpeed: true,
        showTokenBreakdown: true,
        showClaudeCodeVersion: true,
        showSessionTokens: true,
      } as never,
    },
  },
  {
    id: 'compact-oneliner',
    labelKey: 'presets.compactOneliner.label',
    descriptionKey: 'presets.compactOneliner.description',
    config: {
      lineLayout: 'compact',
      display: {
        mergeGroups: [['context', 'usage', 'memory']],
      } as never,
    },
  },
]
