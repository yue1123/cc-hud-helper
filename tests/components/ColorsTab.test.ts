import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ColorsTab from '@/components/editor/ColorsTab.vue'
import { useConfigStore } from '@/stores/config'

describe('ColorsTab', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders each color override label', () => {
    const w = mount(ColorsTab)
    const text = w.text()
    expect(text).toContain('context')
    expect(text).toContain('barFilled')
  })

  it('changing barFilled writes to store', async () => {
    const store = useConfigStore()
    const w = mount(ColorsTab)
    const inputs = w.findAll('input[type="text"]')
    const barInput = inputs.find((i) =>
      i.element.closest('.field-row')?.textContent?.includes('barFilled'),
    )!
    await barInput.setValue('▓')
    expect((store.rawJson.colors as Record<string, unknown> | undefined)?.barFilled).toBe('▓')
  })
})
