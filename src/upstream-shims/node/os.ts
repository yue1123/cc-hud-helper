export function homedir(): string {
  return '/'
}
export function tmpdir(): string {
  return '/tmp'
}
export function platform(): string {
  return 'browser'
}
export function totalmem(): number {
  return 0
}
export function freemem(): number {
  return 0
}
export const EOL = '\n'
export default { homedir, tmpdir, platform, totalmem, freemem, EOL }
