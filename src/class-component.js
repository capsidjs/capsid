/**
 * class-component.js v10.1.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
const $ = jQuery

const reSpaces = / +/

const ClassComponentManager = require('./class-component-manager')
const camelToKebab = require('./camel-to-kebab')
const decorators = require('./decorators')

/**
 * Initializes the module object.
 *
 * @return {Object}
 */
function initializeModule () {
  require('./fn.cc')

  const __manager__ = new ClassComponentManager()

  /**
   * The main namespace for class component module.
   * Registers a class component of the given name using the given defining function.
   * @param {String} name The class name
   * @param {Function} Constructor The class definition
   */
  const cc = (name, Constructor) => {
    if (typeof name !== 'string') {
      throw new Error('`name` of a class component has to be a string')
    }

    if (typeof Constructor !== 'function') {
      throw new Error('`Constructor` of a class component has to be a function')
    }

    __manager__.register(name, Constructor)

    $(document).ready(() => { __manager__.init(name) })
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
      classNames = classNames.split(reSpaces)
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
      cc(camelToKebab(name.name), name)
    }

    return Cls => cc(name, Cls)
  }

  // Exports __manager__
  cc.__manager__ = __manager__

  // Exports decorators
  cc.on = decorators.on
  cc.emit = decorators.emit
  cc.wire = decorators.wire

  return cc
}

// If the cc is not set, then create one.
if ($.cc == null) {
  $.cc = initializeModule()
}

module.exports = $.cc
