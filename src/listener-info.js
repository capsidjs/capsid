import {KEY_EVENT_LISTENERS} from './const.js'

/**
 * The event listener's information model.
 * @param {string} event The event name to bind
 * @param {string} selector The selector to bind the listener
 * @param {string} key The handler name
 */
export default function ListenerInfo (event, selector, key) {
  /**
   * Binds the listener to the given element with the given coelement.
   * @param {jQuery} elem The jquery element
   * @param {object} coelem The coelement which is bound to the element
   */
  this.bindTo = (elem, coelem) => {
    elem.on(event, selector, function () {
      coelem[key].apply(coelem, arguments)
    })
  }
}

/**
 * @param {Function} constructor The constructor
 * @param {string} key The key of handler method
 * @param {string} event The event name
 * @param {string} selector The selector
 */
export const registerListenerInfo = (prototype, key, event, selector) => {
  const constructor = prototype.constructor

  // assert(constructor, 'prototype.constructor must be set to register the event listeners.')
  // Does not assert the above because if the user uses decorators throw decorators syntax,
  // Then the above assertion always passes and never fails.

  constructor[KEY_EVENT_LISTENERS] = (constructor[KEY_EVENT_LISTENERS] || []).concat(new ListenerInfo(event, selector, key))
}
