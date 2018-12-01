interface Initializer {
  (el: HTMLElement, coelem?: any): void
  sel: string
}
interface cccType {
  [key: string]: Initializer
}

/**
 * The mapping from class-component name to its initializer function.
 */
const ccc: cccType = {}

export default ccc
