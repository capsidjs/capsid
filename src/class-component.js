/**
 * class-component.js v10.4.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import {on, emit, wire} from './decorators'
import camelToKebab from './camel-to-kebab'
import __manager__ from './class-component-manager'
import defineFnCc from './fn.cc'

/**
 * Initializes the module object.
 * @param {jquery} $ The static jquery object
 */
void ($ => {
  if ($.cc) {
    return $.cc
  }

  defineFnCc($)

  /**
   * The main namespace for class component module.
   * Registers a class component of the given name using the given defining function.
   * @param {String} name The class name
   * @param {Function} Constructor The class definition
   */
  const cc = $.cc = (name, Constructor) => {
    if (typeof name !== 'string') {
      throw new Error('`name` of a class component has to be a string')
    }

    if (typeof Constructor !== 'function') {
      throw new Error('`Constructor` of a class component has to be a function')
    }

    __manager__.register(name, Constructor)

    $(() => { __manager__.init(name) })
  }

  /**
   * Initialized the all class components of the given names and returns of the promise of all initialization.
   *
   * @param {String[]|String} arguments
   * @return {Object<HTMLElement[]>}
   */
  cc.init = (classNames, elem) => {
    if (classNames == null) {
      __manager__.initAll(elem)

      return
    }

    if (typeof classNames === 'string') {
      classNames = classNames.split(/ +/)
    }

    return classNames.map(className => __manager__.init(className, elem))
  }

  /**
   * The decorator for class component registration.
   * @param {String|Function} name The class name or the implementation class itself
   * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
   */
  cc.component = name => {
    if (typeof name === 'function') {
      // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
      cc(camelToKebab(name.name), name)
    }

    return Cls => cc(name, Cls)
  }

  // Exports __manager__
  cc.__manager__ = __manager__

  // Exports decorators
  cc.on = on
  cc.emit = emit
  cc.wire = wire

  return cc
})(jQuery)
