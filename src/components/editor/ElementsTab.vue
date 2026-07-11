<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'
import FieldRow from '@/components/form/FieldRow.vue'
import ToggleSwitch from '@/components/form/ToggleSwitch.vue'
import MergeGroupEditor from '@/components/form/MergeGroupEditor.vue'
import type { HudElement } from '@/lib/hud-schema'

const { t } = useI18n()
const store = useConfigStore()
const cfg = computed(() => store.parsedConfig)

type ToggleKey =
  | 'showModel'
  | 'showProvider'
  | 'showAdvisor'
  | 'showProject'
  | 'showAddedDirs'
  | 'showContextBar'
  | 'showTokenBreakdown'
  | 'showUsage'
  | 'usageBarEnabled'
  | 'showResetLabel'
  | 'showTools'
  | 'showSkills'
  | 'showMcp'
  | 'showAgents'
  | 'showTodos'
  | 'showMemoryUsage'
  | 'showPromptCache'
  | 'showSessionName'
  | 'showClaudeCodeVersion'
  | 'showEffortLevel'
  | 'showSessionTokens'
  | 'showOutputStyle'
  | 'showSessionStartDate'
  | 'showLastResponseAt'
  | 'showCompactions'
  | 'showConfigCounts'
  | 'showCost'
  | 'showDuration'
  | 'showSpeed'

const elementToggles: Array<{ path: string; key: ToggleKey }> = [
  { path: 'display.showModel', key: 'showModel' },
  { path: 'display.showProvider', key: 'showProvider' },
  { path: 'display.showAdvisor', key: 'showAdvisor' },
  { path: 'display.showProject', key: 'showProject' },
  { path: 'display.showAddedDirs', key: 'showAddedDirs' },
  { path: 'display.showContextBar', key: 'showContextBar' },
  { path: 'display.showTokenBreakdown', key: 'showTokenBreakdown' },
  { path: 'display.showUsage', key: 'showUsage' },
  { path: 'display.usageBarEnabled', key: 'usageBarEnabled' },
  { path: 'display.showResetLabel', key: 'showResetLabel' },
  { path: 'display.showTools', key: 'showTools' },
  { path: 'display.showSkills', key: 'showSkills' },
  { path: 'display.showMcp', key: 'showMcp' },
  { path: 'display.showAgents', key: 'showAgents' },
  { path: 'display.showTodos', key: 'showTodos' },
  { path: 'display.showMemoryUsage', key: 'showMemoryUsage' },
  { path: 'display.showPromptCache', key: 'showPromptCache' },
  { path: 'display.showSessionName', key: 'showSessionName' },
  { path: 'display.showClaudeCodeVersion', key: 'showClaudeCodeVersion' },
  { path: 'display.showEffortLevel', key: 'showEffortLevel' },
  { path: 'display.showSessionTokens', key: 'showSessionTokens' },
  { path: 'display.showOutputStyle', key: 'showOutputStyle' },
  { path: 'display.showSessionStartDate', key: 'showSessionStartDate' },
  { path: 'display.showLastResponseAt', key: 'showLastResponseAt' },
  { path: 'display.showCompactions', key: 'showCompactions' },
  { path: 'display.showConfigCounts', key: 'showConfigCounts' },
  { path: 'display.showCost', key: 'showCost' },
  { path: 'display.showDuration', key: 'showDuration' },
  { path: 'display.showSpeed', key: 'showSpeed' },
]

function getBool(path: string): boolean {
  const parts = path.split('.')
  let cur: unknown = cfg.value
  for (const k of parts) {
    if (cur && typeof cur === 'object') cur = (cur as Record<string, unknown>)[k]
    else return false
  }
  return Boolean(cur)
}

function setBool(path: string, v: boolean) {
  store.patchField(path, v)
}

function setMergeGroups(v: HudElement[][]) {
  store.patchField('display.mergeGroups', v)
}
</script>

<template>
  <div class="elements-tab">
    <h3 class="section-title">{{ t('elements.sections.visibility') }}</h3>
    <FieldRow
      v-for="toggle in elementToggles"
      :key="toggle.path"
      :label="t(`elements.fields.${toggle.key}.label`)"
      :path="toggle.path"
      :hint="t(`elements.fields.${toggle.key}.hint`)"
    >
      <ToggleSwitch
        :modelValue="getBool(toggle.path)"
        @update:modelValue="setBool(toggle.path, $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('elements.sections.mergeGroups') }}</h3>
    <FieldRow
      :label="t('elements.fields.mergeGroups.label')"
      path="display.mergeGroups"
      :hint="t('elements.fields.mergeGroups.hint')"
    >
      <MergeGroupEditor
        :modelValue="cfg.display.mergeGroups"
        @update:modelValue="setMergeGroups"
      />
    </FieldRow>
  </div>
</template>

<style scoped>
.elements-tab {
  display: flex;
  flex-direction: column;
}
.section-title {
  font-size: var(--font-size-base);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin: var(--space-4) 0 var(--space-2);
}
.section-title:first-child {
  margin-top: 0;
}
</style>
