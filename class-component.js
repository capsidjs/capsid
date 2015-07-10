/**
 * class-component.js v4.1.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    /**
     Registers a class component of the given name using the given defining function.

     This automatically initializes all `.class-name` elements on the page at `$(document).ready` timing.

     This also registers `init-class.{class-name}` event handler to `document`, which invokes the initialization of the class,
     so if you want to initialize them after `$(document).ready`, you need to trigger `init-class.{class-name}` event on the document.

     The initialization doesn't run over twice for a element.

     @param {String} className The class name
     @param {Function} definition The class definition

     See README.md for examples.
     */
    $.registerClassComponent = function (name, definingFunction) {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string');

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a string');

        }

        ccm.register(name, new ClassComponentConfiguration(name, definingFunction));


        $(document).ready(function () {

            ccm.init(name);

        });

    };



    /**
     * The main namespace for class component modules.
     */
    $.CC = $.registerClassComponent;


    /**
     * Gets or sets the promise which resolves when the initializaion of the class component is ready.
     *
     * @param {String} className The class name
     * @param {Promise} promise The promise which resolves when the init process finished
     * @return {Promise}
     */
    $.fn.classComponentReady = function (className, promise) {

        if (promise) {

            return this.data('__class_component_init_promise:' + className, promise);

        }

        return this.data('__class_component_init_promise:' + className);

    };



    /**
     ClassComponent is the utility class for class component initialization.

     @class
     */
    function ClassComponentConfiguration(className, definingFunction) {

        this.className = className;
        this.definingFunction = definingFunction;

    };

    var pt = ClassComponentConfiguration.prototype;

    /**
     @private
     @return {String}
     */
    pt.initializedClass = function () {

        return this.className + '-initialized';

    };

    /**
     Returns the selector for uninitialized class component.

     @return {String}
     */
    pt.selector = function () {

        return '.' + this.className + ':not(.' + this.initializedClass() + ')';

    };

    /**
     Marks the given element as initialized as this class component.

     @param {HTMLElement} elem
     */
    pt.markInitialized = function (elem) {

        $(elem).addClass(this.initializedClass());

    };

    /**
     Applies the defining function to the element.

     @param {HTMLElement} elem
     */
    pt.applyCustomDefinition = function (elem) {

        this.definingFunction.call(elem, $(elem));

    };

    /**
     * ClassComponentManger handles the registration and initialization of the class compoents.
     *
     * @class
     */
    var ClassComponentManager = function () {

        /**
         * @property {Object<ClassComponentConfiguration>} ccc
         */
        this.ccc = {};

    };

    var ccmPt = ClassComponentManager.prototype;

    /**
     * Registers the class component configuration for the given name.
     *
     * @param {String} name The name
     * @param {ClassComponentConfiguration} ccc The class component configuration
     */
    ccmPt.register = function (name, ccc) {

        this.ccc[name] = ccc;

    };


    /**
     * Gets the class component of the given name.
     *
     * @param {String} name The name
     * @return {ClassComponentConfiguration}
     */
    ccmPt.get = function (name) {

        return this.ccc[name];

    };

    /**
     * Initializes the class components of the given name on the given dom.
     *
     * @param {String} name The name
     * @param {HTMLElement|String} dom The dom where class componets are initialized
     * @return {Array<HTMLElement>} The elements which are initialized in this initialization
     */
    ccmPt.init = function (name, dom) {

        var ccc = this.ccc[name];

        var elements = $(ccc.selector(), dom).each(function () {

            ccc.markInitialized(this);

            ccc.applyCustomDefinition(this);

        });

        return elements.toArray();

    };

    var ccm = new ClassComponentManager();

    $.CC.register = $.registerClassComponent;

    $.CC.initClassComponent = function (name) {

        return ccm.init(name);

    };

    $.CC.__manager__ = ccm;

}(jQuery));
