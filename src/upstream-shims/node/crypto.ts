const NOT_SUPPORTED = () => {
  throw new Error('Node crypto API is not available in the browser bundle')
}
export const randomBytes = NOT_SUPPORTED
export const createHash = NOT_SUPPORTED
export default { randomBytes, createHash }
