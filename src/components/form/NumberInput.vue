<script setup lang="ts">
const props = defineProps<{
  modelValue: number | null
  min?: number
  max?: number
  step?: number
  nullable?: boolean
  placeholder?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: number | null): void }>()

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    emit('update:modelValue', props.nullable ? null : 0)
    return
  }
  const n = Number(raw)
  if (Number.isFinite(n)) emit('update:modelValue', n)
}
</script>

<template>
  <input
    class="number-input"
    type="number"
    :value="modelValue ?? ''"
    :min="min"
    :max="max"
    :step="step ?? 1"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<style scoped>
.number-input {
  background: var(--bg-elevated);
  color: var(--fg-base);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  width: 90px;
}
.number-input:focus {
  outline: none;
  border-color: var(--accent);
}
</style>
