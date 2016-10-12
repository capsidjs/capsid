// @flow
/**
 * Binds the callback to the element at the event and the selector.
 * @param {HTMLElement} el The element
 * @param {string} event The event
 * @param {?string} selector The selector
 * @param {Function} callback The handler
 */
export default (el: HTMLElement, event: string, selector: ?string, callback: ((e: Event) => void)) => {
  el.addEventListener(event, (e: Event) => {
    if (!selector) {
      callback(e)
      return
    }

    const nodes = el.querySelectorAll(selector)
    const target: HTMLElement = ((e.target: any): HTMLElement)

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === target || nodes[i].contains(target)) {
        callback(e)
        return
      }
    }
  })
}
