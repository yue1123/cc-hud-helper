/**
 * Source of truth: vendor/claude-hud/src/config.ts (submodule pinned at v0.3.0 / b83b445).
 *
 * This file is a thin re-export. Types and DEFAULT_CONFIG come from upstream.
 * Only KNOWN_HUD_ELEMENTS is derived locally because upstream keeps it private.
 *
 * If a future upstream change makes any type unsuitable for form rendering
 * (e.g. introduces a non-JSON-safe shape), add a local override here and
 * document why.
 */
export type {
  LineLayoutType,
  AutocompactBufferMode,
  ContextValueMode,
  UsageValueMode,
  GitBranchOverflowMode,
  ModelFormatMode,
  TimeFormatMode,
  HudElement,
  AddedDirsLayout,
  HudColorName,
  HudColorValue,
  HudColorOverrides,
  HudConfig,
} from '@upstream/config'

// Language lives in upstream's i18n types module; config.ts only imports it.
export type { Language } from '@upstream/i18n/types'

export {
  DEFAULT_ELEMENT_ORDER,
  DEFAULT_MERGE_GROUPS,
  DEFAULT_CONFIG,
} from '@upstream/config'

import { DEFAULT_ELEMENT_ORDER, type HudElement } from '@upstream/config'

export const KNOWN_HUD_ELEMENTS: ReadonlySet<HudElement> = new Set(DEFAULT_ELEMENT_ORDER)
