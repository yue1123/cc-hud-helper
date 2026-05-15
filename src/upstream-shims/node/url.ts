const URLCtor = URL
export function pathToFileURL(p: string): URL {
  const path = p.startsWith('/') ? p : '/' + p
  return new URLCtor('file://' + encodeURI(path))
}
export function fileURLToPath(u: string | URL): string {
  const url = typeof u === 'string' ? new URLCtor(u) : u
  return decodeURI(url.pathname)
}
export { URLCtor as URL }
export default { pathToFileURL, fileURLToPath, URL: URLCtor }
