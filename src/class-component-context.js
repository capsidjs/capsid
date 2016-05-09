'use strict'

var $ = global.jQuery
var subclass = require('subclassjs')


/**
 * This is class component contenxt manager. This help to initialize or get colements.
 */
var ClassComponentContext = subclass(function (pt) {

    pt.constructor = function (jqObj) {

        this.jqObj = jqObj

    }

    /**
     * Inserts the class name, initializes as the class component and returns the coelement if exists.
     *
     * @param {String} className The class name
     * @return {Object}
     */
    pt.init = function (className) {

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
    pt.up = function (classNames) {

        if (classNames != null) {

            classNames.split(/\s+/).forEach(function (className) {

                $.cc.__manager__.initAt(className, this.jqObj)

            }, this)

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
    pt.get = function (coelementName) {

        var coelement = this.jqObj.data('__coelement:' + coelementName)

        if (coelement) {

            return coelement

        }

        if (this.jqObj.length === 0) {

            throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection')

        }

        throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName)

    }

    /**
     * Gets the actor class. Actor class is the special Coelement which is labeled as `actor`. A dom has only one actor Coelement.
     */
    pt.getActor = function () {

        var actor = this.jqObj.data('__primary_coelement')

        if (!actor) {

            throw new Error('no actor on the dom: ' + this.jqObj.get(0).tagName)

        }

        return actor

    }

})

module.exports = ClassComponentContext
