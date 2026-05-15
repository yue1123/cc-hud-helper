import { describe, it, expect } from 'vitest'
import { renderMemory } from '@/preview/lines/renderMemory'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

describe('renderMemory', () => {
  it('returns nothing when showMemoryUsage=false (default)', () => {
    expect(renderMemory(DEFAULT_CONFIG, MOCK_CONTEXT)).toHaveLength(0)
  })

  it('returns a line when showMemoryUsage=true', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showMemoryUsage: true } }
    const [line] = renderMemory(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('mem')
    expect(text).toContain('31%')
    expect(text).toContain('9.9/32 GB')
  })
})
