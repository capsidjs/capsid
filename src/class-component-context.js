const $ = global.jQuery

/**
 * This is class component contenxt manager. This help to initialize or get colements.
 */
class ClassComponentContext {

    constructor(jqObj) {

        this.jqObj = jqObj

    }

    /**
     * Inserts the class name, initializes as the class component and returns the coelement if exists.
     *
     * @param {String} className The class name
     * @return {Object}
     */
    init(className) {

        this.jqObj.addClass(className)

        $.cc.__manager__.initAt(className, this.jqObj)

        return this.jqObj.data('__coelement:' + className)

    }

    /**
     * Initializes the element if it has registered class component names. Returns the jquery object itself.
     *
     * @param {string} [classNames] The class name.
     * @return {jQuery}
     */
    up(classNames) {

        if (classNames != null) {

            classNames.split(/\s+/).forEach(className => {

                $.cc.__manager__.initAt(className, this.jqObj)

            })

        } else {

            // Initializes anything it already has.
            $.cc.__manager__.initAllAtElem(this.jqObj)

        }

        return this.jqObj

    }

    /**
     * Gets the coelement of the given name.
     *
     * @param {String} coelementName The name of the coelement
     * @return {Object}
     */
    get(coelementName) {

        const coelement = this.jqObj.data('__coelement:' + coelementName)

        if (coelement) {

            return coelement

        }

        if (this.jqObj.length === 0) {

            throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection')

        }

        throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName)

    }
}

module.exports = ClassComponentContext
