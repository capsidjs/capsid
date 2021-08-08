import get from './get'
import { checkComponentNameIsValid } from './util/check'
import registry from './registry'

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export default <T>(name: string, elm: HTMLElement) => {
  checkComponentNameIsValid(name)

  registry[name](elm)

  return get<T>(name, elm)
}
