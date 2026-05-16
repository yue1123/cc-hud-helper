// Browser stub for `node:fs` — wired by vite.config.ts alias.
const NOT_SUPPORTED = () => {
  throw new Error("Node fs API is not available in the browser bundle");
};

export const readFileSync = NOT_SUPPORTED;
export const writeFileSync = NOT_SUPPORTED;
export const existsSync = (): boolean => false;
export const statSync = NOT_SUPPORTED;
export const mkdirSync = NOT_SUPPORTED;
export const readdirSync = (): string[] => [];
export const unlinkSync = NOT_SUPPORTED;
export default {
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
};
