/**
 * class-component.js v10.4.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import {on, emit, wire} from './decorators.js'
import camelToKebab from './camel-to-kebab.js'
import {register, init, initAll, ccc} from './class-component-manager.js'
import defineFnCc from './fn.cc.js'
import assert from './assert.js'
import $ from './jquery.js'
import {reSpaces} from './const.js'

const {isFunction} = $

let cc = $.cc

// Initializes the module object.
if (!cc) {

  defineFnCc($)

  /**
   * The main namespace for class component module.
   * Registers a class component of the given name using the given defining function.
   * @param {String} name The class name
   * @param {Function} Constructor The class definition
   */
  cc = $.cc = (name, Constructor) => {
    assert(typeof name === 'string', '`name` of a class component has to be a string')
    assert(isFunction(Constructor), '`Constructor` of a class component has to be a function')

    register(name, Constructor)

    $(() => { init(name) })
  }

  /**
   * Initialized the all class components of the given names and returns of the promise of all initialization.
   *
   * @param {String[]|String} arguments
   * @return {Object<HTMLElement[]>}
   */
  cc.init = (classNames, elem) => {
    if (classNames == null) {
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
    if (isFunction(name)) {
      // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
      cc(camelToKebab(name.name), name)
    }

    return Cls => cc(name, Cls)
  }

  // Expose __ccc__
  cc.__ccc__ = ccc

  // Exports decorators
  cc.on = on
  cc.emit = emit
  cc.wire = wire
}
