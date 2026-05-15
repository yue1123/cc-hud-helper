<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HudPreviewXterm from '@/preview/HudPreviewXterm.vue'
import TabNav from '@/components/shell/TabNav.vue'
import LayoutTab from '@/components/editor/LayoutTab.vue'
import ElementsTab from '@/components/editor/ElementsTab.vue'
import GitTab from '@/components/editor/GitTab.vue'
import DisplayTab from '@/components/editor/DisplayTab.vue'
import ThresholdsTab from '@/components/editor/ThresholdsTab.vue'
import ColorsTab from '@/components/editor/ColorsTab.vue'
import RawJsonTab from '@/components/editor/RawJsonTab.vue'
import PresetMenu from '@/components/io/PresetMenu.vue'
import ImportButton from '@/components/io/ImportButton.vue'
import ExportButton from '@/components/io/ExportButton.vue'
import ShareButton from '@/components/io/ShareButton.vue'
import ValidationBanner from '@/components/shell/ValidationBanner.vue'
import { useConfigStore } from '@/stores/config'

const { t, locale } = useI18n()
const store = useConfigStore()

const tabs = computed(() => [
  { value: 'layout', label: t('tabs.layout') },
  { value: 'elements', label: t('tabs.elements') },
  { value: 'git', label: t('tabs.git') },
  { value: 'display', label: t('tabs.display') },
  { value: 'thresholds', label: t('tabs.thresholds') },
  { value: 'colors', label: t('tabs.colors') },
  { value: 'rawJson', label: t('tabs.rawJson') },
])

const activeTab = ref('layout')
const parsedConfig = computed(() => store.parsedConfig)

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div id="app-shell">
    <header class="topbar">
      <span class="logo">▆ claude-hud.cfg</span>
      <PresetMenu />
      <ImportButton />
      <ExportButton />
      <ShareButton />
      <span class="topbar-spacer" />
      <button class="lang-toggle" type="button" @click="toggleLocale">
        {{ locale.toUpperCase() }}
      </button>
      <span class="topbar-hint">v1.0</span>
    </header>

    <section class="preview-stage">
      <div class="stage-label">PREVIEW (live)</div>
      <HudPreviewXterm :config="parsedConfig" />
    </section>

    <ValidationBanner />
    <TabNav v-model="activeTab" :tabs="tabs" />

    <main class="editor-stage">
      <LayoutTab v-if="activeTab === 'layout'" />
      <ElementsTab v-else-if="activeTab === 'elements'" />
      <GitTab v-else-if="activeTab === 'git'" />
      <DisplayTab v-else-if="activeTab === 'display'" />
      <ThresholdsTab v-else-if="activeTab === 'thresholds'" />
      <ColorsTab v-else-if="activeTab === 'colors'" />
      <RawJsonTab v-else-if="activeTab === 'rawJson'" />
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
  margin-left: var(--space-2);
}
.lang-toggle {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 8px;
  cursor: pointer;
}
.lang-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
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
