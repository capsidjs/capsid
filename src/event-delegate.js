// @flow
/**
 * Binds the callback to the element at the event and the selector.
 * @param {HTMLElement} el The element
 * @param {string} event The event
 * @param {?string} selector The selector
 * @param {Function} callback The handler
 */
export default (el: HTMLElement, event: string, selector: ?string, callback: ((e: Event) => void)) => {
  el.addEventListener(event, (e: Event): void => {
    selector ? [].some.call(el.querySelectorAll(selector), node => {
      if (node === e.target || node.contains(e.target)) {
        callback(e)
        return 1
      }
    }) : callback(e)
  })
}
