export const promisify = <T>(fn: T): T => fn
export const inspect = (v: unknown): string => String(v)
export default { promisify, inspect }
