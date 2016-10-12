// @flow
import {KEY_EVENT_LISTENERS} from './const.js'
import eventDelegate from './event-delegate.js'

/**
 * Registers the event listener to the class constructor.
 * @param {object} Constructor The constructor
 * @param {string} key The key of handler method
 * @param {string} event The event name
 * @param {string} selector The selector
 */
export const registerListenerInfo = (Constructor: Function, key: string, event: string, selector: ?string) => {
  /**
   * @type <T> The coelement type
   * @param {HTMLElement} el The jquery selection of the element
   * @param {T} coelem The coelement
   */
  Constructor[KEY_EVENT_LISTENERS] = (Constructor[KEY_EVENT_LISTENERS] || []).concat((el: HTMLElement, coelem: any) => {
    eventDelegate(el, event, selector, function () {
      coelem[key].apply(coelem, arguments)
    })
  })
}
