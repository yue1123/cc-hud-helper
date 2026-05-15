import { describe, it, expect } from 'vitest'
import { mergeConfig } from '@/lib/merge-config'
import { DEFAULT_CONFIG } from '@/lib/hud-schema'

describe('mergeConfig', () => {
  it('empty input returns DEFAULT_CONFIG', () => {
    expect(mergeConfig({})).toEqual(DEFAULT_CONFIG)
  })

  it('clamps contextWarningThreshold to [0,100]', () => {
    const r = mergeConfig({ display: { contextWarningThreshold: 150 } as never })
    expect(r.display.contextWarningThreshold).toBe(100)
  })

  it('clamps contextWarningThreshold below 0 to 0', () => {
    const r = mergeConfig({ display: { contextWarningThreshold: -5 } as never })
    expect(r.display.contextWarningThreshold).toBe(0)
  })

  it('falls back invalid enum to default', () => {
    const r = mergeConfig({ display: { contextValue: 'gibberish' } as never })
    expect(r.display.contextValue).toBe('percent')
  })

  it('falls back invalid lineLayout', () => {
    const r = mergeConfig({ lineLayout: 'foo' } as never)
    expect(r.lineLayout).toBe('expanded')
  })

  it('falls back invalid pathLevels', () => {
    const r = mergeConfig({ pathLevels: 7 } as never)
    expect(r.pathLevels).toBe(1)
  })

  it('strips unknown elementOrder entries', () => {
    const r = mergeConfig({ elementOrder: ['project', 'foo', 'context'] } as never)
    expect(r.elementOrder).toEqual(['project', 'context'])
  })

  it('removes duplicate elementOrder entries', () => {
    const r = mergeConfig({ elementOrder: ['project', 'context', 'project'] } as never)
    expect(r.elementOrder).toEqual(['project', 'context'])
  })

  it('falls back named color "notAColor" to default', () => {
    const r = mergeConfig({ colors: { model: 'notAColor' } as never })
    expect(r.colors.model).toBe('cyan')
  })

  it('accepts hex color strings', () => {
    const r = mergeConfig({ colors: { model: '#aabbcc' } as never })
    expect(r.colors.model).toBe('#aabbcc')
  })

  it('accepts 256-color index', () => {
    const r = mergeConfig({ colors: { custom: 142 } as never })
    expect(r.colors.custom).toBe(142)
  })

  it('rejects 256-color index out of range', () => {
    const r = mergeConfig({ colors: { custom: 300 } as never })
    expect(r.colors.custom).toBe(208)
  })

  it('deduplicates mergeGroups', () => {
    const r = mergeConfig({ display: { mergeGroups: [['context', 'context', 'usage']] } as never })
    expect(r.display.mergeGroups).toEqual([['context', 'usage']])
  })

  it('drops mergeGroups with < 2 elements', () => {
    const r = mergeConfig({ display: { mergeGroups: [['context']] } as never })
    expect(r.display.mergeGroups).toEqual([['context', 'usage']])
  })

  it('migrates legacy layout: "separators" → compact + showSeparators', () => {
    const r = mergeConfig({ layout: 'separators' } as never)
    expect(r.lineLayout).toBe('compact')
    expect(r.showSeparators).toBe(true)
  })
})
