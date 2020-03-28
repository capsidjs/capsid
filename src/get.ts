import check, { checkComponentNameIsValid } from './util/check'
import { COELEMENT_DATA_KEY_PREFIX } from './util/const'

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
export default (name: string, el: Element) => {
  checkComponentNameIsValid(name)

  const coelement = (el as any)[COELEMENT_DATA_KEY_PREFIX + name]

  check(coelement, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coelement
}
