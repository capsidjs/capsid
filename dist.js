(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * class-component.js v5.1.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    var reSpaces = / +/;

    var ClassComponentManager = require('./lib/ClassComponentManager');
    var ClassComponentConfiguration = require('./lib/ClassComponentConfiguration');

    /**
     Registers a class component of the given name using the given defining function.

     See README.md for details.

     @param {String} className The class name
     @param {Function} definition The class definition
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
    $.cc = registerClassComponent;
    $.cc.register = registerClassComponent;

    var ccm = $.cc.__manager__ = new ClassComponentManager();


    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Promise}
     */
    $.cc.init = function (classNames, elem) {

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces);

        }

        var elemGroups = classNames.map(function (className) {

            return ccm.init(className, elem);

        });

        return Array.prototype.concat.apply([], elemGroups);

    };

    $.cc.subclass = require('subclassjs');

}(jQuery));

},{"./lib/ClassComponentConfiguration":2,"./lib/ClassComponentManager":3,"subclassjs":4}],2:[function(require,module,exports){


var subclass = require('subclassjs');

/**
 ClassComponentConfiguration is the utility class for class component initialization.

 @class
 */
var ClassComponentConfiguration = subclass(function (pt) {

    pt.constructor = function (className, definingFunction) {

        this.className = className;
        this.definingFunction = definingFunction;

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

});

module.exports = ClassComponentConfiguration;

},{"subclassjs":4}],3:[function(require,module,exports){


var subclass = require('subclassjs');

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
     * @param {ClassComponentConfiguration} ccc The class component configuration
     */
    pt.register = function (name, ccc) {

        this.ccc[name] = ccc;

    };


    /**
     * Gets the class component of the given name.
     *
     * @param {String} name The name
     * @return {ClassComponentConfiguration}
     */
    pt.get = function (name) {

        return this.ccc[name];

    };

    /**
     * Initializes the class components of the given name on the given dom.
     *
     * @param {String} name The name
     * @param {HTMLElement|String} dom The dom where class componets are initialized
     * @return {Array<HTMLElement>} The elements which are initialized in this initialization
     * @throw {Error}
     */
    pt.init = function (name, dom) {

        var ccc = this.ccc[name];

        if (ccc == null) {

            throw new Error('Class componet "' + name + '" is not defined.');

        }

        var elements = $(ccc.selector(), dom).each(function () {

            ccc.markInitialized(this);

            ccc.applyCustomDefinition(this);

        });

        return elements.toArray();

    };

});

module.exports = ClassComponentManager;

},{"subclassjs":4}],4:[function(require,module,exports){
/**
 * subclassjs v1.3.0
 */


(function () {
    'use strict';

    /**
     * Generates a subclass with given parent class and additional class definition.
     *
     * @param {Function} parent The parent class constructor
     * @param {Function<(pt: Object, super: Object) => void>} classDefinition
     * @returns {Function}
     */
    var subclass = function (parent, classDefinition) {

        if (classDefinition == null) {

            // if there's no second argument
            // then use the first argument as class definition
            // and suppose parent is Object

            classDefinition = parent;
            parent = Object;

        }

        if (parent == null) {

            throw new Error('parent cannot be null: definingFunction=' + classDefinition.toString());

        }

        // create proxy constructor for inheritance
        var proxy = function () {};

        proxy.prototype = parent.prototype;

        var prototype = new proxy();


        // creates child's default constructor
        // this can be overwritten in classDefinition
        prototype.constructor = function () {

            proxy.prototype.constructor.apply(this, arguments);

        };


        if (typeof classDefinition === 'function') {

            // apply the given class definition
            classDefinition(prototype, parent.prototype);

        } else if (classDefinition == null) {

            // do nothing

        } else {

            throw new Error('the type of classDefinition is wrong: ' + typeof classDefinition);

        }



        // set prototype to constructor
        prototype.constructor.prototype = prototype;


        return prototype.constructor;

    };


    if (typeof module !== 'undefined' && module.exports) {

        // CommonJS
        module.exports = subclass;

    } else {

        // window export
        window.subclass = subclass;
    }

}());

},{}]},{},[1]);
