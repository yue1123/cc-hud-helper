<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import type { HudConfig } from '@/lib/hud-schema'
import { MOCK_CONTEXT } from '@/lib/mock-context'
import { renderAllAnsi } from '@/preview/render-ansi'

const props = defineProps<{ config: HudConfig }>()

const host = ref<HTMLDivElement>()
let term: Terminal | null = null
let fit: FitAddon | null = null

function getMonoFont(): string {
  if (typeof window === 'undefined') return 'monospace'
  const computed = getComputedStyle(document.body).fontFamily
  return computed || 'monospace'
}

function redraw() {
  if (!term) return
  term.reset()
  term.write(renderAllAnsi(props.config, MOCK_CONTEXT))
}

onMounted(() => {
  if (!host.value) return
  term = new Terminal({
    cols: 120,
    rows: 12,
    fontFamily: getMonoFont(),
    fontSize: 13,
    lineHeight: 1.4,
    theme: {
      background: '#050811',
      foreground: '#cbd5e1',
      cursor: 'transparent',
      cursorAccent: 'transparent',
      selectionBackground: 'rgba(56, 189, 248, 0.3)',
    },
    cursorBlink: false,
    cursorStyle: 'bar',
    disableStdin: true,
    scrollback: 0,
    convertEol: true,
  })
  fit = new FitAddon()
  term.loadAddon(fit)
  term.open(host.value)
  requestAnimationFrame(() => {
    fit?.fit()
    redraw()
  })

  window.addEventListener('resize', onResize)
})

function onResize() {
  fit?.fit()
  redraw()
}

watch(() => props.config, redraw, { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  term?.dispose()
  term = null
})
</script>

<template>
  <div class="xterm-host-wrapper">
    <div ref="host" class="xterm-host" />
  </div>
</template>

<style scoped>
.xterm-host-wrapper {
  background: var(--bg-deep);
  border: 1px dashed var(--border-dash);
  border-radius: 2px;
  padding: var(--space-2);
}
.xterm-host {
  min-height: 240px;
}
:deep(.xterm) {
  padding: 0;
}
:deep(.xterm-viewport) {
  background: transparent !important;
}
</style>
