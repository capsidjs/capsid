// @flow
import $ from './jquery.js'
import isFunction from './is-function'
import {COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS} from './const.js'

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {string} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
export default function createComponentInitializer (className: string, Constructor: Function) {
  const initClass = className + '-initialized'

  /**
   * Initialize the html element by the configuration.
   * @public
   * @param {HTMLElement} el The html element
   * @param {Object} coelem The dummy parameter, don't use
   */
  const initializer = (el: Object/* HTMLElement */, coelem: Constructor) => {
    const classList = el.classList

    if (!classList.contains(initClass)) {
      classList.add(initClass)
      el[COELEMENT_DATA_KEY_PREFIX + className] = coelem = new Constructor($(el))

      coelem.elem = coelem.$el = $(el)
      coelem.el = el

      if (typeof coelem.__init__ === 'function') {
        coelem.__init__()
      }

      (Constructor[KEY_EVENT_LISTENERS] || []).forEach(listenerBinder => {
        listenerBinder(el, coelem)
      })
    }
  }

  initializer.selector = '.' + className + ':not(.' + initClass + ')'

  return initializer
}
