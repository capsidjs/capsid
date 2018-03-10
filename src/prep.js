// @flow
import { checkComponentNameIsValid } from './util/check.js'
import doc from './util/document'
import ccc from './ccc.js'

/**
 * Initializes the class components of the given name in the range of the given element.
 * @param name The class name
 * @param el The dom where class componets are initialized
 * @throws when the class name is invalid type.
 */
export default (name?: string, el?: HTMLElement): void => {
  let classNames

  if (!name) {
    classNames = Object.keys(ccc)
  } else {
    checkComponentNameIsValid(name)

    classNames = [name]
  }

  classNames.map(className => {
    ;[].map.call((el || doc).querySelectorAll(ccc[className].sel), ccc[className])
  })
}
