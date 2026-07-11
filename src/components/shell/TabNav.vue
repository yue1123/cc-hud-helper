<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: Array<{ value: string; label: string }>
}>()
defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <nav class="tab-nav">
    <button
      v-for="t in tabs"
      :key="t.value"
      type="button"
      class="tab"
      :class="{ on: modelValue === t.value }"
      @click="$emit('update:modelValue', t.value)"
    >
      {{ t.label }}
    </button>
  </nav>
</template>

<style scoped>
.tab-nav {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4) 0;
  border-bottom: 1px dashed var(--border-dash);
}
.tab {
  background: transparent;
  border: none;
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 6px 0;
  margin-bottom: -1px;
  border-bottom: 1px solid transparent;
  cursor: pointer;
}
.tab:hover {
  color: var(--fg-base);
}
.tab.on {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
</style>
