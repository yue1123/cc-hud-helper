import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleSwitch from '@/components/form/ToggleSwitch.vue'

describe('ToggleSwitch', () => {
  it('renders "on" when modelValue=true', () => {
    const w = mount(ToggleSwitch, { props: { modelValue: true } })
    expect(w.text()).toContain('on')
  })

  it('renders "off" when modelValue=false', () => {
    const w = mount(ToggleSwitch, { props: { modelValue: false } })
    expect(w.text()).toContain('off')
  })

  it('emits update:modelValue on click', async () => {
    const w = mount(ToggleSwitch, { props: { modelValue: false } })
    await w.find('button').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})
