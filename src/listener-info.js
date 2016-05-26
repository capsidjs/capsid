/**
 * The event listener's information.
 */
class ListenerInfo {
  /**
   * @param {string} event The event name to bind
   * @param {string} selector The selector to bind the listener
   * @param {Function} handler The handler for the event
   */
  constructor(event, selector, handler) {
    this.event = event
    this.selector = selector
    this.handler = handler
  }

  /**
   * Binds the listener to the given element with the given coelement.
   * @param {jQuery} elem The jquery element
   * @param {object} coelem The coelement which is bound to the element
   */
  bindTo(elem, coelem) {
    const handler = this.handler

    elem.on(this.event, this.selector, function () {
      handler.apply(coelem, arguments)
    })
  }
}

module.exports = ListenerInfo
