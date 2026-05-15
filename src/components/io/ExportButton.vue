<script setup lang="ts">
import { ref } from 'vue'
import { useConfigStore } from '@/stores/config'

const store = useConfigStore()
const toast = ref<string | null>(null)
let toastTimer: number | null = null

function showToast(msg: string) {
  toast.value = msg
  if (toastTimer !== null) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = null
  }, 2000)
}

function download() {
  const blob = new Blob([JSON.stringify(store.rawJson, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'config.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('Downloaded')
}

async function copyToClipboard() {
  const text = JSON.stringify(store.rawJson, null, 2)
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard')
  } catch {
    showToast('Copy failed — see console')
    console.error('Clipboard write failed; JSON is:', text)
  }
}
</script>

<template>
  <div class="export-wrap">
    <button class="topbar-btn" type="button" @click="download">[ export ]</button>
    <button
      class="topbar-btn"
      type="button"
      title="Copy JSON to clipboard"
      @click="copyToClipboard"
    >
      [ copy ]
    </button>
    <span v-if="toast" class="toast">{{ toast }}</span>
  </div>
</template>

<style scoped>
.export-wrap {
  position: relative;
  display: inline-flex;
  gap: 4px;
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
.toast {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 11px;
  padding: 2px 8px;
  white-space: nowrap;
}
</style>
