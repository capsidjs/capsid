(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ListenerInfo = require('./listener-info');

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 * @param {string} selector The selector for listening. When null is passed, the listener listens on the root element of the component.
 * @param {object} prototype The prototype of the coelement class
 * @param {string} name The name of the method
 */
var event = function event(_event, selector) {
  return function (prototype, name) {
    var method = prototype[name];

    method.__events__ = method.__events__ || [];

    method.__events__.push(new ListenerInfo(_event, selector, method));
  };
};

/**
 * The decorator to prepend and append event trigger.
 * @param {string} start The event name when the method started
 * @param {string} end The event name when the method finished
 * @param {string} error the event name when the method errored
 */
var trigger = function trigger(start, end, error) {
  return function (prototype, name) {
    var method = prototype[name];

    prototype[name] = function () {
      var _this = this;

      if (start != null) {
        this.elem.trigger(start);
      }

      var result = method.apply(this, arguments);

      var promise = Promise.resolve(result);

      if (end != null) {
        promise.then(function () {
          return _this.elem.trigger(end);
        });
      }

      if (error != null) {
        promise.catch(function () {
          return _this.elem.trigger(error);
        });
      }

      return result;
    };
  };
};

exports.event = event;
exports.trigger = trigger;

},{"./listener-info":8}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 */

var ClassComponentConfiguration = function () {
  /**
   * @param {String} className The class name
   * @param {Function} Constructor The constructor of the coelement of the class component
   */

  function ClassComponentConfiguration(className, Constructor) {
    _classCallCheck(this, ClassComponentConfiguration);

    this.className = className;
    this.Constructor = Constructor;

    this.ProxyConstructor = function () {};
    this.ProxyConstructor.prototype = Constructor.prototype;
  }

  /**
   * Gets the initialized class name.
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
     * @private
     * @param {jQuery} elem
     */

  }, {
    key: 'applyCustomDefinition',
    value: function applyCustomDefinition(elem) {
      var coelem = new this.ProxyConstructor();

      coelem.elem = elem; // Injects elem at this.elem

      this.getAllListenerInfo().forEach(function (listenerInfo) {
        return listenerInfo.bindTo(elem, coelem);
      });

      this.Constructor.call(coelem, elem); // Simulates the constructor call

      elem.data('__coelement:' + this.className, coelem);
    }

    /**
     * Gets the list of the event-decorated handlers.
     * @private
     * @return {Function[]}
     */

  }, {
    key: 'getHandlers',
    value: function getHandlers() {
      var prototype = this.Constructor.prototype;

      return Object.getOwnPropertyNames(prototype).map(function (key) {
        return prototype[key];
      }).filter(ClassComponentConfiguration.isHandler);
    }

    /**
     * Gets all the listener info of the coelement.
     * @return {ListenerInfo[]}
     */

  }, {
    key: 'getAllListenerInfo',
    value: function getAllListenerInfo() {
      return [].concat.apply([], this.getHandlers().map(function (handler) {
        return handler.__events__;
      }));
    }

    /**
     * Returns true when the given property is an event handler.
     * @param {object} property The property
     * @return {boolean}
     */

  }, {
    key: 'initElem',


    /**
     * Initialize the element by the configuration.
     * @public
     * @param {jQuery} elem The element
     */
    value: function initElem(elem) {
      this.markInitialized(elem);
      this.applyCustomDefinition(elem);
    }
  }], [{
    key: 'isHandler',
    value: function isHandler(property) {
      return typeof property === 'function' && property.__events__ != null;
    }
  }]);

  return ClassComponentConfiguration;
}();

module.exports = ClassComponentConfiguration;

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

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
  }]);

  return ClassComponentContext;
}();

module.exports = ClassComponentContext;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = global.jQuery;

