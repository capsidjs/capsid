import $ from './jquery.js'
import {COELEMENT_DATA_KEY_PREFIX} from './const.js'
/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
export default function ClassComponentConfiguration (className, Constructor) {
  this.name = className
  this.Constructor = Constructor
  Constructor.coelementName = className
  const initClass = className + '-initialized'
  this.selector = '.' + className + ':not(.' + initClass + ')'

  /**
   * Initialize the element by the configuration.
   * @public
   * @param {jQuery} elem The element
   */
  this.initElem = elem => {
    if (!elem.hasClass(initClass)) {
      initializeClassComponent(elem.addClass(initClass), className, Constructor)
    }
  }
}

/**
 * Initializes the class component
 * @param {jQuery} elem The element
 * @param {string} name The component name
 * @param {Function} Constructor The constructor of coelement
 */
const initializeClassComponent = (elem, name, Constructor) => {
  const coelem = new Constructor(elem)

  if ($.isFunction(coelem.__cc_init__)) {
    coelem.__cc_init__(elem)
  } else {
    coelem.elem = elem
  }

  getAllListenerInfo(Constructor).forEach(listenerInfo => {
    listenerInfo.bindTo(elem, coelem)
  })

  elem.data(COELEMENT_DATA_KEY_PREFIX + name, coelem)
}

/**
 * Gets all the listener info of the coelement.
 * @private
 * @return {ListenerInfo[]}
 */
const getAllListenerInfo = Constructor => Constructor.__events__ || []

