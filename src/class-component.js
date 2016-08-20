/**
 * class-component.js v10.5.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import camelToKebab from './camel-to-kebab.js'
import {register as cc, init, initAll, ccc} from './class-component-manager.js'
import defineFnCc from './fn.cc.js'
import $ from './jquery.js'
import {reSpaces} from './const.js'

// Initializes the module object.
if (!$.cc) {
  $.cc = cc

  defineFnCc($)

  /**
   * Initialized the all class components of the given names and returns of the promise of all initialization.
   *
   * @param {String[]|String} arguments
   * @return {Object<HTMLElement[]>}
   */
  cc.init = (classNames, elem) => {
    if (!classNames) {
      initAll(elem)

      return
    }

    if (typeof classNames === 'string') {
      classNames = classNames.split(reSpaces)
    }

    return classNames.map(className => init(className, elem))
  }

  /**
   * The decorator for class component registration.
   * @param {String|Function} name The class name or the implementation class itself
   * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
   */
  cc.component = name => {
    if (!$.isFunction(name)) {
      return Cls => {
        cc(name, Cls)
      }
    }

    // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
    cc(camelToKebab(name.name), name)
  }

  // Expose __ccc__
  cc.__ccc__ = ccc
}
