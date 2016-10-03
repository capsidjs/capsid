import $, {isFunction} from './jquery.js'
import createComponentInitializer from './create-component-initializer.js'
import assert, {assertClassNamesAreStringOrNull} from './assert.js'
import documentReady from './document-ready.js'

/**
 * @property {Object<ClassComponentConfiguration>} ccc
 */
export const ccc = {}

/**
 * Registers the class component configuration for the given name.
 * @param {String} name The name
 * @param {Function} Constructor The constructor of the class component
 */
export function register (name, Constructor) {
  assert(typeof name === 'string', '`name` of a class component has to be a string.')
  assert(isFunction(Constructor), '`Constructor` of a class component has to be a function')

  ccc[name] = createComponentInitializer(name, Constructor)

  documentReady(() => { init(name) })
}

/**
 * Initializes the class components of the given name in the given element.
 * @param {String} classNames The class names
 * @param {?HTMLElement} el The dom where class componets are initialized
 * @return {Array<HTMLElement>} The elements which are initialized in this initialization
 * @throw {Error}
 */
export function init (classNames, el) {
  assertClassNamesAreStringOrNull(classNames)

  ;(classNames && classNames.split(/\s+/) || Object.keys(ccc)).forEach(className => {
    const initializer = ccc[className]
    assert(initializer, 'Class componet "' + className + '" is not defined.')

    ;[].forEach.call((el || document).querySelectorAll(initializer.selector), el => {
      initializer(el)
    })
  })
}
