// @flow
import { KEY_EVENT_LISTENERS } from './const.js'
import eventDelegate from './event-delegate.js'

/**
 * Registers the event listener to the class constructor.
 * @param Constructor The constructor
 * @param key The key of handler method
 * @param event The event name
 * @param selector The selector
 */
export const registerListenerInfo = (Constructor: Function, key: string, event: string, selector: ?string) => {
  /**
   * @param el The element
   * @param coelem The coelement
   */
  Constructor[KEY_EVENT_LISTENERS] = (Constructor[KEY_EVENT_LISTENERS] || []).concat((el: HTMLElement, coelem: any) => {
    eventDelegate(el, event, selector, function () {
      coelem[key].apply(coelem, arguments)
    })
  })
}
