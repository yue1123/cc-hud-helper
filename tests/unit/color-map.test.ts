import { describe, it, expect } from 'vitest'
import { hudColorToCss } from '@/preview/color-map'

describe('color-map', () => {
  it('named: green → CSS variable reference', () => {
    expect(hudColorToCss('green')).toBe('var(--color-named-green)')
  })

  it('named: brightBlue', () => {
    expect(hudColorToCss('brightBlue')).toBe('var(--color-named-brightBlue)')
  })

  it('hex passes through', () => {
    expect(hudColorToCss('#ff8800')).toBe('#ff8800')
  })

  it('256-color index 208 maps to known hex', () => {
    expect(hudColorToCss(208)).toBe('#ff8700')
  })

  it('256-color index 16 (deep black) maps to #000000', () => {
    expect(hudColorToCss(16)).toBe('#000000')
  })

  it('256-color index 231 (off-white) maps to #ffffff', () => {
    expect(hudColorToCss(231)).toBe('#ffffff')
  })

  it('unknown named falls back to fg-base var', () => {
    expect(hudColorToCss('notAColor' as any)).toBe('var(--fg-base)')
  })

  it('out-of-range index falls back', () => {
    expect(hudColorToCss(999 as any)).toBe('var(--fg-base)')
  })
})
