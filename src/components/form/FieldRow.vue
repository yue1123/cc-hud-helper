<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'
import type { Diagnostic } from '@/lib/diagnostics'

const props = defineProps<{
  label: string
  hint?: string
  path?: string
}>()

const { t } = useI18n()
const store = useConfigStore()
const diagnostics = computed(() =>
  props.path ? store.diagnosticsForPath(props.path) : [],
)

function formatDiagnostic(d: Diagnostic): string {
  switch (d.kind) {
    case 'clamped':
      // All current CLAMPED_PATHS use max=100; can be extended via d.to vs d.from later.
      return t('diagnostics.messages.clamped', { max: 100 })
    case 'unknownElement': {
      const items = Array.isArray(d.from) ? (d.from as unknown[]).join(', ') : String(d.from ?? '')
      return t('diagnostics.messages.unknownElement', { items })
    }
    case 'unknownEnum':
      return t('diagnostics.messages.unknownEnum')
    case 'invalidColor':
      return t('diagnostics.messages.invalidColor')
    case 'unknownField':
      return t('diagnostics.messages.unknownField')
    case 'duplicateInGroup':
      return t('diagnostics.messages.duplicateInGroup')
    default:
      return d.message
  }
}
</script>

<template>
  <div class="field-row" :class="{ 'has-diag': diagnostics.length > 0 }">
    <div class="field-label">
      <span class="label-text">{{ label }}</span>
      <span v-if="path" class="label-path">{{ path }}</span>
    </div>
    <div class="field-control">
      <slot />
    </div>
    <div v-if="hint || $slots.hint || diagnostics.length > 0" class="field-hint">
      <slot name="hint">{{ hint }}</slot>
      <p v-for="d in diagnostics" :key="d.kind" class="diag" :class="`diag-${d.severity}`">
        ⚠ {{ formatDiagnostic(d)
        }}<span v-if="d.from !== undefined">
          ({{ t('diagnostics.wasPrefix') }} {{ JSON.stringify(d.from) }})</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.field-row {
  display: grid;
  grid-template-columns: minmax(180px, 240px) 1fr;
  grid-template-rows: auto auto;
  gap: var(--space-1) var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px dashed var(--border-dim);
}
.field-row.has-diag {
  background: rgba(252, 211, 77, 0.04);
}
.field-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
}
.label-text {
  color: var(--fg-base);
  font-size: 16px;
}
.label-path {
  color: var(--fg-dim);
  font-size: 16px;
  font-family: var(--font-mono);
}
.field-control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 28px;
}
.field-hint {
  grid-column: 2 / -1;
  color: var(--fg-dim);
  font-size: 16px;
  line-height: 1.4;
}
.diag {
  margin: 2px 0 0;
}
.diag-warn {
  color: var(--accent-warm);
}
.diag-info {
  color: var(--fg-dim);
}
.diag-error {
  color: var(--accent-bad);
}
</style>
