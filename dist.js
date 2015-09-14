(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * class-component.js v5.2.0
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

},{"./lib/Actor":2,"./lib/ClassComponentConfiguration":3,"./lib/ClassComponentContext":4,"./lib/ClassComponentManager":5,"subclassjs":6}],2:[function(require,module,exports){


var subclass = require('subclassjs');

/**
 * Actor is the primary coelement on a dom. A dom is able to have only one actor.
 */
var Actor = subclass(function (pt) {

    pt.constructor = function (elem) {

        if (elem.data('__primary_coelement') != null) {

            throw new Error('actor is already set: ' + elem.data('__primary_coelement').constructor.coelementName);

        };

        elem.data('__primary_coelement', this);

    };

});


module.exports = Actor;

},{"subclassjs":6}],3:[function(require,module,exports){
(function (global){


var $ = global.jQuery;
var subclass = require('subclassjs');

/**
 ClassComponentConfiguration is the utility class for class component initialization.

 @class
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"subclassjs":6}],4:[function(require,module,exports){
(function (global){


var $ = global.jQuery;
var subclass = require('subclassjs');


/**
 * This is class component contenxt manager. This help to initialize or get colements.
 */
var ClassComponentContext = subclass(function (pt) {

    pt.constructor = function (jqObj) {

        this.jqObj = jqObj;

    };

    /**
     * Inserts the class name, initializes as the class component and returns the coelement if exists.
     *
     * @param {String} className The class name
     * @return {Object}
     */
    pt.init = function (className) {

        this.jqObj.addClass(className);

        $.cc.__manager__.initAt(className, this.jqObj);

        return this.jqObj.data('__coelement:' + className); // Could be undefined
    };

    /**
     * Gets the coelement of the given name.
     *
     * @param {String} coelementName The name of the coelement
     * @return {Object}
     */
    pt.get = function (coelementName) {

        var coelement = this.jqObj.data('__coelement:' + coelementName);

        if (!coelement) {

            throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName);

        }

        return coelement;

    };

    pt.getActor = function () {

        var actor = this.jqObj.data('__primary_coelement');

        if (!actor) {

            throw new Error('no actor on the dom: ' + this.jqObj.get(0).tagName);

        }

        return actor;

    };

});

module.exports = ClassComponentContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"subclassjs":6}],5:[function(require,module,exports){
(function (global){


var $ = global.jQuery;
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
     * Initializes the class components of the given name in the given element.
     *
     * @param {String} className The class name
     * @param {HTMLElement|String} elem The dom where class componets are initialized
     * @return {Array<HTMLElement>} The elements which are initialized in this initialization
     * @throw {Error}
     */
    pt.init = function (className, elem) {

        var ccc = this.getConfiguration(className);

        return $(ccc.selector(), elem).each(function () {

            pt.constructor.initElemByCCC(this, ccc);

        }).toArray();

    };

    /**
     * Initializes the class component of the give name at the given element.
     *
     * @param {String} className The class name
     * @param {HTMLElement} eleme The element
     */
    pt.initAt = function (className, elem) {

        var ccc = this.getConfiguration(className);

        this.constructor.initElemByCCC(elem, ccc);

    };


    /**
     * @param {HTMLElement} elem The element
     */
    pt.initAll = function (elem) {

        Object.keys(this.ccc).forEach(function (className) {

            this.init(className, elem);

        }, this);

    };

    /**
     * @static
     * @private
     * @param {HTMLElement} elem The element
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"subclassjs":6}],6:[function(require,module,exports){
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
