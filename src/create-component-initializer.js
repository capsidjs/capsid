import $, {isFunction} from './jquery.js'
import {COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS} from './const.js'

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
export default function createComponentInitializer (className, Constructor) {
  const initClass = className + '-initialized'

  /**
   * Initialize the html element by the configuration.
   * @public
   * @param {HTMLElement} el The html element
   * @param {object} coelem The dummy parameter, don't use
   */
  const initializer = (el, coelem) => {
    const $el = $(el)

    if (!$el.hasClass(initClass)) {
      el[COELEMENT_DATA_KEY_PREFIX + className] = coelem = new Constructor($el.addClass(initClass))

      if (isFunction(coelem.__cc_init__)) {
        coelem.__cc_init__($el)
      } else {
        coelem.elem = coelem.$el = $el
        coelem.el = el
      }

      (Constructor[KEY_EVENT_LISTENERS] || []).forEach(listenerBinder => {
        listenerBinder($el, coelem)
      })
    }
  }

  initializer.selector = '.' + className + ':not(.' + initClass + ')'

  return initializer
}
