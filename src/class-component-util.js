import {ccc, initAt} from './class-component-manager.js'
import {COELEMENT_DATA_KEY_PREFIX} from './const.js'
import assert from './assert.js'

/**
 * Initializes the element if it has registered class component names. Returns the jquery object itself.
 * @param {jQuery} elem The element (jQuery selection)
 * @param {string} [classNames] The class name.
 * @return {jQuery}
 */
export function componentInit (elem, classNames) {
  if (typeof classNames !== 'string') {
    classNames = elem[0].className
  }

  classNames.split(/\s+/).forEach(className => {
    if (ccc[className]) {
      initAt(className, elem)
    }
  })
}

/**
 * Gets the coelement of the given name in the given element.
 * @param {jQuery} elem The elemenet (jQuery selection)
 * @param {String} coelementName The name of the coelement
 * @return {Object}
 */
export function componentGet (elem, coelementName) {
  assert(elem[0], 'coelement "' + coelementName + '" unavailable at empty dom selection')

  const coelement = elem.data(COELEMENT_DATA_KEY_PREFIX + coelementName)

  assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + elem[0].tagName)

  return coelement
}
