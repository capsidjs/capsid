import {isFunction} from './jquery.js'
import {getListeners} from './listener-info.js'
import {COELEMENT_DATA_KEY_PREFIX} from './const.js'

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
export default function ClassComponentConfiguration (className, Constructor) {
  this.Constructor = Constructor
  const initClass = className + '-initialized'
  this.selector = '.' + className + ':not(.' + initClass + ')'

  /**
   * Initialize the element by the configuration.
   * @public
   * @param {jQuery} elem The element
   * @param {object} coelem The dummy parameter, don't use
   */
  this.initElem = (elem, coelem) => {
    if (!elem.hasClass(initClass)) {
      elem.addClass(initClass).data(COELEMENT_DATA_KEY_PREFIX + className, coelem = new Constructor(elem))

      if (isFunction(coelem.__cc_init__)) {
        coelem.__cc_init__(elem)
      } else {
        coelem.elem = elem
      }

      getListeners(Constructor).forEach(listenerInfo => {
        listenerInfo.bindTo(elem, coelem)
      })
    }
  }
}
