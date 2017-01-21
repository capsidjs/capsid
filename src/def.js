// @flow

import ccc from './ccc.js'
import prep from './prep.js'
import plugins from './plugins.js'

import check from './util/check.js'
import { ready } from './util/document'
import { COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS } from './util/const.js'

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
const def = (name: string, Constructor: Function) => {
  check(typeof name === 'string', '`name` of a class component has to be a string.')
  check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function')

  const initClass = `${name}-initialized`

  /**
   * Initializes the html element by the configuration.
   * @param el The html element
   * @param coelem The dummy parameter, don't use
   */
  const initializer = (el: HTMLElement, coelem: Constructor) => {
    const classList = el.classList

    if (!classList.contains(initClass)) {
      (el: any)[COELEMENT_DATA_KEY_PREFIX + name] = coelem = new Constructor()

      plugins.forEach(plugin => {
        plugin(el, coelem)
      })

      coelem.el = el

      if (typeof coelem.__init__ === 'function') {
        coelem.__init__()
      }

      (Constructor[KEY_EVENT_LISTENERS] || []).map(listenerBinder => {
        listenerBinder(el, coelem)
      })

      classList.add(name)
      classList.add(initClass)
    }
  }

  initializer.selector = `.${name}:not(.${initClass})`

  ccc[name] = initializer

  ready.then(() => { prep(name) })
}

export default def
