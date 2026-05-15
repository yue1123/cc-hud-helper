import { describe, it, expect } from 'vitest'
import { renderPromptCache } from '@/preview/lines/renderPromptCache'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

describe('renderPromptCache', () => {
  it('returns nothing when showPromptCache is false (default)', () => {
    expect(renderPromptCache(DEFAULT_CONFIG, MOCK_CONTEXT)).toHaveLength(0)
  })

  it('returns a line when showPromptCache is true', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showPromptCache: true } }
    const lines = renderPromptCache(cfg, MOCK_CONTEXT)
    expect(lines).toHaveLength(1)
    const text = lines[0].map(s => s.text).join('')
    expect(text).toContain('cache')
  })

  it('shows the active-until duration when active', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showPromptCache: true } }
    const lines = renderPromptCache(cfg, MOCK_CONTEXT)
    const text = lines[0].map(s => s.text).join('')
    expect(text).toMatch(/\d+s|\d+m/)
  })
})
