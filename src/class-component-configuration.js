function __cc_init__(elem) {
  this.elem = elem
}

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 */
class ClassComponentConfiguration {
  /**
   * @param {String} className The class name
   * @param {Function} Constructor The constructor of the coelement of the class component
   */
  constructor(className, Constructor) {
    this.className = className
    this.Constructor = Constructor
    this.initClass = this.className + '-initialized'
  }

  /**
   * Returns the selector for uninitialized class component.
   * @public
   * @return {String}
   */
  selector() {
    return '.' + this.className + ':not(.' + this.initClass + ')'
  }

  isInitialized(elem) {
    return elem.hasClass(this.initClass)
  }

  /**
   * Marks the given element as initialized as this class component.
   * @private
   * @param {jQuery} elem
   */
  markInitialized(elem) {
    elem.addClass(this.initClass)
  }

  /**
   * Applies the defining function to the element.
   * @private
   * @param {jQuery} elem
   */
  applyCustomDefinition(elem) {
    const coelem = new this.Constructor(elem)

    if (typeof coelem.__cc_init__ === 'function') {
      coelem.__cc_init__(elem)
    } else {
      __cc_init__.call(coelem, elem)
    }

    this.getAllListenerInfo().forEach(listenerInfo => listenerInfo.bindTo(elem, coelem))

    elem.data('__coelement:' + this.className, coelem)
  }

  /**
   * Gets the list of the event-decorated handlers.
   * @private
   * @return {Function[]}
   */
  getHandlers() {
    const prototype = this.Constructor.prototype

    return Object.getOwnPropertyNames(prototype)
      .map(key => prototype[key])
      .filter(ClassComponentConfiguration.isHandler)
  }

  /**
   * Gets all the listener info of the coelement.
   * @private
   * @return {ListenerInfo[]}
   */
  getAllListenerInfo() {
    return [].concat.apply([], this.getHandlers().map(handler => handler.__events__))
  }


  /**
   * Returns true when the given property is an event handler.
   * @private
   * @param {object} property The property
   * @return {boolean}
   */
  static isHandler(property) {
    return typeof property === 'function' && property.__events__ != null
  }

  /**
   * Initialize the element by the configuration.
   * @public
   * @param {jQuery} elem The element
   */
  initElem(elem) {
    if (this.isInitialized(elem)) {
      return
    }

    this.markInitialized(elem)
    this.applyCustomDefinition(elem)
  }
}

module.exports = ClassComponentConfiguration
