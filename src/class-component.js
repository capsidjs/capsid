/**
 * class-component.js v10.5.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import {register as cc, init, initAll, ccc} from './class-component-manager.js'
import defineFnCc from './fn.cc.js'
import $ from './jquery.js'
import {reSpaces} from './const.js'

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
    if (typeof classNames !== 'string') {
      initAll(elem)

      return
    }

    return classNames.split(reSpaces).map(className => init(className, elem))
  }

  // Expose __ccc__
  cc.__ccc__ = ccc
}
