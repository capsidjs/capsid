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
import check, { checkClassNamesAreStringOrNull, checkComponentNameIsValid } from './util/check.js'
import $ from './util/jquery.js'
import { COELEMENT_DATA_KEY_PREFIX } from './const'

const cc = def

cc.def = def

cc.init = init

// Expose __ccc__
cc.__ccc__ = ccc

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
const get = cc.get = (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name)

  const coelement = (el: any)[COELEMENT_DATA_KEY_PREFIX + name]

  check(coelement, `no coelement named: ${name}, on the dom: ${el.tagName}`)

  return coelement
}

// Initializes the jquery things.
if (!$.cc) {
  $.cc = cc

  const descriptor: any = { get () {
    const $el = this
    const dom: HTMLElement = $el[0]

    check(dom != null, 'cc (class-component context) is unavailable at empty dom selection')

    let cc = (dom: any).cc

    if (!cc) {
      /**
       * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
       * @param {?string} classNames The class component names
       * @return {jQuery}
       */
      cc = (dom: any).cc = (classNames: ?string) => {
        checkClassNamesAreStringOrNull(classNames)

        ;(classNames || dom.className).split(/\s+/).map(className => {
          if (ccc[className]) {
            ccc[className]($el.addClass(className)[0])
          }
        })

        return $el
      }

      /**
       * Gets the coelement of the given name.
       * @param {string} name The name of the coelement
       * @return {Object}
       */
      cc.get = (name: string) => get(name, dom)

      cc.init = (className: string) => cc(className).cc.get(className)
    }

    return cc
  } }

  // Defines the special property cc on the jquery prototype.
  Object.defineProperty($.fn, 'cc', descriptor)
}
