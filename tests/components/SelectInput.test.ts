import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectInput from '@/components/form/SelectInput.vue'

describe('SelectInput', () => {
  it('renders the options', () => {
    const w = mount(SelectInput, {
      props: {
        modelValue: 'percent',
        options: [
          { value: 'percent', label: 'Percent' },
          { value: 'tokens', label: 'Tokens' },
        ],
      },
    })
    expect(w.findAll('option').map((o) => o.text())).toEqual(['Percent', 'Tokens'])
  })

  it('reflects the selected modelValue', () => {
    const w = mount(SelectInput, {
      props: {
        modelValue: 'tokens',
        options: [
          { value: 'percent', label: 'Percent' },
          { value: 'tokens', label: 'Tokens' },
        ],
      },
    })
    expect((w.find('select').element as HTMLSelectElement).value).toBe('tokens')
  })

  it('emits update:modelValue on change', async () => {
    const w = mount(SelectInput, {
      props: {
        modelValue: 'percent',
        options: [
          { value: 'percent', label: 'Percent' },
          { value: 'tokens', label: 'Tokens' },
        ],
      },
    })
    await w.find('select').setValue('tokens')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['tokens'])
  })
})
