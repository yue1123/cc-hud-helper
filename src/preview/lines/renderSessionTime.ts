import type { HudConfig } from '@/lib/hud-schema'
import type { MockContext } from '@/lib/mock-context'
import type { RenderLine, RenderSpan } from '@/preview/types'
import { hudColorToCss } from '@/preview/color-map'

export function renderSessionTime(cfg: HudConfig, ctx: MockContext): RenderLine[] {
  const { showDuration, showLastResponseAt, showSessionStartDate } = cfg.display
  if (!showDuration && !showLastResponseAt && !showSessionStartDate) return []

  const labelColor = hudColorToCss(cfg.colors.label)
  const valueColor = hudColorToCss(cfg.colors.context)
  const parts: RenderSpan[] = []

  if (showDuration) {
    parts.push({ text: 'session ', color: labelColor })
    parts.push({ text: ctx.session.durationLabel, color: valueColor })
  }
  if (showLastResponseAt) {
    if (parts.length > 0) parts.push({ text: ' · ' })
    parts.push({ text: 'last ', color: labelColor })
    parts.push({ text: ctx.session.lastResponseAgoLabel + ' ago', color: valueColor })
  }
  if (showSessionStartDate) {
    if (parts.length > 0) parts.push({ text: ' · ' })
    parts.push({ text: 'started ', color: labelColor })
    parts.push({ text: ctx.session.startedAtLabel, color: valueColor })
  }

  return [parts]
}
