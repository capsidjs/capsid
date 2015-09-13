/**
 * class-component.js v4.4.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    var ClassComponentManager = require('./lib/ClassComponentManager');
    var ClassComponentConfiguration = require('./lib/ClassComponentConfiguration');

    var reSpaces = / +/;

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
    var registerClassComponent = function (name, definingFunction) {

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
    $.CC = registerClassComponent;
    $.CC.register = registerClassComponent;

    var ccm = $.CC.__manager__ = new ClassComponentManager();


    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Promise}
     */
    $.CC.init = function (classNames, elem) {

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces);

        }

        var elemGroups = classNames.map(function (className) {

            return ccm.init(className, elem);

        });

        var x = [];

        return x.concat.apply(x, elemGroups);

    };

}(jQuery));
