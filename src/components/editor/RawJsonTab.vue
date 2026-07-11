<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'
import type { JsonObject } from '@/lib/path-set'

const { t } = useI18n()
const store = useConfigStore()

const draft = ref(JSON.stringify(store.rawJson, null, 2))
const error = ref<string | null>(null)

watch(
  () => store.rawJson,
  (next) => {
    const newText = JSON.stringify(next, null, 2)
    if (newText !== draft.value) draft.value = newText
  },
  { deep: true },
)

function onInput(e: Event) {
  draft.value = (e.target as HTMLTextAreaElement).value
}

function onBlur() {
  try {
    const parsed = JSON.parse(draft.value || '{}')
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      error.value = t('rawJson.nonObjectError')
      return
    }
    error.value = null
    store.setRawJson(parsed as JsonObject)
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>

<template>
  <div class="raw-json-tab">
    <p class="hint">{{ t('rawJson.hint') }}</p>
    <textarea
      class="json-textarea"
      :class="{ 'has-error': error }"
      spellcheck="false"
      :value="draft"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="error" class="json-error">⚠ {{ error }}</p>
  </div>
</template>

<style scoped>
.raw-json-tab {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.hint {
  color: var(--fg-dim);
  font-size: 16px;
}
.json-textarea {
  background: var(--bg-deep);
  color: var(--fg-bright);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: var(--space-3);
  font-family: var(--font-mono);
  font-size: 16px;
  line-height: 1.55;
  min-height: 320px;
  resize: vertical;
}
.json-textarea:focus {
  outline: none;
  border-color: var(--accent);
}
.json-textarea.has-error {
  border-color: var(--accent-bad);
}
.json-error {
  color: var(--accent-bad);
  font-size: 16px;
}
</style>
