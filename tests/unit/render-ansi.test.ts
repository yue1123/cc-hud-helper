import { describe, it, expect } from 'vitest'
import { renderAllAnsi } from '@/preview/render-ansi'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

describe('renderAllAnsi', () => {
  it('produces a non-empty ANSI string for DEFAULT_CONFIG', () => {
    const out = renderAllAnsi(DEFAULT_CONFIG, MOCK_CONTEXT)
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(0)
  })

  it('embeds the project name', () => {
    const out = renderAllAnsi(DEFAULT_CONFIG, MOCK_CONTEXT)
    expect(out).toContain('claude-uhd-cc')
  })

  it('embeds CSI reset for colored spans', () => {
    const out = renderAllAnsi(DEFAULT_CONFIG, MOCK_CONTEXT)
    expect(out).toContain('\x1b[0m')
  })

  it('joins multiple lines with CRLF', () => {
    const out = renderAllAnsi(DEFAULT_CONFIG, MOCK_CONTEXT)
    expect(out).toContain('\r\n')
  })

  it('maps named cyan to ANSI 36', () => {
    const out = renderAllAnsi(DEFAULT_CONFIG, MOCK_CONTEXT)
    // model color defaults to cyan
    expect(out).toContain('\x1b[36m')
  })

  it('emits empty output when elementOrder is empty', () => {
    const cfg = { ...DEFAULT_CONFIG, elementOrder: [] }
    expect(renderAllAnsi(cfg, MOCK_CONTEXT)).toBe('')
  })
})
