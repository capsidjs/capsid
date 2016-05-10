(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _coelement = require('./coelement');

var _coelement2 = _interopRequireDefault(_coelement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Actor is the primary coelement on a dom. A dom is able to have only one actor.
 */

var Actor = function (_Coelement) {
    _inherits(Actor, _Coelement);

    function Actor(elem) {
        _classCallCheck(this, Actor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Actor).call(this, elem));

        if (elem.data('__primary_coelement') != null) {

            throw new Error('actor is already set: ' + elem.data('__primary_coelement').constructor.coelementName);
        }

        elem.data('__primary_coelement', _this);

        return _this;
    }

    return Actor;
}(_coelement2.default);

exports.default = Actor;

},{"./coelement":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 */

var ClassComponentConfiguration = function () {

  /**
   * @param {String} className The class name
   * @param {Function} definingFunction The defining function
   */

  function ClassComponentConfiguration(className, definingFunction) {
    _classCallCheck(this, ClassComponentConfiguration);

    this.className = className;
    this.definingFunction = definingFunction;
  }

  /**
   * @private
   * @return {String}
   */


  _createClass(ClassComponentConfiguration, [{
    key: 'initializedClass',
    value: function initializedClass() {

      return this.className + '-initialized';
    }

    /**
     * Returns the selector for uninitialized class component.
     *
     * @public
     * @return {String}
     */

  }, {
    key: 'selector',
    value: function selector() {

      return '.' + this.className + ':not(.' + this.initializedClass() + ')';
    }

    /**
     * Marks the given element as initialized as this class component.
     *
     * @private
     * @param {jQuery} elem
     */

  }, {
    key: 'markInitialized',
    value: function markInitialized(elem) {

      elem.addClass(this.initializedClass());
    }

    /**
     * Applies the defining function to the element.
     *
     * @private
     * @param {jQuery} elem
     */

  }, {
    key: 'applyCustomDefinition',
    value: function applyCustomDefinition(elem) {

      this.definingFunction(elem);
    }

    /**
     * Initialize the element by the configuration.
     *
     * @public
     * @param {jQuery} elem The element
     */

  }, {
    key: 'initElem',
    value: function initElem(elem) {

      this.markInitialized(elem);
      this.applyCustomDefinition(elem);
    }
  }]);

  return ClassComponentConfiguration;
}();

exports.default = ClassComponentConfiguration;

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = global.jQuery;

/**
 * This is class component contenxt manager. This help to initialize or get colements.
 */

var ClassComponentContext = function () {
    function ClassComponentContext(jqObj) {
        _classCallCheck(this, ClassComponentContext);

        this.jqObj = jqObj;
    }

    /**
     * Inserts the class name, initializes as the class component and returns the coelement if exists.
     *
     * @param {String} className The class name
     * @return {Object}
     */


    _createClass(ClassComponentContext, [{
        key: 'init',
        value: function init(className) {

            this.jqObj.addClass(className);

            $.cc.__manager__.initAt(className, this.jqObj);

            return this.jqObj.data('__coelement:' + className);
        }

        /**
         * Initializes the element if it has registered class component names. Returns the jquery object itself.
         *
         * @param {string} [classNames] The class name.
         * @return {jQuery}
         */

    }, {
        key: 'up',
        value: function up(classNames) {
            var _this = this;

            if (classNames != null) {

                classNames.split(/\s+/).forEach(function (className) {

                    $.cc.__manager__.initAt(className, _this.jqObj);
                });
            } else {

                // Initializes anything it already has.
                $.cc.__manager__.initAllAtElem(this.jqObj);
            }

            return this.jqObj;
        }

        /**
         * Gets the coelement of the given name.
         *
         * @param {String} coelementName The name of the coelement
         * @return {Object}
         */

    }, {
        key: 'get',
        value: function get(coelementName) {

            var coelement = this.jqObj.data('__coelement:' + coelementName);

            if (coelement) {

                return coelement;
            }

            if (this.jqObj.length === 0) {

                throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection');
            }

            throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName);
        }

        /**
         * Gets the actor class. Actor class is the special Coelement which is labeled as `actor`. A dom has only one actor Coelement.
         */

    }, {
        key: 'getActor',
        value: function getActor() {

            var actor = this.jqObj.data('__primary_coelement');

            if (!actor) {

                throw new Error('no actor on the dom: ' + this.jqObj.get(0).tagName);
            }

            return actor;
        }
    }]);

    return ClassComponentContext;
}();

exports.default = ClassComponentContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classComponentConfiguration = require('./class-component-configuration');

