import type { HudConfig } from '@/lib/hud-schema'
import type { MockContext } from '@/lib/mock-context'
import type { RenderLine } from '@/preview/types'
import { hudColorToCss } from '@/preview/color-map'

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'expired'
  const totalS = Math.round(ms / 1000)
  if (totalS < 60) return `${totalS}s`
  const m = Math.floor(totalS / 60)
  const s = totalS % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

export function renderPromptCache(cfg: HudConfig, ctx: MockContext): RenderLine[] {
  if (!cfg.display.showPromptCache) return []
  const labelColor = hudColorToCss(cfg.colors.label)
  const valueColor = hudColorToCss(cfg.colors.context)
  return [[
    { text: 'cache ', color: labelColor },
    { text: formatRemaining(ctx.promptCache.activeUntilMs), color: valueColor },
    { text: ` (ttl ${cfg.display.promptCacheTtlSeconds}s)`, dim: true },
  ]]
}
