import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG, DEFAULT_ELEMENT_ORDER, KNOWN_HUD_ELEMENTS } from '@/lib/hud-schema'

describe('hud-schema', () => {
  it('DEFAULT_CONFIG has expected top-level keys', () => {
    expect(Object.keys(DEFAULT_CONFIG).sort()).toEqual([
      'colors',
      'display',
      'elementOrder',
      'forceMaxWidth',
      'gitStatus',
      'language',
      'lineLayout',
      'maxWidth',
      'pathLevels',
      'showSeparators',
    ])
  })

  it('DEFAULT_ELEMENT_ORDER contains all 11 known elements', () => {
    expect(DEFAULT_ELEMENT_ORDER).toHaveLength(11)
    expect(new Set(DEFAULT_ELEMENT_ORDER)).toEqual(KNOWN_HUD_ELEMENTS)
  })

  it('DEFAULT_CONFIG.language is "en"', () => {
    expect(DEFAULT_CONFIG.language).toBe('en')
  })

  it('DEFAULT_CONFIG.lineLayout is "expanded"', () => {
    expect(DEFAULT_CONFIG.lineLayout).toBe('expanded')
  })

  it('DEFAULT_CONFIG.display.contextWarningThreshold is 70', () => {
    expect(DEFAULT_CONFIG.display.contextWarningThreshold).toBe(70)
  })

  it('DEFAULT_CONFIG.display.contextCriticalThreshold is 85', () => {
    expect(DEFAULT_CONFIG.display.contextCriticalThreshold).toBe(85)
  })

  it('DEFAULT_CONFIG.colors.barFilled is "█"', () => {
    expect(DEFAULT_CONFIG.colors.barFilled).toBe('█')
  })
})
