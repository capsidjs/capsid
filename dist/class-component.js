'use strict';

(function () {
  'use strict';

  var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
  var KEY_EVENT_LISTENERS = '__cc_listeners__';
  var CLASS_COMPONENT_DATA_KEY = '__cc_data__';

  /**
   * The event listener's information model.
   * @param {string} event The event name to bind
   * @param {string} selector The selector to bind the listener
   * @param {string} key The handler name
   */
  function ListenerInfo(event, selector, key) {
    /**
     * Binds the listener to the given element with the given coelement.
     * @param {jQuery} elem The jquery element
     * @param {object} coelem The coelement which is bound to the element
     */
    this.bindTo = function (elem, coelem) {
      elem.on(event, selector, function () {
        coelem[key].apply(coelem, arguments);
      });
    };
  }

  /**
   * Gets the listers from the prototype.
   * @param {object} prototype The prototype object
   * @param {ListenerInfo[]} listeners The dummy parameter, don't use
   * @return {ListenerInfo[]}
   */
  var getListeners = function getListeners(constructor) {
    return constructor[KEY_EVENT_LISTENERS] || [];
  };

  /**
   * @param {Function} constructor The constructor
   * @param {string} key The key of handler method
   * @param {string} event The event name
   * @param {string} selector The selector
   */
  var registerListenerInfo = function registerListenerInfo(prototype, key, event, selector) {
    var constructor = prototype.constructor;

    // assert(constructor, 'prototype.constructor must be set to register the event listeners.')
    // Does not assert the above because if the user uses decorators throw decorators syntax,
    // Then the above assertion always passes and never fails.

    constructor[KEY_EVENT_LISTENERS] = getListeners(constructor).concat(new ListenerInfo(event, selector, key));
  };

  var camelToKebab = function camelToKebab(camelString) {
    return camelString.replace(/[A-Z]/g, function (c) {
      return '-' + c.toLowerCase();
    }).replace(/^-/, '');
  };

  var $ = jQuery;
  var isFunction = $.isFunction;

  /**
   * ClassComponentConfiguration is the utility class for class component initialization.
   * @param {String} className The class name
   * @param {Function} Constructor The constructor of the coelement of the class component
   */
  function ClassComponentConfiguration(className, Constructor) {
    this.Constructor = Constructor;
    var initClass = className + '-initialized';
    this.selector = '.' + className + ':not(.' + initClass + ')';

    /**
     * Initialize the element by the configuration.
     * @public
     * @param {jQuery} elem The element
     * @param {object} coelem The dummy parameter, don't use
     */
    this.initElem = function (elem, coelem) {
      if (!elem.hasClass(initClass)) {
        elem.addClass(initClass).data(COELEMENT_DATA_KEY_PREFIX + className, coelem = new Constructor(elem));

        if (isFunction(coelem.__cc_init__)) {
          coelem.__cc_init__(elem);
        } else {
          coelem.elem = elem;
        }

        getListeners(Constructor).forEach(function (listenerInfo) {
          listenerInfo.bindTo(elem, coelem);
        });
      }
    };
  }

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
    assert(isFunction(Constructor), '`Constructor` of a class component has to be a function');

    ccc[name] = new ClassComponentConfiguration(name, Constructor);

    $(function () {
      init(name);
    });
  }

  /**
   * Initializes the class components of the given name in the given element.
   * @param {String} classNames The class names
   * @param {jQuery|HTMLElement|String} elem The dom where class componets are initialized
   * @return {Array<HTMLElement>} The elements which are initialized in this initialization
   * @throw {Error}
   */
  function init(classNames, elem) {
    (typeof classNames === 'string' ? classNames.split(/\s+/) : Object.keys(ccc)).map(getConfiguration).forEach(function (conf) {
      $(conf.selector, elem).each(function () {
        conf.initElem($(this));
      });
    });
  }

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   */
  register.on = function (event) {
    var onDecorator = function onDecorator(target, key) {
      registerListenerInfo(target, key, event);
    };

    /**
     * The decorator for registering event listener info to the method.
     * @param {string} event The event name
     * @param {string} selector The selector for listening.
     */
    onDecorator.at = function (selector) {
      return function (target, key) {
        registerListenerInfo(target, key, event, selector);
      };
    };

    return onDecorator;
  };

  /**
   * `@emit(event)` decorator.
   * This decorator adds the event emission at the beginning of the method.
   * @param {string} event The event name
   */
  register.emit = function (event) {
    var emitDecorator = function emitDecorator(target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        this.elem.trigger(event, arguments);

        return method.apply(this, arguments);
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
  register.wire = function (target, key, descriptor) {
    if (!descriptor) {
      // If the descriptor is not given, then suppose this is called as @wire(componentName, selector) and therefore
      // we need to return the following expression (it works as another decorator).
      return wireByNameAndSelector(target, key);
    }

    wireByNameAndSelector(camelToKebab(key))(target, key, descriptor);
  };

  /**
   * The decorator for class component registration.
   * @param {String|Function} name The class name or the implementation class itself
   * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
   */
  register.component = function (name) {
    if (!isFunction(name)) {
      return function (Cls) {
        register(name, Cls);
      };
    }

    // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
    register(camelToKebab(name.name), name);
  };

  // Defines the special property cc on the jquery prototype.
  var defineFnCc = function defineFnCc($) {
    return Object.defineProperty($.fn, 'cc', {
      get: function get() {
        var elem = this;
        var cc = elem.data(CLASS_COMPONENT_DATA_KEY);

        if (!cc) {
          /**
           * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
           * @param {string} classNames The class component names
           * @return {jQuery}
           */
          cc = function cc(classNames) {
            (typeof classNames === 'string' ? classNames : elem[0].className).split(/\s+/).forEach(function (className) {
              if (ccc[className]) {
                getConfiguration(className).initElem(elem.addClass(className));
              }
            });

            return elem;
          };
          elem.data(CLASS_COMPONENT_DATA_KEY, cc);

          /**
           * Gets the coelement of the given name.
           * @param {String} coelementName The name of the coelement
           * @return {Object}
           */
          cc.get = function (coelementName) {
            assert(elem[0], 'coelement "' + coelementName + '" unavailable at empty dom selection');

            var coelement = elem.data(COELEMENT_DATA_KEY_PREFIX + coelementName);

            assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + elem[0].tagName);

            return coelement;
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
   * class-component.js v10.6.1
   * author: Yoshiya Hinosawa ( http://github.com/kt3k )
   * license: MIT
   */
  // Initializes the module object.
  if (!$.cc) {
    $.cc = register;

    defineFnCc($);

    register.init = init;

    // Expose __ccc__
    register.__ccc__ = ccc;
  }
})();

