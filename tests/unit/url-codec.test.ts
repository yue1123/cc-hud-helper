import { describe, it, expect } from 'vitest'
import { encodeConfig, decodeConfig } from '@/lib/url-codec'

describe('url-codec', () => {
  it('round-trips an empty object', () => {
    const encoded = encodeConfig({})
    expect(decodeConfig(encoded)).toEqual({})
  })

  it('round-trips a typical config', () => {
    const input = { lineLayout: 'compact', display: { contextValue: 'tokens' } }
    expect(decodeConfig(encodeConfig(input))).toEqual(input)
  })

  it('preserves unknown fields', () => {
    const input = { foo: 'bar', display: { futureField: 42 } }
    expect(decodeConfig(encodeConfig(input))).toEqual(input)
  })

  it('encoded string is URL-safe (no #, ?, &, =)', () => {
    const encoded = encodeConfig({ a: 1, b: 'hello world' })
    expect(encoded).not.toMatch(/[#?&=]/)
  })

  it('decode returns null for empty input', () => {
    expect(decodeConfig('')).toBeNull()
  })

  it('decode returns null for garbage', () => {
    expect(decodeConfig('not-valid-lz-base64')).toBeNull()
  })

  it('decode returns null when decompressed content is not JSON', () => {
    expect(decodeConfig('!!!')).toBeNull()
  })
})
