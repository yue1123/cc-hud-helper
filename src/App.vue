<script setup lang="ts">
import { ref, computed } from 'vue'
import HudPreview from '@/preview/HudPreview.vue'
import TabNav from '@/components/shell/TabNav.vue'
import LayoutTab from '@/components/editor/LayoutTab.vue'
import ElementsTab from '@/components/editor/ElementsTab.vue'
import GitTab from '@/components/editor/GitTab.vue'
import { useConfigStore } from '@/stores/config'

const store = useConfigStore()

const tabs = [
  { value: 'layout', label: 'Layout' },
  { value: 'elements', label: 'Elements' },
  { value: 'git', label: 'Git' },
  { value: 'display', label: 'Display' },
  { value: 'thresholds', label: 'Thresholds' },
  { value: 'colors', label: 'Colors' },
  { value: 'rawJson', label: 'Raw JSON' },
]

const activeTab = ref('layout')
const parsedConfig = computed(() => store.parsedConfig)
</script>

<template>
  <div id="app-shell">
    <header class="topbar">
      <span class="logo">▆ claude-hud.cfg</span>
      <span class="topbar-spacer" />
      <span class="topbar-hint">v0.2 — editor</span>
    </header>

    <section class="preview-stage">
      <div class="stage-label">PREVIEW (live)</div>
      <HudPreview :config="parsedConfig" />
    </section>

    <TabNav v-model="activeTab" :tabs="tabs" />

    <main class="editor-stage">
      <LayoutTab v-if="activeTab === 'layout'" />
      <ElementsTab v-else-if="activeTab === 'elements'" />
      <GitTab v-else-if="activeTab === 'git'" />
      <p v-else class="placeholder">"{{ activeTab }}" tab lands later in Plan 02.</p>
    </main>
  </div>
</template>

<style scoped>
.topbar-spacer {
  flex: 1;
}
.topbar-hint {
  color: var(--fg-dim);
  font-size: 11px;
}
.preview-stage {
  position: sticky;
  top: 0;
  background: var(--bg-base);
  padding: var(--space-3) var(--space-4) var(--space-4);
  border-bottom: 1px dashed var(--border-dash);
  z-index: 10;
}
.stage-label {
  color: var(--fg-dim);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}
.editor-stage {
  padding: var(--space-4);
}
.placeholder {
  color: var(--fg-dim);
  font-size: 12px;
}
</style>
