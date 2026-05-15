import { describe, it, expect } from 'vitest'
import { renderSessionTime } from '@/preview/lines/renderSessionTime'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

describe('renderSessionTime', () => {
  it('returns nothing when neither duration nor last-response is enabled (default)', () => {
    expect(renderSessionTime(DEFAULT_CONFIG, MOCK_CONTEXT)).toHaveLength(0)
  })

  it('shows duration when showDuration=true', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showDuration: true } }
    const [line] = renderSessionTime(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('14m 33s')
  })

  it('shows last response when showLastResponseAt=true', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showLastResponseAt: true } }
    const [line] = renderSessionTime(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('12s')
  })

  it('shows session start when showSessionStartDate=true', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showSessionStartDate: true } }
    const [line] = renderSessionTime(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('14:46')
  })
})
