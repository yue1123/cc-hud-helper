import type { HudConfig } from '@/lib/hud-schema'
import type { MockContext } from '@/lib/mock-context'
import type { RenderLine } from '@/preview/types'
import { hudColorToCss } from '@/preview/color-map'

export function renderMemory(cfg: HudConfig, ctx: MockContext): RenderLine[] {
  if (!cfg.display.showMemoryUsage) return []
  const labelColor = hudColorToCss(cfg.colors.label)
  const valueColor = hudColorToCss(cfg.colors.usage)
  return [[
    { text: 'mem ', color: labelColor },
    { text: `${ctx.memory.usedPercent}%`, color: valueColor },
    { text: ` (${ctx.memory.usedGb}/${ctx.memory.totalGb} GB)`, dim: true },
  ]]
}
