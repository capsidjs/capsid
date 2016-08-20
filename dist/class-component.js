'use strict';

(function () {
  'use strict';

  /**
   * The event listener's information model.
   * @param {string} event The event name to bind
   * @param {string} selector The selector to bind the listener
   * @param {string} key The handler name
   */

  function ListenerInfo(event, selector, key) {
    this.event = event;
    this.selector = selector;
    this.key = key;
  }

  /**
   * Binds the listener to the given element with the given coelement.
   * @param {jQuery} elem The jquery element
   * @param {object} coelem The coelement which is bound to the element
   */
  ListenerInfo.prototype.bindTo = function (elem, coelem) {
    var key = this.key;

    elem.on(this.event, this.selector, function () {
      coelem[key].apply(coelem, arguments);
    });
  };

  var camelToKebab = function camelToKebab(camelString) {
    return camelString.replace(/[A-Z]/g, function (c) {
      return '-' + c.toLowerCase();
    }).replace(/^-/, '');
  };

  /**
   * @param {Function} constructor The constructor
   * @param {string} key The key of handler method
   * @param {string} event The event name
   * @param {string} selector The selector
   */
  var registerListenerInfo = function registerListenerInfo(constructor, key, event, selector) {
    (constructor.__events__ = constructor.__events__ || []).push(new ListenerInfo(event, selector, key));
  };

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   */
  var on = function on(event) {
    var onDecorator = function onDecorator(target, key) {
      registerListenerInfo(target.constructor, key, event);
    };

    /**
     * The decorator for registering event listener info to the method.
     * @param {string} event The event name
     * @param {string} selector The selector for listening.
     */
    onDecorator.at = function (selector) {
      return function (target, key) {
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

        if (result && result.then) {
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

        if (matched[1]) {
          // meaning matched.length > 1
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
    if (!descriptor) {
      // If the descriptor is not given, then suppose this is called as @wire(componentName, selector) and therefore
      // we need to return the following expression (it works as another decorator).
      return wireByNameAndSelector(target, key);
    }

    wireByNameAndSelector(camelToKebab(key))(target, key, descriptor);
  };

  var $ = jQuery;

  var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
  var reSpaces = /\s+/;

  /**
   * ClassComponentConfiguration is the utility class for class component initialization.
   * @param {String} className The class name
   * @param {Function} Constructor The constructor of the coelement of the class component
   */
  function ClassComponentConfiguration(className, Constructor) {
    this.name = className;
    this.Constructor = Constructor;
    var initClass = className + '-initialized';
    this.selector = '.' + className + ':not(.' + initClass + ')';

    /**
     * Initialize the element by the configuration.
     * @public
     * @param {jQuery} elem The element
     */
    this.initElem = function (elem) {
      if (!elem.hasClass(initClass)) {
        initializeClassComponent(elem.addClass(initClass), className, Constructor);
      }
    };
  }

  /**
   * Initializes the class component
   * @param {jQuery} elem The element
   * @param {string} name The component name
   * @param {Function} Constructor The constructor of coelement
   */
  var initializeClassComponent = function initializeClassComponent(elem, name, Constructor) {
    var coelem = new Constructor(elem);

    if ($.isFunction(coelem.__cc_init__)) {
      coelem.__cc_init__(elem);
    } else {
      coelem.elem = elem;
    }

    getAllListenerInfo(Constructor).forEach(function (listenerInfo) {
      listenerInfo.bindTo(elem, coelem);
    });

    elem.data(COELEMENT_DATA_KEY_PREFIX + name, coelem);
  };

  /**
   * Gets all the listener info of the coelement.
   * @private
   * @return {ListenerInfo[]}
   */
  var getAllListenerInfo = function getAllListenerInfo(Constructor) {
    return Constructor.__events__ || [];
  };

  function assert(assertion, message) {
    if (!assertion) {
      throw new Error(message);
    }
  }

  /**
   * @property {Object<ClassComponentConfiguration>} ccc
   */
  var ccc = {};

  /**
   * Gets the configuration of the given class name.
   * @param {String} className The class name
   * @return {ClassComponentConfiguration}
   * @throw {Error}
   */
  function getConfiguration(className) {
    assert(ccc[className], 'Class componet "' + className + '" is not defined.');

    return ccc[className];
  }

  /**
   * Registers the class component configuration for the given name.
   * @param {String} name The name
   * @param {Function} Constructor The constructor of the class component
   */
  function register(name, Constructor) {
    assert(typeof name === 'string', '`name` of a class component has to be a string');
    assert($.isFunction(Constructor), '`Constructor` of a class component has to be a function');

    ccc[name] = new ClassComponentConfiguration(name, Constructor);

    $(function () {
      init(name);
    });
  }

  /**
   * Initializes the class components of the given name in the given element.
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
   * @return {Array<HTMLElement>} The elements which are initialized in this initialization
   * @throw {Error}
   */
  function init(className, elem) {
    var conf = getConfiguration(className);

    return $(conf.selector, elem).each(function () {
      conf.initElem($(this));
    }).toArray();
  }

  /**
   * Initializes the class component of the give name at the given element.
   * @param {String} className The class name
   * @param {jQuery|HTMLElement|String} elem The element
   */
  function initAt(className, elem) {
    getConfiguration(className).initElem($(elem));
  }

  /**
   * Initializes all the class component at the element.
   * @param {jQuery} elem jQuery selection of doms
   */
  function initAllAtElem(elem) {
    var classes = elem[0].className;

    if (classes) {
      classes.split(reSpaces).forEach(function (className) {
        if (ccc[className]) {
          initAt(className, elem);
        }
      });
    }
  }

  /**
   * @param {jQuery|HTMLElement|String} elem The element
   */
  function initAll(elem) {
    Object.keys(ccc).forEach(function (className) {
      init(className, elem);
    });
  }

  /**
   * Initializes the element if it has registered class component names. Returns the jquery object itself.
   * @param {jQuery} elem The element (jQuery selection)
   * @param {string} [classNames] The class name.
   * @return {jQuery}
   */
  function componentInit(elem, classNames) {
    if (classNames) {
      classNames.split(reSpaces).forEach(function (className) {
        initAt(className, elem.addClass(className)); // init as the class-component
      });
    } else {
        // Initializes anything it already has.
        initAllAtElem(elem);
      }
  }

  /**
   * Gets the coelement of the given name in the given element.
   * @param {jQuery} elem The elemenet (jQuery selection)
   * @param {String} coelementName The name of the coelement
   * @return {Object}
   */
  function componentGet(elem, coelementName) {
    assert(elem[0], 'coelement "' + coelementName + '" unavailable at empty dom selection');

    var coelement = elem.data(COELEMENT_DATA_KEY_PREFIX + coelementName);

    assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + elem[0].tagName);

    return coelement;
  }

  var CLASS_COMPONENT_DATA_KEY = '__class_component_data__';

  // Defines the special property cc on the jquery prototype.
  var defineFnCc = function defineFnCc($) {
    return Object.defineProperty($.fn, 'cc', {
      get: function get() {
        var _this2 = this;

        var cc = this.data(CLASS_COMPONENT_DATA_KEY);

        if (!cc) {
          this.data(CLASS_COMPONENT_DATA_KEY, cc = function cc(classNames) {
            componentInit(_this2, classNames);
            return _this2;
          });

          cc.get = function (className) {
            return componentGet(_this2, className);
          };
          cc.init = function (className) {
            return cc(className).cc.get(className);
          };
        }

        return cc;
      }
    });
  };

  /**
   * class-component.js v10.5.0
   * author: Yoshiya Hinosawa ( http://github.com/kt3k )
   * license: MIT
   */
  // Initializes the module object.
  if (!$.cc) {
    $.cc = register;

    defineFnCc($);

    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Object<HTMLElement[]>}
     */
    register.init = function (classNames, elem) {
      if (!classNames) {
        initAll(elem);

        return;
      }

      if (typeof classNames === 'string') {
        classNames = classNames.split(reSpaces);
      }

      return classNames.map(function (className) {
        return init(className, elem);
      });
    };

    /**
     * The decorator for class component registration.
     * @param {String|Function} name The class name or the implementation class itself
     * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
     */
    register.component = function (name) {
      if (!$.isFunction(name)) {
        return function (Cls) {
          register(name, Cls);
        };
      }

      // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
      register(camelToKebab(name.name), name);
    };

    // Expose __ccc__
    register.__ccc__ = ccc;

    // Exports decorators
    register.on = on;
    register.emit = emit;
    register.wire = wire;
  }
})();

