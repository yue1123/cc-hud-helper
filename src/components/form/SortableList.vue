<script setup lang="ts">
const props = defineProps<{ modelValue: string[]; labels?: Record<string, string> }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

function move(from: number, to: number) {
  if (to < 0 || to >= props.modelValue.length) return
  const next = [...props.modelValue]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed!)
  emit('update:modelValue', next)
}

function onDragStart(e: DragEvent, idx: number) {
  e.dataTransfer?.setData('text/plain', String(idx))
}
function onDrop(e: DragEvent, idx: number) {
  const from = Number(e.dataTransfer?.getData('text/plain'))
  if (Number.isFinite(from) && from !== idx) move(from, idx)
}
function onDragOver(e: DragEvent) {
  e.preventDefault()
}
</script>

<template>
  <ul class="sortable-list">
    <li
      v-for="(item, idx) in modelValue"
      :key="item"
      class="sortable-item"
      draggable="true"
      @dragstart="onDragStart($event, idx)"
      @dragover="onDragOver"
      @drop="onDrop($event, idx)"
    >
      <span class="grip">⋮⋮</span>
      <span class="item-label">{{ labels?.[item] ?? item }}</span>
      <span class="item-spacer" />
      <button
        type="button"
        class="move-up"
        :disabled="idx === 0"
        @click="move(idx, idx - 1)"
      >
        ▲
      </button>
      <button
        type="button"
        class="move-down"
        :disabled="idx === modelValue.length - 1"
        @click="move(idx, idx + 1)"
      >
        ▼
      </button>
    </li>
  </ul>
</template>

<style scoped>
.sortable-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.sortable-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 4px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 16px;
  color: var(--fg-base);
  cursor: grab;
}
.sortable-item:active {
  cursor: grabbing;
}
.grip {
  color: var(--fg-dim);
}
.item-label {
  color: var(--fg-base);
}
.item-spacer {
  flex: 1;
}
.move-up,
.move-down {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-size: 16px;
  width: 22px;
  height: 20px;
  cursor: pointer;
}
.move-up:disabled,
.move-down:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.move-up:hover:not(:disabled),
.move-down:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
