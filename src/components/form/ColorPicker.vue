<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { HudColorValue, HudColorName } from '@/lib/hud-schema'

const { t } = useI18n()

const NAMED_COLORS: HudColorName[] = [
  'dim',
  'red',
  'green',
  'yellow',
  'magenta',
  'cyan',
  'brightBlue',
  'brightMagenta',
]
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

const props = defineProps<{ modelValue: HudColorValue }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: HudColorValue): void }>()

const mode = computed<'named' | 'index' | 'hex'>(() => {
  if (typeof props.modelValue === 'number') return 'index'
  if (typeof props.modelValue === 'string' && HEX_PATTERN.test(props.modelValue)) return 'hex'
  return 'named'
})

function setMode(target: 'named' | 'index' | 'hex') {
  if (target === mode.value) return
  if (target === 'named') emit('update:modelValue', 'green')
  if (target === 'index') emit('update:modelValue', 208)
  if (target === 'hex') emit('update:modelValue', '#38bdf8')
}

function setNamed(v: HudColorName) {
  emit('update:modelValue', v)
}
function setIndex(e: Event) {
  const n = Number((e.target as HTMLInputElement).value)
  if (Number.isFinite(n)) emit('update:modelValue', Math.max(0, Math.min(255, Math.floor(n))))
}
function setHex(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  emit('update:modelValue', raw)
}
</script>

<template>
  <div class="color-picker">
    <div class="mode-tabs">
      <button
        data-mode="named"
        type="button"
        :class="{ on: mode === 'named' }"
        @click="setMode('named')"
      >
        {{ t('colorPicker.modeNamed') }}
      </button>
      <button
        data-mode="index"
        type="button"
        :class="{ on: mode === 'index' }"
        @click="setMode('index')"
      >
        {{ t('colorPicker.modeIndex') }}
      </button>
      <button
        data-mode="hex"
        type="button"
        :class="{ on: mode === 'hex' }"
        @click="setMode('hex')"
      >
        {{ t('colorPicker.modeHex') }}
      </button>
    </div>
    <div class="mode-body">
      <div v-if="mode === 'named'" class="named-grid">
        <button
          v-for="n in NAMED_COLORS"
          :key="n"
          type="button"
          :class="['swatch', { on: modelValue === n }]"
          :style="{ background: `var(--color-named-${n})` }"
          :title="n"
          @click="setNamed(n)"
        />
      </div>
      <div v-else-if="mode === 'index'" class="index-row">
        <input type="number" min="0" max="255" :value="modelValue" @input="setIndex" />
        <span class="hint">{{ t('colorPicker.indexHint') }}</span>
      </div>
      <div v-else class="hex-row">
        <input type="text" :value="modelValue" @input="setHex" />
        <span class="hint">{{ t('colorPicker.hexHint') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}
.mode-tabs {
  display: flex;
  gap: 2px;
}
.mode-tabs button {
  background: var(--bg-elevated);
  border: 1px solid var(--border-dim);
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  padding: 2px 8px;
  cursor: pointer;
}
.mode-tabs button.on {
  color: var(--accent);
  border-color: var(--accent);
}
.named-grid {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.swatch {
  width: 22px;
  height: 22px;
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  cursor: pointer;
}
.swatch.on {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.index-row,
.hex-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.index-row input,
.hex-row input {
  background: var(--bg-elevated);
  color: var(--fg-base);
  border: 1px solid var(--border-dim);
  border-radius: 2px;
  padding: 4px 8px;
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
}
.hex-row input {
  width: 100px;
}
.hint {
  color: var(--fg-dim);
  font-size: var(--font-size-base);
}
</style>
