import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from '@/stores/config'

describe('useConfigStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty rawJson and parsedConfig = defaults', () => {
    const store = useConfigStore()
    expect(store.rawJson).toEqual({})
    expect(store.parsedConfig.lineLayout).toBe('expanded')
  })

  it('patchField writes into rawJson', () => {
    const store = useConfigStore()
    store.patchField('display.contextValue', 'tokens')
    expect(store.rawJson).toEqual({ display: { contextValue: 'tokens' } })
  })

  it('patchField updates parsedConfig reactively', () => {
    const store = useConfigStore()
    store.patchField('lineLayout', 'compact')
    expect(store.parsedConfig.lineLayout).toBe('compact')
  })

  it('clearField removes the key from rawJson', () => {
    const store = useConfigStore()
    store.patchField('lineLayout', 'compact')
    store.clearField('lineLayout')
    expect(store.rawJson).toEqual({})
  })

  it('setRawJson replaces the entire raw tree', () => {
    const store = useConfigStore()
    store.setRawJson({ pathLevels: 3, foo: 'unknown' })
    expect(store.rawJson.pathLevels).toBe(3)
    expect(store.rawJson.foo).toBe('unknown')
  })

  it('unknown fields survive round-trip (rawJson preserved)', () => {
    const store = useConfigStore()
    store.setRawJson({ display: { contextValue: 'tokens', futureField: 42 } })
    expect((store.rawJson.display as Record<string, unknown>).futureField).toBe(42)
    expect(store.parsedConfig.display.contextValue).toBe('tokens')
  })

  it('reset wipes rawJson back to {}', () => {
    const store = useConfigStore()
    store.setRawJson({ pathLevels: 3 })
    store.reset()
    expect(store.rawJson).toEqual({})
  })

  it('patching with the default value still writes (caller responsibility to clear)', () => {
    const store = useConfigStore()
    store.patchField('lineLayout', 'expanded')
    expect(store.rawJson).toEqual({ lineLayout: 'expanded' })
  })

  it('exposes diagnostics for invalid values', () => {
    const store = useConfigStore()
    store.patchField('display.contextWarningThreshold', 150)
    expect(
      store.diagnostics.some((d) => d.path === 'display.contextWarningThreshold'),
    ).toBe(true)
  })

  it('diagnosticsForPath filters', () => {
    const store = useConfigStore()
    store.patchField('display.contextValue', 'gibberish')
    const list = store.diagnosticsForPath('display.contextValue')
    expect(list).toHaveLength(1)
    expect(list[0]!.kind).toBe('unknownEnum')
  })
})
