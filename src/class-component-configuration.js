/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
module.exports = function (className, Constructor) {
  this.className = className
  this.Constructor = Constructor
  this.initClass = this.className + '-initialized'
}

const prototype = module.exports.prototype

/**
 * Returns the selector for uninitialized class component.
 * @public
 * @return {String}
 */
prototype.selector = function () {
  return '.' + this.className + ':not(.' + this.initClass + ')'
}

/**
 * Applies the defining function to the element.
 * @private
 * @param {jQuery} elem
 */
prototype.applyCustomDefinition = function (elem) {
  const coelem = new this.Constructor(elem)

  if (typeof coelem.__cc_init__ === 'function') {
    coelem.__cc_init__(elem)
  } else {
    coelem.elem = elem
  }

  this.getAllListenerInfo().forEach(listenerInfo => listenerInfo.bindTo(elem, coelem))

  elem.data('__coelement:' + this.className, coelem)
}

/**
 * Gets all the listener info of the coelement.
 * @private
 * @return {ListenerInfo[]}
 */
prototype.getAllListenerInfo = function () {
  return this.Constructor.__events__ || []
}

/**
 * Initialize the element by the configuration.
 * @public
 * @param {jQuery} elem The element
 */
prototype.initElem = function (elem) {
  if (!elem.hasClass(this.initClass)) {
    elem.addClass(this.initClass)
    this.applyCustomDefinition(elem)
  }
}
