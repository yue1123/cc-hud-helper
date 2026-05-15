import type { HudConfig, ModelFormatMode } from '@/lib/hud-schema'
import type { MockContext } from '@/lib/mock-context'
import type { RenderLine } from '@/preview/types'
import { hudColorToCss } from '@/preview/color-map'

function formatModel(displayName: string, mode: ModelFormatMode, override: string): string {
  if (override.trim()) return override.trim()
  if (mode === 'full') return displayName
  // strip (1M context) etc.
  const withoutCtx = displayName.replace(/\s*\([^)]*context[^)]*\)\s*$/i, '').trim()
  if (mode === 'compact') return withoutCtx
  // short: also strip "Claude " prefix
  return withoutCtx.replace(/^Claude\s+/i, '')
}

function truncatePath(cwd: string, levels: 1 | 2 | 3): string {
  const segments = cwd.split('/').filter(Boolean)
  const kept = segments.slice(-levels)
  return kept.join('/')
}

export function renderProject(config: HudConfig, ctx: MockContext): RenderLine[] {
  const { display, colors, pathLevels } = config
  const lines: RenderLine[] = []
  const first: RenderLine = []

  if (display.showModel) {
    const label = formatModel(ctx.model.displayName, display.modelFormat, display.modelOverride)
    first.push({ text: '[', color: hudColorToCss(colors.model) })
    first.push({ text: label, color: hudColorToCss(colors.model) })
    first.push({ text: ']', color: hudColorToCss(colors.model) })
  }

  if (display.showProject) {
    if (first.length > 0) first.push({ text: ' ' })
    const path = truncatePath(ctx.project.cwd, pathLevels)
    first.push({ text: path, color: hudColorToCss(colors.project) })
  }

  if (first.length > 0) lines.push(first)

  if (display.showAddedDirs && ctx.project.addedDirs.length > 0) {
    if (display.addedDirsLayout === 'inline') {
      const target = lines[0] ?? []
      target.push({ text: ' (' + ctx.project.addedDirs.join(', ') + ')', dim: true })
      if (lines.length === 0) lines.push(target)
    } else {
      lines.push([{ text: '+ ' + ctx.project.addedDirs.join(', '), dim: true }])
    }
  }

  return lines
}
