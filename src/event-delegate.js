import $ from './jquery.js'

/**
 * Binds the callback to the element at the event and the selector.
 * @param {HTMLElement} el The element
 * @param {string} event The event
 * @param {?string} selector The selector
 * @param {Function} callback The handler
 */
export default (el, event, selector, callback) => {
  $(el).on(event, selector, callback)
}
