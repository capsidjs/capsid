/**
 * custom-class.js v1.0.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    if (typeof $ === 'undefined') {

        console.log('error: jQuery unavailable');
        console.log('custom-class.js depends on jQuery. load jQuery in global scope before this library.');

        return;

    }


    /**
     Registers a custom class of the given name using the given defining function.

     This automatically initializes all `.class-name` elements on the page at `$(document).ready` timing.

     This also registers `init.class-name` event handler to `document`, which invokes the initialization of the class,
     so if you want to initialize them after `$(document).ready`, you need to trigger `init.class-name` event on the document.

     The initialization doesn't run over twice for a element.

     @param {String} className The class name
     @param {Function} definition The class definition

     @example

        $.registerCustomClass('go-to-example-com', function () {

            $(this).click(function () {

                location.href = 'http://example.com/';

            });

        });

        // <div class="go-to-example-com">...</div>
        //
        // When you click the above div, the page go to the example.com
         

     @example

        $.registerCustomClass('my-anchor', function () {

            var self = $(this); //

            self.on('click', function () {

                location.href = $(this).attr('href');

            });

            self.on('mouseover', function () {

                $(this).addClass('hover');

            });

            self.on('mouseout', function () {

                $(this).removeClass('hover');

            });

        });

        // `.my-anchor` is similar to <a>
        //
        // <div class="my-anchor" href="https://www.google.com/">...</div>
        // 
        // When you click the above, the page goes to href's url (https://www.google.com/ in this case).
        // When you mouse over the above it gets `.hover` class.

     */
    $.registerCustomClass = function (name, definingFunction) {
        'use strict';

        var customClass = new CustomClass(name, definingFunction);

        var init = function () {

            $(customClass.selector()).each(function () {

                customClass.markInitialized(this);

                customClass.applyCustomDefinition(this);

            });

        };


        $(document).on(customClass.initEvent(), init);

        $(document).ready(function () {

            $(document).trigger(customClass.initEvent());

        });

    };



    /**
     CustomClass is the utility class for custom class initialization.
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

        return 'init.' + this.className;

    }

    /**
     @private
     @return {String}
     */
    pt.initializedClass = function () {

        return this.className + '-initialized';

    }

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

        this.definingFunction.call(elem)

    };

}(window.jQuery));
