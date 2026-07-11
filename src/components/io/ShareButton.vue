<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useConfigStore } from "@/stores/config";
import { encodeConfig } from "@/lib/url-codec";

const { t } = useI18n();
const store = useConfigStore();
const toast = ref<string | null>(null);
let toastTimer: number | null = null;

function showToast(msg: string) {
  toast.value = msg;
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.value = null;
  }, 2500);
}

async function share() {
  const hash = encodeConfig(store.rawJson);
  const url = `${window.location.origin}${window.location.pathname}#${hash}`;
  const sizeHint = hash.length > 6000 ? " " + t("share.longSuffix", { chars: hash.length }) : "";
  try {
    await navigator.clipboard.writeText(url);
    showToast(t("toast.linkCopied") + sizeHint);
  } catch {
    showToast(t("toast.copyFailed"));
    console.error("Clipboard write failed; URL is:", url);
  }
}
</script>

<template>
  <div class="share-wrap">
    <button class="topbar-btn" type="button" @click="share">
      {{ t("share.buttonLabel") }}
    </button>
    <span v-if="toast" class="toast">{{ toast }}</span>
  </div>
</template>

<style scoped>
.share-wrap {
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
