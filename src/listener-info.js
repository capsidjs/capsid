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
}

module.exports = ListenerInfo
