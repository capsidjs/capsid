'use strict';

var subclass = require('subclassjs');

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 *
 * @class
 */
var ClassComponentConfiguration = subclass(function (pt) {

    /**
     * @param {String} className The class name
     * @param {Function} definingFunction The defining function
     */
    pt.constructor = function (className, definingFunction) {

        this.className = className;
        this.definingFunction = definingFunction;

    };

    /**
     * @private
     * @return {String}
     */
    pt.initializedClass = function () {

        return this.className + '-initialized';

    };

    /**
     * Returns the selector for uninitialized class component.
     *
     * @public
     * @return {String}
     */
    pt.selector = function () {

        return '.' + this.className + ':not(.' + this.initializedClass() + ')';

    };

    /**
     * Marks the given element as initialized as this class component.
     *
     * @private
     * @param {jQuery} elem
     */
    pt.markInitialized = function (elem) {

        elem.addClass(this.initializedClass());

    };

    /**
     * Applies the defining function to the element.
     *
     * @private
     * @param {jQuery} elem
     */
    pt.applyCustomDefinition = function (elem) {

        this.definingFunction(elem);

    };

    /**
     * Initialize the element by the configuration.
     *
     * @public
     * @param {jQuery} elem The element
     */
    pt.initElem = function (elem) {

        this.markInitialized(elem);
        this.applyCustomDefinition(elem);

    };

});

module.exports = ClassComponentConfiguration;
