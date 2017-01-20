// @flow

import check, { checkComponentNameIsValid } from './util/check.js'
import { COELEMENT_DATA_KEY_PREFIX } from './const'

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
export default (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  const coelement = (el: any)[COELEMENT_DATA_KEY_PREFIX + name]

  check(coelement, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coelement
}
