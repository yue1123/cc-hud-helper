<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()

function onChange(e: Event) {
  const n = Number((e.target as HTMLInputElement).value)
  if (Number.isFinite(n)) emit('update:modelValue', n)
}
</script>

<template>
  <div class="threshold-slider">
    <input
      type="range"
      :min="min ?? 0"
      :max="max ?? 100"
      :value="modelValue"
      @input="onChange"
    />
    <input
      type="number"
      class="num"
      :min="min ?? 0"
      :max="max ?? 100"
      :value="modelValue"
      @input="onChange"
    />
    <span class="suffix">%</span>
  </div>
</template>

<style scoped>
.threshold-slider {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  min-width: 0;
}
input[type='range'] {
  flex: 1;
  min-width: 80px;
  accent-color: var(--accent);
}
.num {
  width: 64px;
  background: var(--bg-elevated);
  color: var(--fg-base);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 3px 6px;
  font-family: var(--font-mono);
  font-size: 16px;
}
.num:focus {
  outline: none;
  border-color: var(--accent);
}
.suffix {
  color: var(--fg-dim);
  font-size: 16px;
}
</style>
