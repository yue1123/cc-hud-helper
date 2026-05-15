const NOT_SUPPORTED = () => {
  throw new Error('Node readline is not available in the browser bundle')
}
export const createInterface = NOT_SUPPORTED
export default { createInterface }
