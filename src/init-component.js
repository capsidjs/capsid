// @flow

import pluginHooks from './plugin-hooks.js'
import initConstructor from './init-constructor.js'
import { KEY_EVENT_LISTENERS, INITIALIZED_KEY, COELEMENT_DATA_KEY_PREFIX } from './util/const.js'

/**
 * Initialize component.
 * @param Constructor The coelement class
 * @param el The element
 * @param name The coelement name
 * @return The created coelement instance
 */
export default (Constructor: Function, el: HTMLElement, name?: string): any => {
  if (!Constructor[INITIALIZED_KEY]) {
    initConstructor(Constructor, name)
  }

  const coelem = new Constructor()

  // Assigns element to coelement's .el property
  coelem.el = el

  if (name) {
    // Assigns coelement to element's "hidden" property
    ;(el: any)[COELEMENT_DATA_KEY_PREFIX + name] = coelem
  }

  // Initialize event listeners defined by @emit decorator
  ;(Constructor[KEY_EVENT_LISTENERS] || []).map(listenerBinder => {
    listenerBinder(el, coelem)
  })

  // Executes plugin hooks
  pluginHooks.forEach(pluginHook => {
    pluginHook(el, coelem)
  })

  // Backward compat
  if (typeof coelem.__init__ === 'function') {
    coelem.__init__()
  }

  if (typeof coelem.__mount__ === 'function') {
    coelem.__mount__()
  }

  return coelem
}
