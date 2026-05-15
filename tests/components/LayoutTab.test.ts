import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LayoutTab from '@/components/editor/LayoutTab.vue'
import { useConfigStore } from '@/stores/config'

describe('LayoutTab', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('mounts with current parsed config visible', () => {
    const w = mount(LayoutTab)
    expect(w.text()).toContain('lineLayout')
    expect(w.text()).toContain('pathLevels')
  })

  it('toggling lineLayout writes to store', async () => {
    const store = useConfigStore()
    const w = mount(LayoutTab)
    const select = w.find('select')
    await select.setValue('compact')
    expect(store.rawJson).toEqual({ lineLayout: 'compact' })
  })
})
