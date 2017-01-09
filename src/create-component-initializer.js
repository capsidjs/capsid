// @flow
import $ from './util/jquery.js'
import { COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS } from './const.js'

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param className The class name
 * @param Constructor The constructor of the coelement of the class component
 */
export default function createComponentInitializer (className: string, Constructor: Function) {
  const initClass = `${className}-initialized`

  /**
   * Initialize the html element by the configuration.
   * @param el The html element
   * @param coelem The dummy parameter, don't use
   */
  const initializer = (el: HTMLElement, coelem: Constructor) => {
    const classList = el.classList

    if (!classList.contains(initClass)) {
      classList.add(initClass)

      ;(el: any)[COELEMENT_DATA_KEY_PREFIX + className] = coelem = new Constructor($(el))

      coelem.elem /* <- backward compat */ = coelem.$el = $(el)
      coelem.el = el

      if (typeof coelem.__init__ === 'function') {
        coelem.__init__()
      }

      (Constructor[KEY_EVENT_LISTENERS] || []).map(listenerBinder => {
        listenerBinder(el, coelem)
      })
    }
  }

  initializer.selector = `.${className}:not(.${initClass})`

  return initializer
}
