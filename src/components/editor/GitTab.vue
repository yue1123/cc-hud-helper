<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import FieldRow from '@/components/form/FieldRow.vue'
import ToggleSwitch from '@/components/form/ToggleSwitch.vue'
import SelectInput from '@/components/form/SelectInput.vue'
import NumberInput from '@/components/form/NumberInput.vue'

const store = useConfigStore()
const cfg = computed(() => store.parsedConfig.gitStatus)

function set(path: string, v: unknown) {
  store.patchField(`gitStatus.${path}`, v)
}
</script>

<template>
  <div class="git-tab">
    <FieldRow label="enabled" path="gitStatus.enabled" hint="Master switch for the git line.">
      <ToggleSwitch :modelValue="cfg.enabled" @update:modelValue="set('enabled', $event)" />
    </FieldRow>
    <FieldRow label="showDirty" path="gitStatus.showDirty">
      <ToggleSwitch :modelValue="cfg.showDirty" @update:modelValue="set('showDirty', $event)" />
    </FieldRow>
    <FieldRow label="showAheadBehind" path="gitStatus.showAheadBehind">
      <ToggleSwitch
        :modelValue="cfg.showAheadBehind"
        @update:modelValue="set('showAheadBehind', $event)"
      />
    </FieldRow>
    <FieldRow label="showFileStats" path="gitStatus.showFileStats">
      <ToggleSwitch
        :modelValue="cfg.showFileStats"
        @update:modelValue="set('showFileStats', $event)"
      />
    </FieldRow>
    <FieldRow
      label="branchOverflow"
      path="gitStatus.branchOverflow"
      hint="How to handle very long branch names."
    >
      <SelectInput
        :modelValue="cfg.branchOverflow"
        :options="[
          { value: 'truncate', label: 'truncate' },
          { value: 'wrap', label: 'wrap' },
        ]"
        @update:modelValue="set('branchOverflow', $event)"
      />
    </FieldRow>
    <FieldRow
      label="pushWarningThreshold"
      path="gitStatus.pushWarningThreshold"
      hint="Warn when this many commits are unpushed (0 = off)."
    >
      <NumberInput
        :modelValue="cfg.pushWarningThreshold"
        :min="0"
        @update:modelValue="set('pushWarningThreshold', $event)"
      />
    </FieldRow>
    <FieldRow label="pushCriticalThreshold" path="gitStatus.pushCriticalThreshold">
      <NumberInput
        :modelValue="cfg.pushCriticalThreshold"
        :min="0"
        @update:modelValue="set('pushCriticalThreshold', $event)"
      />
    </FieldRow>
  </div>
</template>

<style scoped>
.git-tab {
  display: flex;
  flex-direction: column;
}
</style>
