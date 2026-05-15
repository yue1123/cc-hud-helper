import { describe, it, expect } from 'vitest'
import { renderProject } from '@/preview/lines/renderProject'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'

describe('renderProject', () => {
  it('returns one line under default config', () => {
    const lines = renderProject(DEFAULT_CONFIG, MOCK_CONTEXT)
    expect(lines).toHaveLength(1)
  })

  it('first line includes model badge and project name', () => {
    const [line] = renderProject(DEFAULT_CONFIG, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('Opus 4.7')
    expect(text).toContain('claude-uhd-cc')
  })

  it('respects showProject = false (omits project name)', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showProject: false } }
    const [line] = renderProject(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('Opus 4.7')
    expect(text).not.toContain('claude-uhd-cc')
  })

  it('respects showModel = false (omits model badge)', () => {
    const cfg = { ...DEFAULT_CONFIG, display: { ...DEFAULT_CONFIG.display, showModel: false } }
    const [line] = renderProject(cfg, MOCK_CONTEXT)
    const text = line.map(s => s.text).join('')
    expect(text).not.toContain('Opus 4.7')
    expect(text).toContain('claude-uhd-cc')
  })

  it('pathLevels=2 shows two path segments', () => {
    const ctx = { ...MOCK_CONTEXT, project: { ...MOCK_CONTEXT.project, cwd: '/Users/dh/Desktop/code/claude-uhd-cc' } }
    const cfg = { ...DEFAULT_CONFIG, pathLevels: 2 as const }
    const [line] = renderProject(cfg, ctx)
    const text = line.map(s => s.text).join('')
    expect(text).toContain('code/claude-uhd-cc')
  })

  it('addedDirsLayout="line" produces a second line', () => {
    const ctx = { ...MOCK_CONTEXT, project: { ...MOCK_CONTEXT.project, addedDirs: ['/tmp/extra'] } }
    const cfg = {
      ...DEFAULT_CONFIG,
      display: { ...DEFAULT_CONFIG.display, addedDirsLayout: 'line' as const },
    }
    const lines = renderProject(cfg, ctx)
    expect(lines).toHaveLength(2)
    expect(lines[1].map(s => s.text).join('')).toContain('/tmp/extra')
  })
})
