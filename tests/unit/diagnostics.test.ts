import { describe, it, expect } from 'vitest'
import { generateDiagnostics } from '@/lib/diagnostics'
import { mergeConfig } from '@upstream/config'

describe('diagnostics', () => {
  it('clean default produces no diagnostics', () => {
    expect(generateDiagnostics({}, mergeConfig({}))).toEqual([])
  })

  it('reports clamped threshold', () => {
    const raw = { display: { contextWarningThreshold: 150 } }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const clamp = diag.find((d) => d.path === 'display.contextWarningThreshold')
    expect(clamp).toBeDefined()
    expect(clamp?.kind).toBe('clamped')
    expect(clamp?.from).toBe(150)
    expect(clamp?.to).toBe(100)
  })

  it('reports invalid enum', () => {
    const raw = { display: { contextValue: 'gibberish' } }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const enumDiag = diag.find((d) => d.path === 'display.contextValue')
    expect(enumDiag?.kind).toBe('unknownEnum')
  })

  it('reports unknown top-level field', () => {
    const raw = { foo: 'bar' }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const unk = diag.find((d) => d.path === 'foo')
    expect(unk?.kind).toBe('unknownField')
  })

  it('reports unknown nested field', () => {
    const raw = { display: { futureField: 42 } }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const unk = diag.find((d) => d.path === 'display.futureField')
    expect(unk?.kind).toBe('unknownField')
  })

  it('reports stripped elementOrder entries', () => {
    const raw = { elementOrder: ['project', 'foo', 'context'] }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const unkEl = diag.find((d) => d.path === 'elementOrder' && d.kind === 'unknownElement')
    expect(unkEl).toBeDefined()
  })

  it('reports invalid color', () => {
    const raw = { colors: { model: 'notAColor' } }
    const parsed = mergeConfig(raw as never)
    const diag = generateDiagnostics(raw, parsed)
    const c = diag.find((d) => d.path === 'colors.model')
    expect(c?.kind).toBe('invalidColor')
  })
})
