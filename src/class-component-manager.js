const $ = jQuery

import ClassComponentConfiguration from './class-component-configuration'

/**
 * @property {Object<ClassComponentConfiguration>} ccc
 */
const ccc = {}

/**
 * Gets the configuration of the given class name.
 * @param {String} className The class name
 * @return {ClassComponentConfiguration}
 * @throw {Error}
 */
function getConfiguration (className) {
  if (ccc[className]) {
    return ccc[className]
  }

  throw new Error('Class componet "' + className + '" is not defined.')
}

/**
 * Registers the class component configuration for the given name.
 * @param {String} name The name
 * @param {Function} Constructor The constructor of the class component
 */
function register (name, Constructor) {
  Constructor.coelementName = name

  ccc[name] = new ClassComponentConfiguration(name, Constructor)
}

/**
 * Initializes the class components of the given name in the given element.
 * @param {String} className The class name
 * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
 * @return {Array<HTMLElement>} The elements which are initialized in this initialization
 * @throw {Error}
 */
function init (className, elem) {
  const conf = getConfiguration(className)

  return $(conf.selector, elem).each(function () {
    conf.initElem($(this))
  }).toArray()
}

/**
 * Initializes the class component of the give name at the given element.
 * @param {String} className The class name
 * @param {jQuery|HTMLElement|String} elem The element
 */
function initAt (className, elem) {
  getConfiguration(className).initElem($(elem))
}

/**
 * Initializes all the class component at the element.
 * @param {jQuery} elem jQuery selection of doms
 */
function initAllAtElem (elem) {
  const classes = elem[0].className

  if (classes) {
    classes.split(/\s+/)
      .filter(className => ccc[className])
      .forEach(className => initAt(className, elem))
  }
}

/**
 * @param {jQuery|HTMLElement|String} elem The element
 */
function initAll (elem) {
  Object.keys(ccc).forEach(className => init(className, elem))
}

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 */
export default {ccc, register, init, initAt, initAllAtElem, initAll}

