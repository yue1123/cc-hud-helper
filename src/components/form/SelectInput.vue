<script setup lang="ts">
defineProps<{
  modelValue: string | number
  options: Array<{ value: string | number; label: string }>
}>()
defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
</script>

<template>
  <select
    class="select"
    :value="modelValue"
    @change="
      $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
    "
  >
    <option v-for="o in options" :key="String(o.value)" :value="o.value">
      {{ o.label }}
    </option>
  </select>
</template>

<style scoped>
.select {
  background: var(--bg-elevated);
  color: var(--fg-base);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: 12px;
}
.select:focus {
  outline: none;
  border-color: var(--accent);
}
</style>
