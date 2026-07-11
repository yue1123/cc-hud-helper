<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/stores/config";

const { t } = useI18n();
const store = useConfigStore();
const toast = ref<string | null>(null);
let toastTimer: number | null = null;

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.value = null;
  }, 2000);
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
</script>

<template>
  <div class="export-wrap">
    <button class="topbar-btn" type="button" @click="download">
      {{ t("export.downloadLabel") }}
    </button>
    <button
      class="topbar-btn"
      type="button"
      :title="t('export.copyTooltip')"
      @click="copyToClipboard"
    >
      {{ t("export.copyLabel") }}
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
</style>
