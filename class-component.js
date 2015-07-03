/**
 * class-component.js v4.0.0
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
        'use strict';

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string');

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a string');

        }

        var classComponent = new ClassComponent(name, definingFunction);

        var init = function () {

            var elements = $(classComponent.selector()).each(function () {

                classComponent.markInitialized(this);

                classComponent.applyCustomDefinition(this);

            });

            $(document).trigger(classComponent.initStartedEvent(), [elements]);

        };


        $(document).on(classComponent.initEvent(), init);

        $(document).ready(function () {

            $(document).trigger(classComponent.initEvent());

        });

    };



    /**
     * The main namespace for class component modules.
     */
    $.CC = $.registerClassComponent;


    $.CC.register = $.registerClassComponent;


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
    function ClassComponent(className, definingFunction) {

        this.className = className;
        this.definingFunction = definingFunction;

    };

    var pt = ClassComponent.prototype;


    /**
     Returns init event string.

     @return {String}
     */
    pt.initEvent = function () {

        return 'init-class.' + this.className;

    };

    pt.initStartedEvent = function () {

        return 'init-class-started.' + this.className;

    };

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

}(jQuery));
