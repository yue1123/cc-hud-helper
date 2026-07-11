<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  maxLength?: number
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <input
    class="text-input"
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    :maxlength="maxLength"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped>
.text-input {
  background: var(--bg-elevated);
  color: var(--fg-base);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  flex: 1;
  min-width: 0;
}
.text-input:focus {
  outline: none;
  border-color: var(--accent);
}
</style>
