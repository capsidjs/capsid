import $ from './jquery.js'
import {COELEMENT_DATA_KEY_PREFIX} from './const.js'
/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
export default function ClassComponentConfiguration (className, Constructor) {
  this.className = className
  this.Constructor = Constructor
  const initClass = this.initClass = className + '-initialized'
  this.selector = '.' + className + ':not(.' + initClass + ')'
}

const prototype = ClassComponentConfiguration.prototype

/**
 * Applies the defining function to the element.
 * @private
 * @param {jQuery} elem
 */
prototype.applyCustomDefinition = function (elem) {
  const coelem = new this.Constructor(elem)

  if ($.isFunction(coelem.__cc_init__)) {
    coelem.__cc_init__(elem)
  } else {
    coelem.elem = elem
  }

  this.getAllListenerInfo().forEach(listenerInfo => {
    listenerInfo.bindTo(elem, coelem)
  })

  elem.data(COELEMENT_DATA_KEY_PREFIX + this.className, coelem)
}

/**
 * Gets all the listener info of the coelement.
 * @private
 * @return {ListenerInfo[]}
 */
prototype.getAllListenerInfo = function () {
  return this.Constructor.__events__ || []
}

/**
 * Initialize the element by the configuration.
 * @public
 * @param {jQuery} elem The element
 */
prototype.initElem = function (elem) {
  if (!elem.hasClass(this.initClass)) {
    this.applyCustomDefinition(elem.addClass(this.initClass))
  }
}
