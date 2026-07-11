<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button type="button" class="toggle" :class="{ on: modelValue }" @click="toggle">
    <span class="dot" />
    <span class="state">{{ modelValue ? t('forms.toggleOn') : t('forms.toggleOff') }}</span>
  </button>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 4px 10px 4px 6px;
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  color: var(--fg-dim);
  cursor: pointer;
}
.toggle:hover {
  border-color: var(--border-dash);
  color: var(--fg-base);
}
.toggle.on {
  color: var(--accent);
  border-color: var(--accent);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--fg-dim);
  display: inline-block;
}
.toggle.on .dot {
  background: var(--accent);
}
.state {
  letter-spacing: 0.05em;
}
</style>
