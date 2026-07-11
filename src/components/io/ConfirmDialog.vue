<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
}>()
defineEmits<{ (e: 'confirm'): void; (e: 'cancel'): void }>()
</script>

<template>
  <div v-if="open" class="dialog-backdrop" @click.self="$emit('cancel')">
    <div class="dialog">
      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
      <div class="dialog-actions">
        <button class="btn-secondary" type="button" @click="$emit('cancel')">
          {{ t('dialog.cancel') }}
        </button>
        <button class="btn-primary" type="button" @click="$emit('confirm')">
          {{ confirmLabel ?? t('dialog.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 17, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.dialog {
  background: var(--bg-base);
  border: 1px dashed var(--border-dash);
  padding: var(--space-4);
  max-width: 420px;
  font-family: var(--font-mono);
}
.dialog-title {
  margin: 0 0 var(--space-2);
  color: var(--accent);
  font-size: var(--font-size-base);
}
.dialog-message {
  margin: 0 0 var(--space-4);
  color: var(--fg-base);
  font-size: var(--font-size-base);
  line-height: 1.55;
}
.dialog-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}
.btn-secondary,
.btn-primary {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 4px 12px;
  cursor: pointer;
}
.btn-primary {
  color: var(--accent);
  border-color: var(--accent);
}
.btn-secondary:hover {
  color: var(--fg-base);
}
.btn-primary:hover {
  background: var(--accent);
  color: var(--bg-base);
}
</style>
