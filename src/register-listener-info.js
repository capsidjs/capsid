import {KEY_EVENT_LISTENERS} from './const.js'

/**
 * Registers the event listener to the class constructor.
 * @param {object} constructor The constructor
 * @param {string} key The key of handler method
 * @param {string} event The event name
 * @param {string} selector The selector
 */
export const registerListenerInfo = (constructor, key, event, selector) => {
  // assert(constructor, 'prototype.constructor must be set to register the event listeners.')
  // Does not assert the above because if the user uses decorators throw decorators syntax,
  // Then the above assertion always passes and never fails.

  constructor[KEY_EVENT_LISTENERS] = (constructor[KEY_EVENT_LISTENERS] || []).concat((elem, coelem) => {
    elem.on(event, selector, function () {
      coelem[key].apply(coelem, arguments)
    })
  })
}
