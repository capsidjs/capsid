/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 */
class ClassComponentConfiguration {

    /**
     * @param {String} className The class name
     * @param {Function} definingFunction The defining function
     */
    constructor(className, definingFunction) {

        this.className = className
        this.definingFunction = definingFunction

    }

    /**
     * @private
     * @return {String}
     */
    initializedClass() {

        return this.className + '-initialized'

    }

    /**
     * Returns the selector for uninitialized class component.
     *
     * @public
     * @return {String}
     */
    selector() {

        return '.' + this.className + ':not(.' + this.initializedClass() + ')'

    }

    /**
     * Marks the given element as initialized as this class component.
     *
     * @private
     * @param {jQuery} elem
     */
    markInitialized(elem) {

        elem.addClass(this.initializedClass())

    }

    /**
     * Applies the defining function to the element.
     *
     * @private
     * @param {jQuery} elem
     */
    applyCustomDefinition(elem) {

        this.definingFunction(elem)

    }

    /**
     * Initialize the element by the configuration.
     *
     * @public
     * @param {jQuery} elem The element
     */
    initElem(elem) {

        this.markInitialized(elem)
        this.applyCustomDefinition(elem)

    }

}

module.exports = ClassComponentConfiguration
