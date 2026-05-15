import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { HudConfig } from '@/lib/hud-schema'
import { mergeConfig } from '@upstream/config'
import { setPath, deletePath, getPath, type JsonObject } from '@/lib/path-set'
import { encodeConfig, decodeConfig } from '@/lib/url-codec'
import { generateDiagnostics, type Diagnostic } from '@/lib/diagnostics'

const HASH_DEBOUNCE_MS = 500

export const useConfigStore = defineStore('config', () => {
  const rawJson = ref<JsonObject>({})
  const lastHashWrite = ref(0)
  let hashTimer: number | null = null

  const parsedConfig = computed<HudConfig>(() => mergeConfig(rawJson.value))

  const diagnostics = computed<Diagnostic[]>(() =>
    generateDiagnostics(rawJson.value, parsedConfig.value),
  )

  function diagnosticsForPath(path: string): Diagnostic[] {
    return diagnostics.value.filter((d) => d.path === path)
  }

  function patchField(path: string, value: unknown): void {
    rawJson.value = setPath(rawJson.value, path, value)
  }

  function clearField(path: string): void {
    rawJson.value = deletePath(rawJson.value, path)
  }

  function readField(path: string): unknown {
    return getPath(rawJson.value, path)
  }

  function setRawJson(next: JsonObject): void {
    rawJson.value = { ...next }
  }

  function reset(): void {
    rawJson.value = {}
  }

  function loadFromHash(): void {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const decoded = decodeConfig(hash)
    if (decoded) rawJson.value = decoded
  }

  function startHashSync(): void {
    if (typeof window === 'undefined') return
    watch(
      rawJson,
      (next) => {
        if (hashTimer !== null) window.clearTimeout(hashTimer)
        hashTimer = window.setTimeout(() => {
          const isEmpty = Object.keys(next).length === 0
          try {
            if (isEmpty) {
              history.replaceState(null, '', window.location.pathname + window.location.search)
            } else {
              history.replaceState(null, '', '#' + encodeConfig(next))
            }
            lastHashWrite.value = Date.now()
          } catch {
            // ignore — URL sync is best-effort
          }
        }, HASH_DEBOUNCE_MS)
      },
      { deep: true },
    )
  }

  return {
    rawJson,
    parsedConfig,
    diagnostics,
    lastHashWrite,
    patchField,
    clearField,
    readField,
    setRawJson,
    reset,
    loadFromHash,
    startHashSync,
    diagnosticsForPath,
  }
})
