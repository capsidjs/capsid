// @flow
import createComponentInitializer from './create-component-initializer.js'
import check, {checkClassNamesAreStringOrNull} from './assert.js'
import documentReady from './document-ready.js'

type Initializer = {(el: HTMLElement, coelem: any): void; selector: string}
type cccType = {[key: string]: Initializer}

/**
 * @property {Object<Function>} ccc
 */
export const ccc: cccType = {}

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
export const register: any = (name: string, Constructor: Function): Function => {
  check(typeof name === 'string', '`name` of a class component has to be a string.')
  check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function')

  Constructor.__cc = name

  ccc[name] = createComponentInitializer(name, Constructor)

  documentReady(() => { init(name) })

  return Constructor
}

/**
 * Initializes the class components of the given name in the given element.
 * @param {string} classNames The class names
 * @param {?HTMLElement} el The dom where class componets are initialized
 * @return {Array<HTMLElement>} The elements which are initialized in this initialization
 * @throw {Error}
 */
export function init (classNames: string, el: ?HTMLElement) {
  checkClassNamesAreStringOrNull(classNames)

  ;(classNames ? classNames.split(/\s+/) : Object.keys(ccc)).forEach(className => {
    const initializer = ccc[className]
    check(initializer != null, 'Class componet "' + className + '" is not defined.')

    ;[].forEach.call((el || document).querySelectorAll(initializer.selector), el => {
      initializer(el)
    })
  })
}
