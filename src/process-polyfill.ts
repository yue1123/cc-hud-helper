// Runtime polyfill for the Node `process` global. Upstream claude-hud's
// renderer touches `process.stdout`, `process.stderr`, `process.stdin`,
// `process.argv`, `process.ppid`, `process.env`, `process.platform`.
//
// Vite's `define` in vite.config.ts substitutes `process.env` and
// `process.platform` at compile time so static minification can DCE branches,
// but the other paths reach runtime — without this polyfill, the browser
// throws `ReferenceError: process is not defined` the first time
// renderToString() runs.
//
// Imported FIRST from main.ts so this evaluates before any upstream module
// is loaded (ESM imports run top-down).

if (typeof globalThis.process === "undefined") {
  // Minimal Node `process` shape sufficient for the renderer's read patterns.
  // Casting through `unknown` because the real NodeJS.Process type pulls in
  // hundreds of fields we have no business polyfilling.
  globalThis.process = {
    env: {},
    platform: "browser",
    stdout: { columns: 120, isTTY: false, write: () => true },
    stderr: { columns: 120, isTTY: false, write: () => true },
    stdin: { isTTY: false },
    argv: [],
    ppid: 0,
  } as unknown as NodeJS.Process;
}
