import LZString from 'lz-string'
import type { JsonObject } from '@/lib/path-set'

export function encodeConfig(rawJson: JsonObject): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(rawJson))
}

export function decodeConfig(encoded: string): JsonObject | null {
  if (!encoded) return null
  let decompressed: string | null
  try {
    decompressed = LZString.decompressFromEncodedURIComponent(encoded)
  } catch {
    return null
  }
  if (decompressed === null) return null
  try {
    const parsed = JSON.parse(decompressed)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null
    return parsed as JsonObject
  } catch {
    return null
  }
}