var ClassComponentConfiguration = require('./class-component-configuration');

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
   * @param {Function} Constructor The constructor of the class component
   */


  _createClass(ClassComponentManager, [{
    key: 'register',
    value: function register(name, Constructor) {

      Constructor.coelementName = name;

      this.ccc[name] = new ClassComponentConfiguration(name, Constructor);
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

module.exports = ClassComponentManager;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./class-component-configuration":2}],5:[function(require,module,exports){
'use strict';

/**
 * class-component.js v7.0.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
var $ = jQuery;

var reSpaces = / +/;

var Coelement = require('./coelement');
var ClassComponentManager = require('./class-component-manager');
var event = require('./cc-event').event;
var trigger = require('./cc-event').trigger;

/**
 * Initializes the module object.
 *
 * @return {Object}
 */
function initializeModule() {

  require('./fn.cc');

  var __manager__ = new ClassComponentManager();

  /**
   * The main namespace for class component module.
   * Registers a class component of the given name using the given defining function.
   * @param {String} name The class name
   * @param {Function} Constructor The class definition
   */
  var cc = function cc(name, Constructor) {
    if (typeof name !== 'string') {

      throw new Error('`name` of a class component has to be a string');
    }

    if (typeof Constructor !== 'function') {

      throw new Error('`Constructor` of a class component has to be a function');
    }

    __manager__.register(name, Constructor);

    $(document).ready(function () {

      __manager__.init(name);
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

      __manager__.initAll(elem);

      return;
    }

    if (typeof classNames === 'string') {

      classNames = classNames.split(reSpaces);
    }

    return classNames.map(function (className) {
      return __manager__.init(className, elem);
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
   * The above is the same as `$.cc.assign('foo', Foo)`
   *
   * @param {String} className The class name
   * @return {Function}
   */
  cc.component = function (className) {
    return function (Cls) {
      return cc(className, Cls);
    };
  };

  // Exports __manager__
  cc.__manager__ = __manager__;

  // Exports Actor.
  cc.Coelement = Coelement;

  // Exports event decorator
  cc.event = event;

  // Exports trigger decorator
  cc.trigger = trigger;

  return cc;
}

// If the cc is not set, then create one.
if ($.cc == null) {

  $.cc = initializeModule();
}

module.exports = $.cc;

},{"./cc-event":1,"./class-component-manager":4,"./coelement":6,"./fn.cc":7}],6:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Coelement is the dual of element (usual dom). Its instance accompanies an element and forms a Dom Component together with it.
 */

var Coelement =
/**
 * @param {jQuery} elem The jquery element
 */
function Coelement(elem) {
  _classCallCheck(this, Coelement);

  this.elem = elem;
};

module.exports = Coelement;

},{}],7:[function(require,module,exports){
'use strict';

var ClassComponentContext = require('./class-component-context');

var CLASS_COMPONENT_DATA_KEY = '__class_component_data__';

// Defines the special property cc on a jquery property.
Object.defineProperty(jQuery.fn, 'cc', {
  get: function get() {
    var cc = this.data(CLASS_COMPONENT_DATA_KEY);

    if (cc) {
      return cc;
    }

    var ctx = new ClassComponentContext(this);

    cc = function cc(classNames) {
      return ctx.up(classNames);
    };

    cc.get = function (className) {
      return ctx.get(className);
    };
    cc.init = function (className) {
      return ctx.init(className);
    };

    this.data(CLASS_COMPONENT_DATA_KEY, cc);

    return cc;
  },


  enumerable: false,
  configurable: false

});

},{"./class-component-context":3}],8:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The event listener's information.
 */

var ListenerInfo = function () {
  /**
   * @param {string} event The event name to bind
   * @param {string} selector The selector to bind the listener
   * @param {Function} handler The handler for the event
   */

  function ListenerInfo(event, selector, handler) {
    _classCallCheck(this, ListenerInfo);

    this.event = event;
    this.selector = selector;
    this.handler = handler;
  }

  /**
   * Binds the listener to the given element with the given coelement.
   * @param {jQuery} elem The jquery element
   * @param {object} coelem The coelement which is bound to the element
   */


  _createClass(ListenerInfo, [{
    key: "bindTo",
    value: function bindTo(elem, coelem) {
      var handler = this.handler;

      elem.on(this.event, this.selector, function () {
        handler.apply(coelem, arguments);
      });
    }
  }]);

  return ListenerInfo;
}();

module.exports = ListenerInfo;

},{}]},{},[5]);
