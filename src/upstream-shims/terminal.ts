// Browser stub for vendor/claude-hud/src/utils/terminal.ts — wired by aliases.config.ts.
// xterm.js uses fixed 120-col width (see HudPreviewXterm.vue); we report that to the
// renderer so its width-aware layout (separators, wraps) matches what the user sees.

export const UNKNOWN_TERMINAL_WIDTH = null

// Match upstream's exact signature: returns `number | null`, options shape matches.
export function getTerminalWidth(
  _options: { preferEnv?: boolean; fallback?: number | null } = {},
): number | null {
  return 120
}

// Wide branch (cols >= 100) → 10.
export function getAdaptiveBarWidth(): number {
  return 10
}
