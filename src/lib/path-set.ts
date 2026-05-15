export type JsonObject = Record<string, unknown>

function isPlainObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function setPath(obj: JsonObject, path: string, value: unknown): JsonObject {
  const parts = path.split('.')
  const root: JsonObject = { ...obj }
  let cur: JsonObject = root
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!
    const next = cur[key]
    const cloned: JsonObject = isPlainObject(next) ? { ...next } : {}
    cur[key] = cloned
    cur = cloned
  }
  cur[parts[parts.length - 1]!] = value
  return root
}

export function deletePath(obj: JsonObject, path: string): JsonObject {
  const parts = path.split('.')
  if (!hasPath(obj, parts)) return obj
  const root: JsonObject = { ...obj }
  const chain: JsonObject[] = [root]
  let cur: JsonObject = root
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!
    const next = cur[key]
    if (!isPlainObject(next)) return obj
    const cloned: JsonObject = { ...next }
    cur[key] = cloned
    chain.push(cloned)
    cur = cloned
  }
  delete cur[parts[parts.length - 1]!]
  for (let i = chain.length - 1; i > 0; i--) {
    if (Object.keys(chain[i]!).length === 0) {
      delete chain[i - 1]![parts[i - 1]!]
    }
  }
  return root
}

function hasPath(obj: JsonObject, parts: string[]): boolean {
  let cur: unknown = obj
  for (const k of parts) {
    if (!isPlainObject(cur) || !(k in cur)) return false
    cur = (cur as JsonObject)[k]
  }
  return true
}

export function getPath(obj: JsonObject, path: string): unknown {
  let cur: unknown = obj
  for (const k of path.split('.')) {
    if (!isPlainObject(cur)) return undefined
    cur = (cur as JsonObject)[k]
  }
  return cur
}
