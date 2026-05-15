import type { HudConfig } from '@/lib/hud-schema'
import { render } from '@upstream/render/index.js'
import { setLanguage } from '@upstream/i18n/index.js'
import type { RenderContext as UpstreamRenderContext } from '@upstream/types'
import { buildMockRenderContext } from '@/preview/mock-render-context'

export function renderToString(config: HudConfig): string {
  // Upstream's i18n is module-stateful — sync language to the requested one
  // before render so locale-keyed text matches what claude-hud would emit.
  setLanguage(config.language)

  // mock-render-context inlines upstream types verbatim (kept locally so the
  // strict app project doesn't pull vendor sources). They are structurally
  // compatible with upstream's RenderContext at runtime; the cast bridges the
  // nominal-equivalence gap caused by living in two TS projects.
  const ctx = buildMockRenderContext(config) as unknown as UpstreamRenderContext
  const lines: string[] = []
  const original = console.log
  console.log = (...args: unknown[]) => {
    lines.push(args.map((a) => (typeof a === 'string' ? a : String(a))).join(' '))
  }
  try {
    render(ctx)
  } finally {
    console.log = original
  }
  return lines.join('\r\n')
}
