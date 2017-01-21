// @flow
import check, { checkClassNamesAreStringOrNull } from './util/check.js'
import doc from './util/document'
import ccc from './ccc.js'

/**
 * Initializes the class components of the given name in the given element.
 * @param classNames The class names
 * @param el The dom where class componets are initialized
 * @throws when the class name is invalid type.
 */
const init = (classNames: string, el: ?HTMLElement): void => {
  checkClassNamesAreStringOrNull(classNames)

  ;(classNames ? classNames.split(/\s+/) : Object.keys(ccc)).map(className => {
    const initializer = ccc[className]

    check(!!initializer, `Class componet ${className} is not defined.`)

    ;[].map.call((el || doc).querySelectorAll(initializer.selector), initializer)
  })
}

export default init
