/**
 * Binds the callback to the element at the event and the selector.
 * @param {HTMLElement} el The element
 * @param {string} event The event
 * @param {?string} selector The selector
 * @param {Function} callback The handler
 */
export default (el, event, selector, callback) => {
  el.addEventListener(event, e => {
    if (!selector) {
      callback(e)
      return
    }

    const nodes = el.querySelectorAll(selector)

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === e.target || nodes[i].contains(e.target)) {
        callback(e)
        return
      }
    }
  })
}
