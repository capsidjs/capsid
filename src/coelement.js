/**
 * Coelement is the dual of element (usual dom). Its instance accompanies an element and forms a Dom Component together with it.
 */
class Coelement {
  /**
   * @param {jQuery} elem The jquery element
   */
  constructor(elem) {
    this.elem = elem
  }

  /**
   * Binds the event listener to the given event.
   * @param {string} event The event
   * @param {string} selector The selector
   * @param {Function} listener The listener
   * @return {Coelement}
   */
  on(event, selector, listener) {
    this.elem.on(event, selector, listener)
  }

  /**
   * Unbinds the event
   * @param {string} event The event
   * @param {string} selector The selector
   * @param {Function} listener The listener
   */
  off(event, selector) {
    this.elem.off(event, selector, listener)
  }

  /**
   * Triggers the event.
   * @param {string} event The event
   * @param {object} data The event parameter
   */
  trigger(event, data) {
    this.elem.trigger(event, data)
  }
}

module.exports = Coelement
