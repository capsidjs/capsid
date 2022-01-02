interface Initializer {
  // deno-lint-ignore no-explicit-any
  (el: HTMLElement, coel?: any): void;
  sel: string;
}
interface RegistryType {
  [key: string]: Initializer;
}

/**
 * The registry of component initializers.
 */
const registry: RegistryType = {};

export default registry;
