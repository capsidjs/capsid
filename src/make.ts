import get from './get'
import { checkComponentNameIsValid } from './util/check'
import ccc from './ccc'

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export default (name: string, elm: HTMLElement) => {
  checkComponentNameIsValid(name)

  ccc[name](elm)

  return get(name, elm)
}
