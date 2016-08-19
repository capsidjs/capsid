/**
 * class-component.js v10.4.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import {on, emit, wire} from './decorators'
import camelToKebab from './camel-to-kebab'
import {register, init, initAll, ccc} from './class-component-manager'
import defineFnCc from './fn.cc'

/**
 * Initializes the module object.
 * @param {jquery} $ The static jquery object
 */
void ($ => {
  if ($.cc) {
    return
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
      classNames = classNames.split(/ +/)
    }

    return classNames.map(className => init(className, elem))
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

  // Expose __ccc__
  cc.__ccc__ = ccc

  // Exports decorators
  cc.on = on
  cc.emit = emit
  cc.wire = wire
})(jQuery)
