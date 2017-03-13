// @flow

import * as capsid from './index.js'
import pluginHooks from './plugin-hooks.js'
import initConstructor from './init-constructor.js'
import { KEY_EVENT_LISTENERS, INITIALIZED_KEY } from './util/const.js'

/**
 * Initialize component.
 * @param Constructor The coelement class
 * @param el The element
 * @return The created coelement instance
 */
export default (Constructor: Function, el: HTMLElement): any => {
  if (!Constructor[INITIALIZED_KEY]) {
    initConstructor(Constructor)
  }

  const coelem = new Constructor()

  pluginHooks.forEach(pluginHook => {
    pluginHook(el, coelem)
  })

  coelem.el = el

  if (typeof coelem.__init__ === 'function') {
    coelem.__init__()
  }

  (Constructor[KEY_EVENT_LISTENERS] || []).map(listenerBinder => {
    listenerBinder(el, coelem)
  })

  return coelem
}
