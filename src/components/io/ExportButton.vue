<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/stores/config";
import { CONFIG_PATHS } from "@/lib/constants";

const { t } = useI18n();
const store = useConfigStore();
const open = ref(false);
const toast = ref<string | null>(null);
let toastTimer: number | null = null;

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.value = null;
  }, 2000);
}

function openModal() {
  open.value = true;
}

function closeModal() {
  open.value = false;
}

function download() {
  const blob = new Blob([JSON.stringify(store.rawJson, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "config.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t("toast.downloaded"));
}

async function copyToClipboard() {
  const text = JSON.stringify(store.rawJson, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    showToast(t("toast.jsonCopied"));
  } catch {
    showToast(t("toast.copyFailed"));
    console.error("Clipboard write failed; JSON is:", text);
  }
}

async function copyPath(path: string) {
  try {
    await navigator.clipboard.writeText(path);
    showToast(t("toast.pathCopied"));
  } catch {
    showToast(t("toast.copyFailed"));
    console.error("Clipboard write failed; path is:", path);
  }
}
</script>

<template>
  <span class="export-wrap">
    <button class="topbar-btn" type="button" @click="openModal">
      {{ t("export.buttonLabel") }}
    </button>
    <span v-if="toast" class="toast">{{ toast }}</span>

    <div v-if="open" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3 class="title">{{ t("export.title") }}</h3>
        <p class="hint">{{ t("export.destHint") }}</p>
        <div v-for="p in CONFIG_PATHS" :key="p.os" class="path-block">
          <div class="path-os">{{ p.os }}</div>
          <div class="path-row">
            <code class="path">{{ p.path }}</code>
            <button class="btn-secondary" type="button" @click="copyPath(p.path)">
              {{ t("export.copyPath") }}
            </button>
          </div>
        </div>
        <p class="hint">{{ t("export.effectHint") }}</p>
        <div class="actions">
          <button class="btn-secondary" type="button" @click="closeModal">
            {{ t("export.close") }}
          </button>
          <button class="btn-secondary" type="button" @click="copyToClipboard">
            {{ t("export.copyLabel") }}
          </button>
          <button class="btn-primary" type="button" @click="download">
            {{ t("export.downloadLabel") }}
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<style scoped>
.export-wrap {
  position: relative;
  display: inline-flex;
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
.toast {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: var(--font-size-base);
  padding: 2px 8px;
  white-space: nowrap;
  z-index: 99;
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
.path-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.path-os {
  color: var(--fg-dim);
  font-size: var(--font-size-base);
  letter-spacing: 0.04em;
}
.path-row {
  display: flex;
  gap: var(--space-2);
  align-items: stretch;
}
.path {
  flex: 1;
  min-width: 0;
  background: var(--bg-deep);
  color: var(--fg-bright);
  border: 1px solid var(--border-dim);
  padding: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  overflow-x: auto;
  white-space: nowrap;
  user-select: all;
}
.actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  flex-wrap: wrap;
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
  white-space: nowrap;
}
.btn-secondary:hover {
  color: var(--accent);
  border-color: var(--accent);
}
.btn-primary {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
