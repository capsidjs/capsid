// @flow

import { emit, component, wire } from './decorators.js'
import on from './on-decorator.js'
import def from './def.js'
import init from './init.js'
import ccc from './ccc.js'
import plugins from './plugins.js'
import check, { checkComponentNameIsValid } from './util/check.js'
import { COELEMENT_DATA_KEY_PREFIX } from './const'

export { def, init, ccc as __ccc__, on, emit, wire, component, plugins }

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 */
export const el = (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  ccc[name](el)
}

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export const co = (name: string, elm: HTMLElement) => {
  el(name, elm)

  return get(name, elm)
}

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
export const get = (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  const coelement = (el: any)[COELEMENT_DATA_KEY_PREFIX + name]

  check(coelement, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coelement
}
