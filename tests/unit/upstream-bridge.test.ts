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

  it('honors language=zh by routing through upstream i18n', () => {
    const en = renderToString({ ...DEFAULT_CONFIG, language: 'en' })
    const zh = renderToString({ ...DEFAULT_CONFIG, language: 'zh' })
    // They should differ somewhere in localized text. Don't pin to a specific
    // word in case upstream's locale changes — just assert that switching
    // language produces a different string.
    expect(en).not.toBe(zh)
  })
})
