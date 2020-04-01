import check, { checkComponentNameIsValid } from './util/check'
import { COELEMENT_DATA_KEY_PREFIX } from './util/const'

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
export default <T>(name: string, el: Element): T => {
  checkComponentNameIsValid(name)

  const coel = (el as any)[COELEMENT_DATA_KEY_PREFIX + name] as any

  check(coel, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coel
}
