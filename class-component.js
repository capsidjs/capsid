/**
 * class-component.js v5.1.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    var reSpaces = / +/;

    var Actor = require('./lib/Actor');
    var subclass = require('subclassjs');

    var ClassComponentManager = require('./lib/ClassComponentManager');
    var ClassComponentContext = require('./lib/ClassComponentContext');
    var ClassComponentConfiguration = require('./lib/ClassComponentConfiguration');

    /**
     * The main namespace for class component module.
     */
    var cc = {};

    cc.__manager__ = new ClassComponentManager();

    /**
     Registers a class component of the given name using the given defining function.

     See README.md for details.

     @param {String} className The class name
     @param {Function} definition The class definition
     */
    cc.register = function (name, definingFunction) {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string');

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a function');

        }

        cc.__manager__.register(name, new ClassComponentConfiguration(name, definingFunction));


        $(document).ready(function () {

            cc.__manager__.init(name);

        });

    };


    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {HTMLElement[]}
     */
    cc.init = function (classNames, elem) {

        if (classNames == null) {

            cc.__manager__.initAll(elem);

            return;

        }

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces);

        }

        classNames.map(function (className) {

            return cc.__manager__.init(className, elem);

        });

    };


    /**
     * Assign a class as the accompanying coelement of the class component
     *
     * @param {String} className
     * @param {Function} DefiningClass
     */
    cc.assign = function (className, DefiningClass) {

        DefiningClass.coelementName = className;

        cc.register(className, function (elem) {

            var coelement = new DefiningClass(elem);

            elem.data('__coelement:' + DefiningClass.coelementName, coelement);

        });

    };


    // Defines the special property cc on a jquery property.
    Object.defineProperty($.fn, 'cc', {

        get: function () {

            var ctx = this.data('__class_component_context__');

            if (!ctx) {

                ctx = new ClassComponentContext(this);

                this.data('__class_component_context__', ctx);

            }

            return ctx;

        },

        enumerable: false,
        configurable: false

    });

    // Exports subclass.
    cc.subclass = subclass;

    // Exports Actor.
    cc.Actor = Actor;

    // Exports the main namespace
    $.cc = cc;

}(jQuery));
