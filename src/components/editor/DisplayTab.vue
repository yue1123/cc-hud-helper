<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'
import FieldRow from '@/components/form/FieldRow.vue'
import SelectInput from '@/components/form/SelectInput.vue'
import NumberInput from '@/components/form/NumberInput.vue'
import TextInput from '@/components/form/TextInput.vue'

const { t } = useI18n()
const store = useConfigStore()
const d = computed(() => store.parsedConfig.display)

function set(path: string, v: unknown) {
  store.patchField(`display.${path}`, v)
}

function setNullable(path: string, v: number | null) {
  if (v === null) store.clearField(`display.${path}`)
  else store.patchField(`display.${path}`, v)
}
</script>

<template>
  <div class="display-tab">
    <h3 class="section-title">{{ t('display.sections.contextDisplay') }}</h3>
    <FieldRow
      :label="t('display.fields.contextValue.label')"
      path="display.contextValue"
      :hint="t('display.fields.contextValue.hint')"
    >
      <SelectInput
        :modelValue="d.contextValue"
        :options="[
          { value: 'percent', label: t('display.options.contextValue.percent') },
          { value: 'tokens', label: t('display.options.contextValue.tokens') },
          { value: 'remaining', label: t('display.options.contextValue.remaining') },
          { value: 'both', label: t('display.options.contextValue.both') },
        ]"
        @update:modelValue="set('contextValue', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.autocompactBuffer.label')"
      path="display.autocompactBuffer"
      :hint="t('display.fields.autocompactBuffer.hint')"
    >
      <SelectInput
        :modelValue="d.autocompactBuffer"
        :options="[
          { value: 'enabled', label: t('display.options.autocompactBuffer.enabled') },
          { value: 'disabled', label: t('display.options.autocompactBuffer.disabled') },
        ]"
        @update:modelValue="set('autocompactBuffer', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.autoCompactWindow.label')"
      path="display.autoCompactWindow"
      :hint="t('display.fields.autoCompactWindow.hint')"
    >
      <NumberInput
        :modelValue="d.autoCompactWindow"
        :min="1"
        nullable
        :placeholder="t('display.placeholders.autoCompactWindow')"
        @update:modelValue="setNullable('autoCompactWindow', $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.usageDisplay') }}</h3>
    <FieldRow
      :label="t('display.fields.usageValue.label')"
      path="display.usageValue"
      :hint="t('display.fields.usageValue.hint')"
    >
      <SelectInput
        :modelValue="d.usageValue"
        :options="[
          { value: 'percent', label: t('display.options.usageValue.percent') },
          { value: 'remaining', label: t('display.options.usageValue.remaining') },
        ]"
        @update:modelValue="set('usageValue', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.usageCompact.label')"
      path="display.usageCompact"
      :hint="t('display.fields.usageCompact.hint')"
    >
      <SelectInput
        :modelValue="d.usageCompact ? 'on' : 'off'"
        :options="[
          { value: 'off', label: t('forms.toggleOff') },
          { value: 'on', label: t('forms.toggleOn') },
        ]"
        @update:modelValue="set('usageCompact', $event === 'on')"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.tools') }}</h3>
    <FieldRow
      :label="t('display.fields.toolNameMaxLength.label')"
      path="display.toolNameMaxLength"
      :hint="t('display.fields.toolNameMaxLength.hint')"
    >
      <NumberInput
        :modelValue="d.toolNameMaxLength"
        :min="0"
        @update:modelValue="set('toolNameMaxLength', $event ?? 0)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.toolsMaxVisible.label')"
      path="display.toolsMaxVisible"
      :hint="t('display.fields.toolsMaxVisible.hint')"
    >
      <NumberInput
        :modelValue="d.toolsMaxVisible"
        :min="0"
        @update:modelValue="set('toolsMaxVisible', $event ?? 0)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.model') }}</h3>
    <FieldRow
      :label="t('display.fields.modelFormat.label')"
      path="display.modelFormat"
      :hint="t('display.fields.modelFormat.hint')"
    >
      <SelectInput
        :modelValue="d.modelFormat"
        :options="[
          { value: 'full', label: t('display.options.modelFormat.full') },
          { value: 'compact', label: t('display.options.modelFormat.compact') },
          { value: 'short', label: t('display.options.modelFormat.short') },
        ]"
        @update:modelValue="set('modelFormat', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.modelOverride.label')"
      path="display.modelOverride"
      :hint="t('display.fields.modelOverride.hint')"
    >
      <TextInput
        :modelValue="d.modelOverride"
        :maxLength="80"
        :placeholder="t('display.placeholders.modelOverride')"
        @update:modelValue="set('modelOverride', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.providerName.label')"
      path="display.providerName"
      :hint="t('display.fields.providerName.hint')"
    >
      <TextInput
        :modelValue="d.providerName"
        :maxLength="40"
        :placeholder="t('display.placeholders.providerName')"
        @update:modelValue="set('providerName', $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.advisor') }}</h3>
    <FieldRow
      :label="t('display.fields.advisorOverride.label')"
      path="display.advisorOverride"
      :hint="t('display.fields.advisorOverride.hint')"
    >
      <TextInput
        :modelValue="d.advisorOverride"
        :maxLength="80"
        @update:modelValue="set('advisorOverride', $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.time') }}</h3>
    <FieldRow
      :label="t('display.fields.timeFormat.label')"
      path="display.timeFormat"
      :hint="t('display.fields.timeFormat.hint')"
    >
      <SelectInput
        :modelValue="d.timeFormat"
        :options="[
          { value: 'relative', label: t('display.options.timeFormat.relative') },
          { value: 'absolute', label: t('display.options.timeFormat.absolute') },
          { value: 'both', label: t('display.options.timeFormat.both') },
          { value: 'elapsed', label: t('display.options.timeFormat.elapsed') },
          { value: 'elapsedAndAbsolute', label: t('display.options.timeFormat.elapsedAndAbsolute') },
        ]"
        @update:modelValue="set('timeFormat', $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.project') }}</h3>
    <FieldRow
      :label="t('display.fields.addedDirsLayout.label')"
      path="display.addedDirsLayout"
      :hint="t('display.fields.addedDirsLayout.hint')"
    >
      <SelectInput
        :modelValue="d.addedDirsLayout"
        :options="[
          { value: 'inline', label: t('display.options.addedDirsLayout.inline') },
          { value: 'line', label: t('display.options.addedDirsLayout.line') },
        ]"
        @update:modelValue="set('addedDirsLayout', $event)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.promptCache') }}</h3>
    <FieldRow
      :label="t('display.fields.promptCacheTtlSeconds.label')"
      path="display.promptCacheTtlSeconds"
      :hint="t('display.fields.promptCacheTtlSeconds.hint')"
    >
      <NumberInput
        :modelValue="d.promptCacheTtlSeconds"
        :min="1"
        @update:modelValue="set('promptCacheTtlSeconds', $event ?? 1)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.externalUsage') }}</h3>
    <FieldRow
      :label="t('display.fields.externalUsagePath.label')"
      path="display.externalUsagePath"
      :hint="t('display.fields.externalUsagePath.hint')"
    >
      <TextInput
        :modelValue="d.externalUsagePath"
        :placeholder="t('display.placeholders.externalUsagePath')"
        @update:modelValue="set('externalUsagePath', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.externalUsageWritePath.label')"
      path="display.externalUsageWritePath"
      :hint="t('display.fields.externalUsageWritePath.hint')"
    >
      <TextInput
        :modelValue="d.externalUsageWritePath"
        :placeholder="t('display.placeholders.externalUsageWritePath')"
        @update:modelValue="set('externalUsageWritePath', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.externalUsageFreshnessMs.label')"
      path="display.externalUsageFreshnessMs"
      :hint="t('display.fields.externalUsageFreshnessMs.hint')"
    >
      <NumberInput
        :modelValue="d.externalUsageFreshnessMs"
        :min="0"
        @update:modelValue="set('externalUsageFreshnessMs', $event ?? 0)"
      />
    </FieldRow>

    <h3 class="section-title">{{ t('display.sections.custom') }}</h3>
    <FieldRow
      :label="t('display.fields.customLine.label')"
      path="display.customLine"
      :hint="t('display.fields.customLine.hint')"
    >
      <TextInput
        :modelValue="d.customLine"
        :maxLength="80"
        placeholder=""
        @update:modelValue="set('customLine', $event)"
      />
    </FieldRow>
    <FieldRow
      :label="t('display.fields.customLinePosition.label')"
      path="display.customLinePosition"
      :hint="t('display.fields.customLinePosition.hint')"
    >
      <SelectInput
        :modelValue="d.customLinePosition"
        :options="[
          { value: 'last', label: t('display.options.customLinePosition.last') },
          { value: 'first', label: t('display.options.customLinePosition.first') },
        ]"
        @update:modelValue="set('customLinePosition', $event)"
      />
    </FieldRow>
  </div>
</template>

<style scoped>
.display-tab {
  display: flex;
  flex-direction: column;
}
.section-title {
  font-size: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-dim);
  margin: var(--space-4) 0 var(--space-2);
}
.section-title:first-child {
  margin-top: 0;
}
</style>
