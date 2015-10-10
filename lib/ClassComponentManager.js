'use strict';

var $ = global.jQuery;
var subclass = require('subclassjs');

var ClassComponentConfiguration = require('./ClassComponentConfiguration');

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 *
 * @class
 */
var ClassComponentManager = subclass(function (pt) {

    pt.constructor = function () {

        /**
         * @property {Object<ClassComponentConfiguration>} ccc
         */
        this.ccc = {};

    };

    /**
     * Registers the class component configuration for the given name.
     *
     * @param {String} name The name
     * @param {Function} ccc The class component configuration
     */
    pt.register = function (name, definingFunction) {

        this.ccc[name] = new ClassComponentConfiguration(name, definingFunction);

    };

    /**
     * Initializes the class components of the given name in the given element.
     *
     * @param {String} className The class name
     * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
     * @return {Array<HTMLElement>} The elements which are initialized in this initialization
     * @throw {Error}
     */
    pt.init = function (className, elem) {

        var ccc = this.getConfiguration(className);

        return $(ccc.selector(), elem).each(function () {

            pt.constructor.initElemByCCC($(this), ccc);

        }).toArray();

    };

    /**
     * Initializes the class component of the give name at the given element.
     *
     * @param {String} className The class name
     * @param {jQuery|HTMLElement|String} elem The element
     */
    pt.initAt = function (className, elem) {

        var ccc = this.getConfiguration(className);

        this.constructor.initElemByCCC($(elem), ccc);

    };


    /**
     * @param {jQuery|HTMLElement|String} elem The element
     */
    pt.initAll = function (elem) {

        Object.keys(this.ccc).forEach(function (className) {

            this.init(className, elem);

        }, this);

    };

    /**
     * @static
     * @private
     * @param {jQuery} elem The element
     * @param {ClassComponentConfiguration}
     */
    pt.constructor.initElemByCCC = function (elem, ccc) {

        ccc.markInitialized(elem);
        ccc.applyCustomDefinition(elem);

    };


    /**
     * Gets the configuration of the given class name.
     *
     * @param {String} className The class name
     * @return {ClassComponentConfiguration}
     * @throw {Error}
     */
    pt.getConfiguration = function (className) {

        var ccc = this.ccc[className];

        if (ccc == null) {

            throw new Error('Class componet "' + name + '" is not defined.');

        }

        return ccc;

    };

});

module.exports = ClassComponentManager;
