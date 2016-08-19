import $ from './jquery'

import ClassComponentConfiguration from './class-component-configuration'

/**
 * @property {Object<ClassComponentConfiguration>} ccc
 */
export const ccc = {}

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
export function register (name, Constructor) {
  ccc[name] = new ClassComponentConfiguration(name, Constructor)
}

/**
 * Initializes the class components of the given name in the given element.
 * @param {String} className The class name
 * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
 * @return {Array<HTMLElement>} The elements which are initialized in this initialization
 * @throw {Error}
 */
export function init (className, elem) {
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
export function initAt (className, elem) {
  getConfiguration(className).initElem($(elem))
}

/**
 * Initializes all the class component at the element.
 * @param {jQuery} elem jQuery selection of doms
 */
export function initAllAtElem (elem) {
  const classes = elem[0].className

  if (classes) {
    classes.split(/\s+/)
      .forEach(className => {
        if (ccc[className]) {
          initAt(className, elem)
        }
      })
  }
}

/**
 * @param {jQuery|HTMLElement|String} elem The element
 */
export function initAll (elem) {
  Object.keys(ccc).forEach(className => {
    init(className, elem)
  })
}
