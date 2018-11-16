// @flow
import { KEY_EVENT_LISTENERS } from '../util/const.js'
import debugMessage from '../util/debug-message.js'
import check from '../util/check.js'

declare var __DEV__: boolean

/**
 * The decorator for registering event listener info to the method.
 * @param event The event name
 * @param at The selector
 * @param descriptor The method descriptor
 */
export default (event: string, { at }: { at?: string } = {}) => (descriptor: Object) => {
  const key = descriptor.key

  descriptor.finisher = (constructor: Function) => {
    check(!!event, `Empty event handler is given: constructor=${constructor.name} key=${key}`)
    /**
     * @param el The element
     * @param coelem The coelement
     * @param name The component name
     */
    constructor[KEY_EVENT_LISTENERS] = (constructor[KEY_EVENT_LISTENERS] || []).concat((el: HTMLElement, coelem: any, name: string) => {
      const keyEventListeners = KEY_EVENT_LISTENERS + name

      const listener = (e: Event): void => {
        if (
          !at ||
          [].some.call(el.querySelectorAll(at), node => {
            return node === e.target || node.contains(e.target)
          })
        ) {
          if (__DEV__) {
            debugMessage({
              type: 'event',
              module: '💊',
              color: '#e0407b',
              e,
              el,
              coelem
            })
          }

          coelem[key](e)
        }
      }

      /**
       * Removes the event listener.
       */
      listener.remove = () => {
        el.removeEventListener(event, listener)
      }

      /**
       * Store event listeners to remove it later.
       */
      ;(el: any)[keyEventListeners] = ((el: any)[keyEventListeners] || []).concat(listener)

      el.addEventListener(event, listener)
    })
  }
}
