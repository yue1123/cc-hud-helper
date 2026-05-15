import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ImportButton from '@/components/io/ImportButton.vue'
import { useConfigStore } from '@/stores/config'

describe('ImportButton', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders an [ import ] button', () => {
    const w = mount(ImportButton)
    expect(w.text()).toContain('import')
  })

  it('opens a modal when clicked', async () => {
    const w = mount(ImportButton)
    await w.find('button').trigger('click')
    expect(w.find('textarea').exists()).toBe(true)
  })

  it('pasting valid JSON and confirming updates store', async () => {
    const store = useConfigStore()
    const w = mount(ImportButton)
    await w.find('button').trigger('click')
    await w.find('textarea').setValue('{"lineLayout": "compact"}')
    const buttons = w.findAll('button')
    const apply = buttons.find((b) => b.text().toLowerCase().includes('apply'))!
    await apply.trigger('click')
    expect(store.rawJson).toEqual({ lineLayout: 'compact' })
  })

  it('invalid JSON shows error and does not update store', async () => {
    const store = useConfigStore()
    store.setRawJson({ pathLevels: 2 })
    const w = mount(ImportButton)
    await w.find('button').trigger('click')
    await w.find('textarea').setValue('{')
    const apply = w.findAll('button').find((b) => b.text().toLowerCase().includes('apply'))!
    await apply.trigger('click')
    expect(store.rawJson).toEqual({ pathLevels: 2 })
    expect(w.find('.error').exists()).toBe(true)
  })
})
