<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { PRESETS, type Preset } from '@/stores/presets'
import ConfirmDialog from '@/components/io/ConfirmDialog.vue'
import type { JsonObject } from '@/lib/path-set'

const store = useConfigStore()
const open = ref(false)
const pendingPreset = ref<Preset | null>(null)

const hasContent = computed(() => Object.keys(store.rawJson).length > 0)

function selectPreset(p: Preset) {
  open.value = false
  if (hasContent.value) {
    pendingPreset.value = p
  } else {
    apply(p)
  }
}

function apply(p: Preset) {
  store.setRawJson(p.config as JsonObject)
  pendingPreset.value = null
}

function cancel() {
  pendingPreset.value = null
}
</script>

<template>
  <div class="preset-wrap">
    <button class="topbar-btn" type="button" @click="open = !open">[ presets ▾ ]</button>
    <ul v-if="open" class="menu" @mouseleave="open = false">
      <li v-for="p in PRESETS" :key="p.id" class="menu-item" @click="selectPreset(p)">
        <div class="item-label">{{ p.label }}</div>
        <div class="item-desc">{{ p.description }}</div>
      </li>
    </ul>

    <ConfirmDialog
      :open="pendingPreset !== null"
      :title="`Load preset: ${pendingPreset?.label ?? ''}`"
      message="This will replace your current configuration. Unknown fields you have set will be lost."
      confirm-label="Load preset"
      @confirm="pendingPreset && apply(pendingPreset)"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped>
.preset-wrap {
  position: relative;
}
.topbar-btn {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 3px 10px;
  cursor: pointer;
}
.topbar-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  list-style: none;
  margin: 0;
  padding: 4px;
  background: var(--bg-base);
  border: 1px dashed var(--border-dash);
  min-width: 280px;
  z-index: 30;
}
.menu-item {
  padding: 6px 8px;
  cursor: pointer;
  border-bottom: 1px dashed var(--border-dim);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:hover {
  background: var(--bg-elevated);
}
.item-label {
  color: var(--accent);
  font-size: 12px;
}
.item-desc {
  color: var(--fg-dim);
  font-size: 11px;
  margin-top: 2px;
  line-height: 1.4;
}
</style>
