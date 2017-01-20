// @flow

import get from './get.js'
import el from './el.js'

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export default (name: string, elm: HTMLElement) => {
  el(name, elm)

  return get(name, elm)
}
