import { describe, it, expect } from 'vitest'
import { setPath, deletePath, getPath } from '@/lib/path-set'

describe('path-set', () => {
  it('setPath at root', () => {
    expect(setPath({}, 'a', 1)).toEqual({ a: 1 })
  })

  it('setPath at nested path creates intermediate objects', () => {
    expect(setPath({}, 'a.b.c', 'x')).toEqual({ a: { b: { c: 'x' } } })
  })

  it('setPath preserves siblings', () => {
    const result = setPath({ a: { b: 1, c: 2 } }, 'a.b', 99)
    expect(result).toEqual({ a: { b: 99, c: 2 } })
  })

  it('setPath does not mutate input', () => {
    const input = { a: { b: 1 } }
    setPath(input, 'a.b', 2)
    expect(input).toEqual({ a: { b: 1 } })
  })

  it('deletePath removes the key', () => {
    expect(deletePath({ a: 1, b: 2 }, 'a')).toEqual({ b: 2 })
  })

  it('deletePath at nested path leaves siblings', () => {
    expect(deletePath({ a: { b: 1, c: 2 } }, 'a.b')).toEqual({ a: { c: 2 } })
  })

  it('deletePath cleans empty parent objects', () => {
    expect(deletePath({ a: { b: 1 } }, 'a.b')).toEqual({})
  })

  it('deletePath on non-existent path is a no-op', () => {
    expect(deletePath({ a: 1 }, 'x.y')).toEqual({ a: 1 })
  })

  it('getPath retrieves deep value', () => {
    expect(getPath({ a: { b: { c: 7 } } }, 'a.b.c')).toBe(7)
  })

  it('getPath returns undefined for missing', () => {
    expect(getPath({ a: 1 }, 'x.y')).toBeUndefined()
  })
})
