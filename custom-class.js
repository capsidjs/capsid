/**
 * custom-class.js v2.1.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    if (typeof $ === 'undefined') {

        throw new Error('jQuery unavailable. custom-class.js depends on jQuery. Load jQuery in global scope before this library.');

    }


    /**
     Registers a custom class of the given name using the given defining function.

     This automatically initializes all `.class-name` elements on the page at `$(document).ready` timing.

     This also registers `init-class.{class-name}` event handler to `document`, which invokes the initialization of the class,
     so if you want to initialize them after `$(document).ready`, you need to trigger `init-class.{class-name}` event on the document.

     The initialization doesn't run over twice for a element.

     @param {String} className The class name
     @param {Function} definition The class definition

     See README.md for examples.
     */
    $.registerCustomClass = function (name, definingFunction) {
        'use strict';

        if (typeof name !== 'string') {

            throw new Error('`name` of a custom class has to be a string');

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a custom class has to be a string');

        }

        var customClass = new CustomClass(name, definingFunction);

        var init = function () {

            var elements = $(customClass.selector()).each(function () {

                customClass.markInitialized(this);

                customClass.applyCustomDefinition(this);

            });

            $(document).trigger(customClass.initStartedEvent(), [elements]);

        };


        $(document).on(customClass.initEvent(), init);

        $(document).ready(function () {

            $(document).trigger(customClass.initEvent());

        });

    };


    /**
     * Gets or sets the promise which resolves when the initializaion of the custom class is ready.
     *
     * @param {String} className The class name
     * @param {Promise} promise The promise which resolves when the init process finished
     * @return {Promise}
     */
    $.fn.customClassReady = function (className, promise) {

        return this.data('__custom_class_init_promise:' + className, promise);

    };



    /**
     CustomClass is the utility class for custom class initialization.

     @class
     */
    function CustomClass(className, definingFunction) {

        this.className = className;
        this.definingFunction = definingFunction;

    };

    var pt = CustomClass.prototype;


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
     Returns the selector for uninitialized custom class.

     @return {String}
     */
    pt.selector = function () {

        return '.' + this.className + ':not(.' + this.initializedClass() + ')';

    };

    /**
     Marks the given element as initialized as this custom class.

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

}(window.jQuery));
