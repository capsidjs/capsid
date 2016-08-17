(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = function (camelString) {
  return camelString.replace(/[A-Z]/g, function (c) {
    return '-' + c.toLowerCase();
  }).replace(/^-/, '');
};

},{}],2:[function(require,module,exports){
'use strict';

/**
 * ClassComponentConfiguration is the utility class for class component initialization.
 * @param {String} className The class name
 * @param {Function} Constructor The constructor of the coelement of the class component
 */
module.exports = function (className, Constructor) {
  this.className = className;
  this.Constructor = Constructor;
  this.initClass = className + '-initialized';
  this.selector = '.' + className + ':not(.' + this.initClass + ')';
};

var prototype = module.exports.prototype;

/**
 * Applies the defining function to the element.
 * @private
 * @param {jQuery} elem
 */
prototype.applyCustomDefinition = function (elem) {
  var coelem = new this.Constructor(elem);

  if (typeof coelem.__cc_init__ === 'function') {
    coelem.__cc_init__(elem);
  } else {
    coelem.elem = elem;
  }

  this.getAllListenerInfo().forEach(function (listenerInfo) {
    return listenerInfo.bindTo(elem, coelem);
  });

  elem.data('__coelement:' + this.className, coelem);
};

/**
 * Gets all the listener info of the coelement.
 * @private
 * @return {ListenerInfo[]}
 */
prototype.getAllListenerInfo = function () {
  return this.Constructor.__events__ || [];
};

/**
 * Initialize the element by the configuration.
 * @public
 * @param {jQuery} elem The element
 */
prototype.initElem = function (elem) {
  if (!elem.hasClass(this.initClass)) {
    elem.addClass(this.initClass);
    this.applyCustomDefinition(elem);
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var $ = jQuery;

/**
 * This is class component contenxt manager class. This help to initialize and get colements.
 * @param {jQuery} jqObj jQuery object of a dom selection
 */
module.exports = function (jqObj) {
  this.jqObj = jqObj;
};

var prototype = module.exports.prototype;

/**
 * Initializes the element if it has registered class component names. Returns the jquery object itself.
 * @param {string} [classNames] The class name.
 * @return {jQuery}
 */
prototype.up = function (classNames) {
  var __manager__ = $.cc.__manager__;
  var jqObj = this.jqObj;

  if (classNames) {
    classNames.split(/\s+/).forEach(function (className) {
      jqObj.addClass(className); // adds the class name

      __manager__.initAt(className, jqObj); // init as the class-component
    });
  } else {
      // Initializes anything it already has.
      __manager__.initAllAtElem(jqObj);
    }

  return jqObj;
};

/**
 * Gets the coelement of the given name.
 * @param {String} coelementName The name of the coelement
 * @return {Object}
 */
prototype.get = function (coelementName) {
  var jqObj = this.jqObj;
  var coelement = jqObj.data('__coelement:' + coelementName);

  if (coelement) {
    return coelement;
  }

  if (jqObj[0]) {
    throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + jqObj[0].tagName);
  }

  throw new Error('coelement "' + coelementName + '" unavailable at empty dom selection');
};

},{}],4:[function(require,module,exports){
'use strict';

var $ = jQuery;

var ClassComponentConfiguration = require('./class-component-configuration');

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 */
module.exports = {
  /**
   * @property {Object<ClassComponentConfiguration>} ccc
   */
  ccc: {},

  /**
   * Registers the class component configuration for the given name.
   * @param {String} name The name
   * @param {Function} Constructor The constructor of the class component
   */
  register: function register(name, Constructor) {
    Constructor.coelementName = name;

    this.ccc[name] = new ClassComponentConfiguration(name, Constructor);
  },


  /**
   * Initializes the class components of the given name in the given element.
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
   * @return {Array<HTMLElement>} The elements which are initialized in this initialization
   * @throw {Error}
   */
  init: function init(className, elem) {
    var ccc = this.getConfiguration(className);

    return $(ccc.selector, elem).each(function () {
      ccc.initElem($(this));
    }).toArray();
  },


  /**
   * Initializes the class component of the give name at the given element.
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The element
   */
  initAt: function initAt(className, elem) {
    this.getConfiguration(className).initElem($(elem));
  },


  /**
   * Initializes all the class component at the element.
   * @param {jQuery} elem jQuery selection of doms
   */
  initAllAtElem: function initAllAtElem(elem) {
    var _this = this;

    var classes = elem[0].className;

    if (classes) {
      classes.split(/\s+/).filter(function (className) {
        return _this.ccc[className];
      }).forEach(function (className) {
        return _this.initAt(className, elem);
      });
    }
  },


  /**
   * @param {jQuery|HTMLElement|String} elem The element
   */
  initAll: function initAll(elem) {
    var _this2 = this;

    Object.keys(this.ccc).forEach(function (className) {
      _this2.init(className, elem);
    });
  },


  /**
   * Gets the configuration of the given class name.
   * @param {String} className The class name
   * @return {ClassComponentConfiguration}
   * @throw {Error}
   */
  getConfiguration: function getConfiguration(className) {
    var ccc = this.ccc[className];

    if (ccc) {
      return ccc;
    }
    throw new Error('Class componet "' + className + '" is not defined.');
  }
};

},{"./class-component-configuration":2}],5:[function(require,module,exports){
'use strict';

/**
 * class-component.js v10.4.1
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
var $ = jQuery;

var camelToKebab = require('./camel-to-kebab');
var decorators = require('./decorators');

/**
 * Initializes the module object.
 *
 * @return {Object}
 */
function initializeModule() {
  require('./fn.cc');

  var __manager__ = require('./class-component-manager');

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
      classNames = classNames.split(/ +/);
    }

    return classNames.map(function (className) {
      return __manager__.init(className, elem);
    });
  };

  /**
   * The decorator for class component registration.
   * @param {String|Function} name The class name or the implementation class itself
   * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
   */
  cc.component = function (name) {
    if (typeof name === 'function') {
      // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
      cc(camelToKebab(name.name), name);
    }

    return function (Cls) {
      return cc(name, Cls);
    };
  };

  // Exports __manager__
  cc.__manager__ = __manager__;

  // Exports decorators
  cc.on = decorators.on;
  cc.emit = decorators.emit;
  cc.wire = decorators.wire;

  return cc;
}

// If the cc is not set, then create one.
if ($.cc == null) {
  $.cc = initializeModule();
}

module.exports = $.cc;

},{"./camel-to-kebab":1,"./class-component-manager":4,"./decorators":6,"./fn.cc":7}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var ListenerInfo = require('./listener-info');
var camelToKebab = require('./camel-to-kebab');

