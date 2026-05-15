<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import FieldRow from '@/components/form/FieldRow.vue'
import ColorPicker from '@/components/form/ColorPicker.vue'
import TextInput from '@/components/form/TextInput.vue'
import type { HudColorOverrides, HudColorValue } from '@/lib/hud-schema'

const store = useConfigStore()
const c = computed(() => store.parsedConfig.colors)

type ColorKey =
  | 'context'
  | 'usage'
  | 'warning'
  | 'usageWarning'
  | 'critical'
  | 'model'
  | 'project'
  | 'git'
  | 'gitBranch'
  | 'label'
  | 'custom'

const colorFields: Array<{ key: ColorKey; label: string; hint?: string }> = [
  { key: 'context', label: 'context', hint: 'Default color for context bar/value.' },
  { key: 'usage', label: 'usage', hint: 'Default color for usage bars.' },
  {
    key: 'warning',
    label: 'warning',
    hint: 'Context warning color (>= contextWarningThreshold).',
  },
  { key: 'usageWarning', label: 'usageWarning', hint: 'Usage warning color.' },
  { key: 'critical', label: 'critical', hint: 'Context critical color.' },
  { key: 'model', label: 'model', hint: 'Color for the [Model] badge.' },
  { key: 'project', label: 'project', hint: 'Color for the project path.' },
  { key: 'git', label: 'git', hint: 'Color for git status text.' },
  { key: 'gitBranch', label: 'gitBranch', hint: 'Color for the branch name.' },
  { key: 'label', label: 'label', hint: 'Color for labels like "ctx", "5h".' },
  { key: 'custom', label: 'custom', hint: 'Color for custom-line elements.' },
]

function setColor(key: string, v: HudColorValue) {
  store.patchField(`colors.${key}`, v)
}
function setChar(key: string, v: string) {
  store.patchField(`colors.${key}`, v)
}
function colorOf(key: ColorKey): HudColorValue {
  return c.value[key] as HudColorOverrides[ColorKey]
}
</script>

<template>
  <div class="colors-tab">
    <FieldRow
      v-for="f in colorFields"
      :key="f.key"
      :label="f.label"
      :path="`colors.${f.key}`"
      :hint="f.hint"
    >
      <ColorPicker
        :modelValue="colorOf(f.key)"
        @update:modelValue="setColor(String(f.key), $event)"
      />
    </FieldRow>

    <FieldRow
      label="barFilled"
      path="colors.barFilled"
      hint="Single character (or grapheme) used for filled bar segments."
    >
      <TextInput
        :modelValue="c.barFilled"
        :maxLength="4"
        placeholder="█"
        @update:modelValue="setChar('barFilled', $event)"
      />
    </FieldRow>
    <FieldRow
      label="barEmpty"
      path="colors.barEmpty"
      hint="Single character used for empty bar segments."
    >
      <TextInput
        :modelValue="c.barEmpty"
        :maxLength="4"
        placeholder="░"
        @update:modelValue="setChar('barEmpty', $event)"
      />
    </FieldRow>
  </div>
</template>

<style scoped>
.colors-tab {
  display: flex;
  flex-direction: column;
}
</style>
