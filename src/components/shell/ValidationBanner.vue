<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'

const { t } = useI18n()
const store = useConfigStore()

const grouped = computed(() => {
  const by = new Map<string, number>()
  for (const d of store.diagnostics) {
    by.set(d.kind, (by.get(d.kind) ?? 0) + 1)
  }
  return Array.from(by.entries())
})

const unknownFields = computed(() =>
  store.diagnostics.filter((d) => d.kind === 'unknownField').map((d) => d.path),
)

const isEmpty = computed(() => store.diagnostics.length === 0)
</script>

<template>
  <div v-if="!isEmpty" class="validation-banner">
    <div class="banner-summary">
      <span class="icon">⚠</span>
      <span v-for="[kind, count] in grouped" :key="kind" class="kind-pill">
        {{ count }} {{ t(`diagnostics.kinds.${kind}`) }}
      </span>
    </div>
    <div v-if="unknownFields.length > 0" class="unknown-list">
      {{ t('banner.unknownFields') }}
      <code v-for="p in unknownFields" :key="p" class="unknown-path">{{ p }}</code>
    </div>
  </div>
</template>

<style scoped>
.validation-banner {
  background: rgba(252, 211, 77, 0.08);
  border-top: 1px dashed var(--border-dash);
  border-bottom: 1px dashed var(--border-dash);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.banner-summary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--accent-warm);
}
.icon {
  font-size: var(--font-size-base);
}
.kind-pill {
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  padding: 1px 6px;
  color: var(--fg-base);
  font-family: var(--font-mono);
}
.unknown-list {
  color: var(--fg-dim);
}
.unknown-path {
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  padding: 1px 4px;
  margin: 0 2px;
  color: var(--accent-magenta);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
}
</style>
