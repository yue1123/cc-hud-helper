<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DEFAULT_ELEMENT_ORDER, type HudElement } from '@/lib/hud-schema'

const { t } = useI18n()

const props = defineProps<{ modelValue: HudElement[][] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: HudElement[][]): void }>()

const usedElements = computed(() => new Set(props.modelValue.flat()))
const availableElements = computed(() =>
  DEFAULT_ELEMENT_ORDER.filter((e) => !usedElements.value.has(e)),
)

function emitGroups(next: HudElement[][]) {
  emit(
    'update:modelValue',
    next.filter((g) => g.length >= 2),
  )
}

function addGroup() {
  const pool = availableElements.value
  if (pool.length < 2) return
  const next = [...props.modelValue, [pool[0]!, pool[1]!]]
  emit('update:modelValue', next)
}

function removeGroup(idx: number) {
  emitGroups(props.modelValue.filter((_, i) => i !== idx))
}

function removeFromGroup(gIdx: number, elIdx: number) {
  const next = props.modelValue.map((g) => [...g])
  next[gIdx]!.splice(elIdx, 1)
  emitGroups(next)
}

function addToGroup(gIdx: number, el: HudElement) {
  const next = props.modelValue.map((g) => [...g])
  next[gIdx]!.push(el)
  emitGroups(next)
}

function onAddSelect(gIdx: number, e: Event) {
  const sel = e.target as HTMLSelectElement
  if (!sel.value) return
  addToGroup(gIdx, sel.value as HudElement)
  sel.value = ''
}
</script>

<template>
  <div class="merge-group-editor">
    <div v-for="(group, gIdx) in modelValue" :key="gIdx" class="group-row">
      <span class="group-label">[{{ gIdx + 1 }}]</span>
      <span v-for="(el, elIdx) in group" :key="el" class="chip">
        {{ el }}
        <button
          type="button"
          class="x"
          :disabled="group.length <= 2"
          @click="removeFromGroup(gIdx, elIdx)"
        >
          ×
        </button>
      </span>
      <select
        v-if="availableElements.length > 0"
        class="add-select"
        @change="onAddSelect(gIdx, $event)"
      >
        <option value="" disabled selected>{{ t('mergeGroupEditor.addElement') }}</option>
        <option v-for="el in availableElements" :key="el" :value="el">{{ el }}</option>
      </select>
      <span class="group-spacer" />
      <button type="button" class="remove-group" @click="removeGroup(gIdx)">
        {{ t('mergeGroupEditor.deleteGroup') }}
      </button>
    </div>
    <button
      v-if="availableElements.length >= 2"
      type="button"
      class="add-group"
      @click="addGroup"
    >
      {{ t('mergeGroupEditor.addGroup') }}
    </button>
    <p v-else-if="modelValue.length === 0" class="empty">
      {{ t('mergeGroupEditor.empty') }}
    </p>
  </div>
</template>

<style scoped>
.merge-group-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}
.group-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
}
.group-label {
  color: var(--fg-dim);
  font-size: var(--font-size-base);
  margin-right: var(--space-2);
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-base);
  border: 1px solid var(--border-dash);
  padding: 2px 6px;
  border-radius: 2px;
  font-size: var(--font-size-base);
}
.chip .x {
  background: transparent;
  border: none;
  color: var(--fg-dim);
  cursor: pointer;
  padding: 0 2px;
}
.chip .x:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.chip .x:hover:not(:disabled) {
  color: var(--accent-bad);
}
.add-select {
  background: transparent;
  border: 1px dashed var(--border-dash);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 2px 4px;
}
.group-spacer {
  flex: 1;
}
.remove-group {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-size: var(--font-size-base);
  padding: 2px 6px;
  cursor: pointer;
}
.remove-group:hover {
  color: var(--accent-bad);
  border-color: var(--accent-bad);
}
.add-group {
  align-self: flex-start;
  background: transparent;
  border: 1px dashed var(--border-dash);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 4px 10px;
  cursor: pointer;
}
.add-group:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.empty {
  color: var(--fg-dim);
  font-size: var(--font-size-base);
}
</style>
