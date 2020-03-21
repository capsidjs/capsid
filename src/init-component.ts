import pluginHooks from './plugin-hooks'
import initConstructor from './init-constructor'
import {
  KEY_EVENT_LISTENERS,
  INITIALIZED_KEY,
  COELEMENT_DATA_KEY_PREFIX,
  BEFORE_MOUNT_KEY,
} from './util/const'

/**
 * Initialize component.
 * @param Constructor The coelement class
 * @param el The element
 * @param name The coelement name
 * @return The created coelement instance
 */
export default (Constructor: any, el: HTMLElement, name?: string): any => {
  if (!Constructor[INITIALIZED_KEY]) {
    initConstructor(Constructor, name)
  }

  const coel = new Constructor()

  // Assigns element to coelement's .el property
  coel.el = el

  if (name) {
    // Assigns coelement to element's "hidden" property
    ;(el as any)[COELEMENT_DATA_KEY_PREFIX + name] = coel
  }

  // Initialize `before mount` hooks
  // This includes:
  // - initialization of event handlers
  // - initialization of innerHTML
  // - initialization of class names
  const list = Constructor[BEFORE_MOUNT_KEY] as unknown
  if (Array.isArray(list)) {
    list.forEach(cb => { cb(el, coel) })
  }

  if (typeof coel.__mount__ === 'function') {
    coel.__mount__()
  }

  return coel
}
