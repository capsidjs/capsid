// @flow
import createComponentInitializer from './create-component-initializer.js'
import check, { checkClassNamesAreStringOrNull } from './assert.js'
import documentReady from './document-ready.js'

type Initializer = { (el: HTMLElement, coelem: any): void; selector: string }
type cccType = { [key: string]: Initializer }

/**
 * The mapping from class-component name to its initializer function.
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
 * @param classNames The class names
 * @param el The dom where class componets are initialized
 * @throws when the class name is invalid type.
 */
export function init (classNames: string, el: ?HTMLElement) {
  checkClassNamesAreStringOrNull(classNames)

  ;(classNames ? classNames.split(/\s+/) : Object.keys(ccc)).map(className => {
    const initializer = ccc[className]

    check(!!initializer, `Class componet ${className} is not defined.`)

    ;[].map.call((el || document).querySelectorAll(initializer.selector), initializer)
  })
}
