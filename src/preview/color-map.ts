import type { HudColorValue, HudColorName } from '@/lib/hud-schema'

const NAMED: ReadonlySet<HudColorName> = new Set([
  'dim',
  'red',
  'green',
  'yellow',
  'magenta',
  'cyan',
  'brightBlue',
  'brightMagenta',
])

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

const STD_COLORS_16 = [
  '#000000', '#800000', '#008000', '#808000',
  '#000080', '#800080', '#008080', '#c0c0c0',
  '#808080', '#ff0000', '#00ff00', '#ffff00',
  '#0000ff', '#ff00ff', '#00ffff', '#ffffff',
]

const STEPS_6 = [0x00, 0x5f, 0x87, 0xaf, 0xd7, 0xff]

function index256ToHex(i: number): string | null {
  if (!Number.isInteger(i) || i < 0 || i > 255) return null
  if (i < 16) return STD_COLORS_16[i]
  if (i >= 16 && i <= 231) {
    const n = i - 16
    const r = STEPS_6[Math.floor(n / 36)]
    const g = STEPS_6[Math.floor((n % 36) / 6)]
    const b = STEPS_6[n % 6]
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }
  // 232..255 grayscale
  const v = 8 + (i - 232) * 10
  const h = v.toString(16).padStart(2, '0')
  return `#${h}${h}${h}`
}

export function hudColorToCss(value: HudColorValue): string {
  if (typeof value === 'string' && NAMED.has(value as HudColorName)) {
    return `var(--color-named-${value})`
  }
  if (typeof value === 'string' && HEX_PATTERN.test(value)) {
    return value
  }
  if (typeof value === 'number') {
    const hex = index256ToHex(value)
    if (hex) return hex
  }
  return 'var(--fg-base)'
}
