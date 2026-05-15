/**
 * Converts our existing RenderLine[] tree into an ANSI string for xterm.js.
 *
 * This is a thin adapter — drift between our hand-port and upstream still
 * exists in the *content* of each line (Plan 04a will replace each line
 * renderer with upstream's). What this layer does is unify the *transport*:
 * everything now flows as ANSI escape sequences, which is the data type
 * xterm.js consumes and which upstream renderers natively produce.
 */
import type { HudConfig } from '@/lib/hud-schema'
import type { MockContext } from '@/lib/mock-context'
import type { RenderLine, RenderSpan } from '@/preview/types'
import { renderAll } from '@/preview/render-line'

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'

const ANSI_BY_NAMED: Record<string, string> = {
  dim: DIM,
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
}

const HEX_PATTERN = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
const CSS_NAMED_PATTERN = /^var\(--color-named-([a-zA-Z]+)\)$/

function cssColorToAnsi(css: string): string {
  const named = CSS_NAMED_PATTERN.exec(css)
  if (named) {
    return ANSI_BY_NAMED[named[1]!] ?? ''
  }
  const hex = HEX_PATTERN.exec(css)
  if (hex) {
    const r = parseInt(hex[1]!, 16)
    const g = parseInt(hex[2]!, 16)
    const b = parseInt(hex[3]!, 16)
    return `\x1b[38;2;${r};${g};${b}m`
  }
  // var(--fg-base) and unknown → no color (terminal default)
  return ''
}

function spanToAnsi(span: RenderSpan): string {
  let prefix = ''
  if (span.dim) prefix += DIM
  if (span.bold) prefix += BOLD
  if (span.color) prefix += cssColorToAnsi(span.color)
  if (!prefix) return span.text
  return `${prefix}${span.text}${RESET}`
}

function lineToAnsi(line: RenderLine): string {
  return line.map(spanToAnsi).join('')
}

export function renderAllAnsi(cfg: HudConfig, ctx: MockContext): string {
  const lines = renderAll(cfg, ctx)
  return lines.map(lineToAnsi).join('\r\n')
}
