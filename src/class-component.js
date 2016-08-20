/**
 * class-component.js v10.5.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import {register as cc, init, ccc} from './class-component-manager.js'
import defineFnCc from './fn.cc.js'
import $ from './jquery.js'

// Initializes the module object.
if (!$.cc) {
  $.cc = cc

  defineFnCc($)

  /**
   * Initializes the all class components of the given names and returns the array of initialized components.
   *
   * @param {String} classNames
   * @return {Object<HTMLElement[]>}
   */
  cc.init = (classNames, elem) => {
    (typeof classNames === 'string' ? classNames.split(/\s+/) : Object.keys(ccc))
      .forEach(className => {
        init(className, elem)
      })
  }

  // Expose __ccc__
  cc.__ccc__ = ccc
}
