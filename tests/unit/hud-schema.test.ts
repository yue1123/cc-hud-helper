import { describe, it, expect } from 'vitest'
import {
  DEFAULT_CONFIG,
  DEFAULT_ELEMENT_ORDER,
  DEFAULT_MERGE_GROUPS,
  KNOWN_HUD_ELEMENTS,
} from '@/lib/hud-schema'

describe('hud-schema (upstream re-export)', () => {
  it('DEFAULT_CONFIG has expected top-level keys', () => {
    expect(Object.keys(DEFAULT_CONFIG).sort()).toEqual(
      ['language', 'lineLayout', 'showSeparators', 'pathLevels', 'maxWidth',
       'forceMaxWidth', 'elementOrder', 'gitStatus', 'display', 'colors'].sort(),
    )
  })

  it('DEFAULT_ELEMENT_ORDER lists the 13 upstream elements', () => {
    expect(DEFAULT_ELEMENT_ORDER).toHaveLength(13)
    expect([...DEFAULT_ELEMENT_ORDER].sort()).toEqual(
      ['project', 'addedDirs', 'context', 'usage', 'promptCache', 'memory',
       'environment', 'tools', 'skills', 'mcp', 'agents', 'todos', 'sessionTime'].sort(),
    )
  })

  it('KNOWN_HUD_ELEMENTS contains the same set as DEFAULT_ELEMENT_ORDER', () => {
    expect(new Set(DEFAULT_ELEMENT_ORDER)).toEqual(KNOWN_HUD_ELEMENTS)
  })

  it('DEFAULT_MERGE_GROUPS is non-empty', () => {
    expect(DEFAULT_MERGE_GROUPS.length).toBeGreaterThan(0)
  })

  it('DEFAULT_CONFIG.lineLayout is "expanded"', () => {
    expect(DEFAULT_CONFIG.lineLayout).toBe('expanded')
  })
})
