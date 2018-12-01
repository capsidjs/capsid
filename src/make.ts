import get from './get'
import init from './init'

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export default (name: string, elm: HTMLElement) => {
  init(name, elm)

  return get(name, elm)
}