var _classComponentConfiguration2 = _interopRequireDefault(_classComponentConfiguration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = global.jQuery;

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 */

var ClassComponentManager = function () {
    function ClassComponentManager() {
        _classCallCheck(this, ClassComponentManager);

        /**
         * @property {Object<ClassComponentConfiguration>} ccc
         */
        this.ccc = {};
    }

    /**
     * Registers the class component configuration for the given name.
     *
     * @param {String} name The name
     * @param {Function} ccc The class component configuration
     */


    _createClass(ClassComponentManager, [{
        key: 'register',
        value: function register(name, definingFunction) {

            this.ccc[name] = new _classComponentConfiguration2.default(name, definingFunction);
        }

        /**
         * Initializes the class components of the given name in the given element.
         *
         * @param {String} className The class name
         * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
         * @return {Array<HTMLElement>} The elements which are initialized in this initialization
         * @throw {Error}
         */

    }, {
        key: 'init',
        value: function init(className, elem) {

            var ccc = this.getConfiguration(className);

            return $(ccc.selector(), elem).each(function () {

                ccc.initElem($(this));
            }).toArray();
        }

        /**
         * Initializes the class component of the give name at the given element.
         *
         * @param {String} className The class name
         * @param {jQuery|HTMLElement|String} elem The element
         */

    }, {
        key: 'initAt',
        value: function initAt(className, elem) {

            var ccc = this.getConfiguration(className);

            ccc.initElem($(elem));
        }

        /**
         * Initializes all the class component at the element.
         *
         * @param {HTMLElement}
         */

    }, {
        key: 'initAllAtElem',
        value: function initAllAtElem(elem) {
            var _this = this;

            var classes = $(elem).attr('class');

            if (!classes) {
                return;
            }

            classes.split(/\s+/).map(function (className) {
                return _this.ccc[className];
            }).filter(function (ccc) {
                return ccc;
            }).forEach(function (ccc) {
                return ccc.initElem(elem);
            });
        }

        /**
         * @param {jQuery|HTMLElement|String} elem The element
         */

    }, {
        key: 'initAll',
        value: function initAll(elem) {
            var _this2 = this;

            Object.keys(this.ccc).forEach(function (className) {

                _this2.init(className, elem);
            });
        }

        /**
         * Gets the configuration of the given class name.
         *
         * @param {String} className The class name
         * @return {ClassComponentConfiguration}
         * @throw {Error}
         */

    }, {
        key: 'getConfiguration',
        value: function getConfiguration(className) {

            var ccc = this.ccc[className];

            if (ccc == null) {

                throw new Error('Class componet "' + className + '" is not defined.');
            }

            return ccc;
        }
    }]);

    return ClassComponentManager;
}();

exports.default = ClassComponentManager;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./class-component-configuration":2}],5:[function(require,module,exports){
'use strict';

var _actor = require('./actor');

var _actor2 = _interopRequireDefault(_actor);

var _coelement = require('./coelement');

var _coelement2 = _interopRequireDefault(_coelement);

var _classComponentManager = require('./class-component-manager');

var _classComponentManager2 = _interopRequireDefault(_classComponentManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * class-component.js v5.7.2
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
var $ = jQuery;

var reSpaces = / +/;

/**
 * Initializes the module object.
 *
 * @return {Object}
 */
function initializeModule() {

    require('./fn.cc');

    /**
     * The main namespace for class component module.
     */
    var cc = {};

    cc.__manager__ = new _classComponentManager2.default();

    /**
     Registers a class component of the given name using the given defining function.
      See README.md for details.
      @param {String} className The class name
     @param {Function} definingFunction The class definition
     */
    cc.register = function (name, definingFunction) {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string');
        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a function');
        }

        cc.__manager__.register(name, definingFunction);

        $(document).ready(function () {

            cc.__manager__.init(name);
        });
    };

    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Object<HTMLElement[]>}
     */
    cc.init = function (classNames, elem) {

        if (classNames == null) {

            cc.__manager__.initAll(elem);

            return;
        }

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces);
        }

        return classNames.map(function (className) {
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

    /**
     * The decorator for class assignment.
     *
     * @example
     *   @$.cc.component('foo')
     *   class Foo extends Bar {
     *     ...
     *   }
     *
     * The above is the same as:
     *
     * @example
     *   class Foo extends Bar {
     *   }
     *
     *   $.cc.assign('foo', Foo)
     *
     * @param {String} className The class name
     * @return {Function}
     */
    cc.component = function (className) {
        return function (Cls) {
            return cc.assign(className, Cls);
        };
    };

    // Exports Actor.
    cc.Actor = _actor2.default;

    // Exports Actor.
    cc.Coelement = _coelement2.default;

    return cc;
}

// If the cc is not set, then create one.
if ($.cc == null) {

    $.cc = initializeModule();
}

module.exports = $.cc;

},{"./actor":1,"./class-component-manager":4,"./coelement":6,"./fn.cc":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Coelement is the dual of element (usual dom). Its instance accompanies an element and forms a Dom Component together with it.
 */

var Coelement = function Coelement(elem) {
    _classCallCheck(this, Coelement);

    this.elem = elem;
};

exports.default = Coelement;

},{}],7:[function(require,module,exports){
'use strict';

var _classComponentContext = require('./class-component-context');

var _classComponentContext2 = _interopRequireDefault(_classComponentContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Defines the special property cc on a jquery property.
Object.defineProperty(jQuery.fn, 'cc', {

    get: function get() {

        var ctx = this.data('__class_component_context__');

        if (!ctx) {

            ctx = new _classComponentContext2.default(this);

            this.data('__class_component_context__', ctx);
        }

        return ctx;
    },

    enumerable: false,
    configurable: false

});

},{"./class-component-context":3}]},{},[5]);
