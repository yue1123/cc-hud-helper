<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '@/stores/config'
import type { JsonObject } from '@/lib/path-set'

const { t } = useI18n()
const store = useConfigStore()

const open = ref(false)
const draft = ref('')
const error = ref<string | null>(null)

function openModal() {
  draft.value = ''
  error.value = null
  open.value = true
}

function closeModal() {
  open.value = false
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 1024 * 1024) {
    error.value = t('import.fileTooLarge')
    return
  }
  draft.value = await file.text()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  if (file.size > 1024 * 1024) {
    error.value = t('import.fileTooLarge')
    return
  }
  file.text().then((text) => {
    draft.value = text
  })
}

function apply() {
  let parsed: unknown
  try {
    parsed = JSON.parse(draft.value || '{}')
  } catch (e) {
    error.value = (e as Error).message
    return
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    error.value = t('import.nonObjectError')
    return
  }
  store.setRawJson(parsed as JsonObject)
  open.value = false
}
</script>

<template>
  <span class="import-wrap">
    <button class="topbar-btn" type="button" @click="openModal">
      {{ t('import.buttonLabel') }}
    </button>

    <div v-if="open" class="modal-backdrop" @click.self="closeModal">
      <div class="modal" @dragover.prevent @drop="onDrop">
        <h3 class="title">{{ t('import.title') }}</h3>
        <p class="hint">{{ t('import.hint') }}</p>
        <input type="file" accept="application/json,.json" @change="onFile" />
        <textarea v-model="draft" spellcheck="false" />
        <p v-if="error" class="error">{{ t('import.errorPrefix') }} {{ error }}</p>
        <div class="actions">
          <button class="btn-secondary" type="button" @click="closeModal">
            {{ t('dialog.cancel') }}
          </button>
          <button class="btn-primary" type="button" @click="apply">
            {{ t('import.apply') }}
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<style scoped>
.import-wrap {
  position: relative;
}
.topbar-btn {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 3px 10px;
  cursor: pointer;
}
.topbar-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 8, 17, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: var(--bg-base);
  border: 1px dashed var(--border-dash);
  padding: var(--space-4);
  width: min(520px, 90vw);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.title {
  margin: 0;
  color: var(--accent);
  font-size: var(--font-size-base);
}
.hint {
  margin: 0;
  color: var(--fg-dim);
  font-size: var(--font-size-base);
}
input[type='file'] {
  color: var(--fg-dim);
  font-size: var(--font-size-base);
}
textarea {
  background: var(--bg-deep);
  color: var(--fg-bright);
  border: 1px solid var(--border-dim);
  padding: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  min-height: 220px;
  resize: vertical;
}
.error {
  color: var(--accent-bad);
  font-size: var(--font-size-base);
  margin: 0;
}
.actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}
.btn-secondary,
.btn-primary {
  background: transparent;
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 4px 12px;
  cursor: pointer;
}
.btn-primary {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
