import { describe, it, expect } from 'vitest'
import { renderToString } from '@/preview/upstream-bridge'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'

describe('renderToString', () => {
  it('produces a non-empty string for DEFAULT_CONFIG', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  it('contains the project segment', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('claude-uhd-cc')
  })

  it('uses CRLF line endings (for xterm consumption)', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('\r\n')
  })

  it('emits ANSI reset escapes', () => {
    const out = renderToString(DEFAULT_CONFIG)
    expect(out).toContain('\x1b[0m')
  })

  it('restores console.log after running', () => {
    const original = console.log
    renderToString(DEFAULT_CONFIG)
    expect(console.log).toBe(original)
  })

  it('restores console.log even if upstream throws', () => {
    const original = console.log
    try {
      renderToString({ ...DEFAULT_CONFIG, lineLayout: 'expanded' })
    } catch {
      // ignore
    }
    expect(console.log).toBe(original)
  })

  // Regression: the mock bridge builds RenderContext directly, bypassing
  // upstream's index.ts which only injects effort when showEffortLevel is on.
  // The model badge renders effort purely on its presence, so the bridge must
  // replicate that gating — otherwise the toggle looks dead in the preview.
  it('gates the effort badge on showEffortLevel', () => {
    const off = renderToString({ ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showEffortLevel: false } })
    const on = renderToString({ ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showEffortLevel: true } })
    expect(off).not.toContain('◆')
    expect(on).toContain('◆')
  })

  // Regression: these toggles were dead in the preview until the mock context
  // carried skills / mcpServers / compactionCount / advisorModel data.
  it('renders opt-in elements once their mock data is present', () => {
    const cfg = (extra: Record<string, unknown>) => ({
      ...DEFAULT_CONFIG,
      display: { ...DEFAULT_CONFIG.display, ...extra },
    })
    expect(renderToString(cfg({ showSkills: true }))).toContain('Skills')
    expect(renderToString(cfg({ showMcp: true }))).toContain('MCPs')
    expect(renderToString(cfg({ showCompactions: true }))).toContain('Compactions')
    expect(renderToString(cfg({ showAdvisor: true }))).toContain('Advisor')
  })

  it('honors language=zh by routing through upstream i18n', () => {
    const en = renderToString({ ...DEFAULT_CONFIG, language: 'en' })
    const zh = renderToString({ ...DEFAULT_CONFIG, language: 'zh' })
    // They should differ somewhere in localized text. Don't pin to a specific
    // word in case upstream's locale changes — just assert that switching
    // language produces a different string.
    expect(en).not.toBe(zh)
  })

  // Regression net for silent upstream renderer drift.
  // If upstream's render() output for DEFAULT_CONFIG changes, the snapshot
  // diff will surface it in PR review. Update the snapshot intentionally
  // (via `pnpm test:run -u` or `vitest -u`) when the change is desired,
  // e.g. after a deliberate submodule bump.
  it('renders DEFAULT_CONFIG identically to the captured snapshot', () => {
    expect(renderToString(DEFAULT_CONFIG)).toMatchSnapshot()
  })
})