/**
 * @param {Function} constructor The constructor
 * @param {string} key The key of handler method
 * @param {string} event The event name
 * @param {string} selector The selector
 */
var registerListenerInfo = function registerListenerInfo(constructor, key, event, selector) {
  constructor.__events__ = constructor.__events__ || [];

  constructor.__events__.push(new ListenerInfo(event, selector, key));
};

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 */
var on = function on(event) {
  var onDecorator = function onDecorator(target, key, descriptor) {
    registerListenerInfo(target.constructor, key, event);
  };

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} selector The selector for listening.
   */
  onDecorator.at = function (selector) {
    return function (target, key, descriptor) {
      registerListenerInfo(target.constructor, key, event, selector);
    };
  };

  return onDecorator;
};

/**
 * `@emit(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param {string} event The event name
 */
var emit = function emit(event) {
  var emitDecorator = function emitDecorator(target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      this.elem.trigger(event, arguments);

      method.apply(this, arguments);
    };
  };

  /**
   * `@emit(event).first` decorator. This is the same as emit()
   * @param {string} event The event name
   */
  emitDecorator.first = emitDecorator;

  /**
   * `@emit(event).last` decorator.
   * This adds the emission of the event at the end of the method.
   * @param {string} event The event name
   */
  emitDecorator.last = function (target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      var _this = this;

      var result = method.apply(this, arguments);

      if (result != null && typeof result.then === 'function') {
        Promise.resolve(result).then(function (x) {
          return _this.elem.trigger(event, x);
        });
      } else {
        this.elem.trigger(event, result);
      }

      return result;
    };
  };

  return emitDecorator;
};

/**
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param {string} name The class component name
 * @param {string} [selector] The selector to access class component dom. Optional. Default is '.[name]'.
 * @param {object} target The prototype of the target class
 * @param {string} key The name of the property
 * @param {object} descriptor The property descriptor
 */
var wireByNameAndSelector = function wireByNameAndSelector(name, selector) {
  return function (target, key, descriptor) {
    selector = selector || '.' + name;

    descriptor.get = function () {
      var matched = this.elem.filter(selector).add(selector, this.elem);

      if (matched.length > 1) {
        console.warn('There are ' + matched.length + ' matches for the given wired getter selector: ' + selector);
      }

      return matched.cc.get(name);
    };
  };
};

/**
 * Wires the class component of the name of the key to the property of the same name.
 */
var wire = function wire(target, key, descriptor) {
  if ((typeof descriptor === 'undefined' ? 'undefined' : _typeof(descriptor)) !== 'object') {
    var name = target;
    var selector = key;

    return wireByNameAndSelector(name, selector);
  }

  wireByNameAndSelector(camelToKebab(key))(target, key, descriptor);
};

exports.on = on;
exports.emit = emit;
exports.wire = wire;

},{"./camel-to-kebab":1,"./listener-info":8}],7:[function(require,module,exports){
'use strict';

var ClassComponentContext = require('./class-component-context');

var CLASS_COMPONENT_DATA_KEY = '__class_component_data__';

// Defines the special property cc on the jquery prototype.
Object.defineProperty(jQuery.fn, 'cc', {
  get: function get() {
    var _this = this;

    var cc = this.data(CLASS_COMPONENT_DATA_KEY);

    if (!cc) {
      (function () {
        var ctx = new ClassComponentContext(_this);

        cc = function cc(classNames) {
          return ctx.up(classNames);
        };

        cc.get = function (className) {
          return ctx.get(className);
        };
        cc.init = function (className) {
          cc(className);
          return cc.get(className);
        };

        _this.data(CLASS_COMPONENT_DATA_KEY, cc);
      })();
    }

    return cc;
  }
});

},{"./class-component-context":3}],8:[function(require,module,exports){
"use strict";

/**
 * The event listener's information model.
 * @param {string} event The event name to bind
 * @param {string} selector The selector to bind the listener
 * @param {string} key The handler name
 */
module.exports = function (event, selector, key) {
  this.event = event;
  this.selector = selector;
  this.key = key;
};

/**
 * Binds the listener to the given element with the given coelement.
 * @param {jQuery} elem The jquery element
 * @param {object} coelem The coelement which is bound to the element
 */
module.exports.prototype.bindTo = function (elem, coelem) {
  var key = this.key;

  elem.on(this.event, this.selector, function () {
    coelem[key].apply(coelem, arguments);
  });
};

},{}]},{},[5]);
