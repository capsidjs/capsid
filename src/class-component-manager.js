import $ from './jquery.js'
import {reSpaces} from './const.js'
import ClassComponentConfiguration from './class-component-configuration.js'
import assert from './assert.js'

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
  assert(ccc[className], 'Class componet "' + className + '" is not defined.')

  return ccc[className]
}

/**
 * Registers the class component configuration for the given name.
 * @param {String} name The name
 * @param {Function} Constructor The constructor of the class component
 */
export function register (name, Constructor) {
  assert(typeof name === 'string', '`name` of a class component has to be a string')
  assert($.isFunction(Constructor), '`Constructor` of a class component has to be a function')

  ccc[name] = new ClassComponentConfiguration(name, Constructor)

  $(() => { init(name) })
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
    classes.split(reSpaces)
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
