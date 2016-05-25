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
    }

    /**
     * Gets the initialized class name.
     * @private
     * @return {String}
     */
    initializedClass() {
        return this.className + '-initialized'
    }

    /**
     * Returns the selector for uninitialized class component.
     * @public
     * @return {String}
     */
    selector() {
        return '.' + this.className + ':not(.' + this.initializedClass() + ')'
    }

    /**
     * Marks the given element as initialized as this class component.
     * @private
     * @param {jQuery} elem
     */
    markInitialized(elem) {
        elem.addClass(this.initializedClass())
    }

    /**
     * Applies the defining function to the element.
     * @private
     * @param {jQuery} elem
     */
    applyCustomDefinition(elem) {
        this.getAllListenerInfo().forEach(listenerInfo => {
            elem.on(listenerInfo.event, listenerInfo.selector, function () {
                listenerInfo.handler.apply(coelement, arguments)
            })
        })

        const coelement = new this.Constructor(elem)

        coelement.elem = elem // Injects elem at this.elem

        elem.data('__coelement:' + this.className, coelement)
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
     * @return {ListenerInfo[]}
     */
    getAllListenerInfo() {
        return [].concat.apply([], this.getHandlers().map(handler => handler.__events__))
    }


    /**
     * Returns true when the given property is an event handler.
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
        this.markInitialized(elem)
        this.applyCustomDefinition(elem)
    }
}

module.exports = ClassComponentConfiguration
