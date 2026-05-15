<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import FieldRow from '@/components/form/FieldRow.vue'
import ToggleSwitch from '@/components/form/ToggleSwitch.vue'
import SelectInput from '@/components/form/SelectInput.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import SortableList from '@/components/form/SortableList.vue'

const store = useConfigStore()
const cfg = computed(() => store.parsedConfig)

function setLineLayout(v: string | number) {
  store.patchField('lineLayout', v)
}
function setShowSeparators(v: boolean) {
  store.patchField('showSeparators', v)
}
function setPathLevels(v: string | number) {
  store.patchField('pathLevels', Number(v))
}
function setMaxWidth(v: number | null) {
  if (v === null) store.clearField('maxWidth')
  else store.patchField('maxWidth', v)
}
function setForceMaxWidth(v: boolean) {
  store.patchField('forceMaxWidth', v)
}
function setElementOrder(v: string[]) {
  store.patchField('elementOrder', v)
}
</script>

<template>
  <div class="layout-tab">
    <FieldRow label="Line layout" path="lineLayout">
      <SelectInput
        :modelValue="cfg.lineLayout"
        :options="[
          { value: 'expanded', label: 'expanded' },
          { value: 'compact', label: 'compact' },
        ]"
        @update:modelValue="setLineLayout"
      />
    </FieldRow>

    <FieldRow
      label="Show separators"
      path="showSeparators"
      hint="Insert a dashed separator line between header and activity lines."
    >
      <ToggleSwitch :modelValue="cfg.showSeparators" @update:modelValue="setShowSeparators" />
    </FieldRow>

    <FieldRow
      label="Path levels"
      path="pathLevels"
      hint="How many path segments to show in the project label."
    >
      <SelectInput
        :modelValue="cfg.pathLevels"
        :options="[
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
        ]"
        @update:modelValue="setPathLevels"
      />
    </FieldRow>

    <FieldRow
      label="Max width"
      path="maxWidth"
      hint="Clamp output width (cells). Leave empty for auto."
    >
      <NumberInput
        :modelValue="cfg.maxWidth"
        :min="0"
        nullable
        placeholder="auto"
        @update:modelValue="setMaxWidth"
      />
    </FieldRow>

    <FieldRow
      label="Force max width"
      path="forceMaxWidth"
      hint="Use the configured maxWidth even when terminal width is wider."
    >
      <ToggleSwitch :modelValue="cfg.forceMaxWidth" @update:modelValue="setForceMaxWidth" />
    </FieldRow>

    <FieldRow
      label="Element order"
      path="elementOrder"
      hint="Drag to reorder. Elements not listed are hidden."
    >
      <SortableList :modelValue="cfg.elementOrder" @update:modelValue="setElementOrder" />
    </FieldRow>
  </div>
</template>

<style scoped>
.layout-tab {
  display: flex;
  flex-direction: column;
}
</style>
