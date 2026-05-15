const NOT_SUPPORTED = () => {
  throw new Error('Node child_process is not available in the browser bundle')
}
export const execSync = NOT_SUPPORTED
export const spawn = NOT_SUPPORTED
export const spawnSync = NOT_SUPPORTED
export default { execSync, spawn, spawnSync }
