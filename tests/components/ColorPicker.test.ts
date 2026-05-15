import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '@/components/form/ColorPicker.vue'

describe('ColorPicker', () => {
  it('shows named mode tab as active when modelValue is named', () => {
    const w = mount(ColorPicker, { props: { modelValue: 'green' } })
    expect(w.find('[data-mode="named"]').classes()).toContain('on')
  })

  it('shows 256 mode tab as active when modelValue is a number', () => {
    const w = mount(ColorPicker, { props: { modelValue: 142 } })
    expect(w.find('[data-mode="index"]').classes()).toContain('on')
  })

  it('shows hex mode tab as active when modelValue is hex', () => {
    const w = mount(ColorPicker, { props: { modelValue: '#aabbcc' } })
    expect(w.find('[data-mode="hex"]').classes()).toContain('on')
  })

  it('switching modes emits a sensible default for the new mode', async () => {
    const w = mount(ColorPicker, { props: { modelValue: 'green' } })
    await w.find('[data-mode="hex"]').trigger('click')
    const evt = w.emitted('update:modelValue')
    expect(evt).toBeTruthy()
    const value = evt![0]![0] as string
    expect(typeof value).toBe('string')
    expect(value.startsWith('#')).toBe(true)
  })

  it('changing the hex input emits the new hex', async () => {
    const w = mount(ColorPicker, { props: { modelValue: '#aabbcc' } })
    await w.find('input[type="text"]').setValue('#ff8800')
    expect(w.emitted('update:modelValue')?.pop()).toEqual(['#ff8800'])
  })
})
