// @flow
/**
 * class-component.js v13.0.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import def from './def.js'
import init from './init.js'
import ccc from './ccc.js'
import plugins from './plugins.js'
import check, { checkComponentNameIsValid } from './util/check.js'
import { COELEMENT_DATA_KEY_PREFIX } from './const'

const cc = def

cc.def = def

cc.init = init

// Expose __ccc__
cc.__ccc__ = ccc

// Expose plugins
cc.plugins = plugins

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 */
cc.el = (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  ccc[name](el)
}

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
cc.co = (name: string, el: HTMLElement) => {
  cc.el(name, el)

  return cc.get(name, el)
}

/**
 * Gets the eoelement instance of the class-component of the given name
 * @param name The class-component name
 * @param el The element
 */
cc.get = (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  const coelement = (el: any)[COELEMENT_DATA_KEY_PREFIX + name]

  check(coelement, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coelement
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = cc
}

export default cc
