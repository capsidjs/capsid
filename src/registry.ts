interface Initializer {
  (el: HTMLElement, coel?: any): void
  sel: string
}
interface RegistryType {
  [key: string]: Initializer
}

/**
 * The registry of component initializers.
 */
const registry: RegistryType = {}

export default registry
