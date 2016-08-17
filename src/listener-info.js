/**
 * The event listener's information model.
 * @param {string} event The event name to bind
 * @param {string} selector The selector to bind the listener
 * @param {string} key The handler name
 */
const ListenerInfo = module.exports = function (event, selector, key) {
  this.event = event
  this.selector = selector
  this.key = key
}

/**
 * Binds the listener to the given element with the given coelement.
 * @param {jQuery} elem The jquery element
 * @param {object} coelem The coelement which is bound to the element
 */
ListenerInfo.prototype.bindTo = function (elem, coelem) {
  const key = this.key

  elem.on(this.event, this.selector, function () {
    coelem[key].apply(coelem, arguments)
  })
}
