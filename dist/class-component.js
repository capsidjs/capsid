'use strict';

(function () {
  'use strict';

  var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
  var KEY_EVENT_LISTENERS = '__cc_listeners__';

  /**
   * Registers the event listener to the class constructor.
   * @param {object} constructor The constructor
   * @param {string} key The key of handler method
   * @param {string} event The event name
   * @param {string} selector The selector
   */
  var registerListenerInfo = function registerListenerInfo(constructor, key, event, selector) {
    // assert(constructor, 'prototype.constructor must be set to register the event listeners.')
    // Does not assert the above because if the user uses decorators throw decorators syntax,
    // Then the above assertion always passes and never fails.

    constructor[KEY_EVENT_LISTENERS] = (constructor[KEY_EVENT_LISTENERS] || []).concat(function (elem, coelem) {
      elem.on(event, selector, function () {
        coelem[key].apply(coelem, arguments);
      });
    });
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

        (Constructor[KEY_EVENT_LISTENERS] || []).forEach(function (listenerBinder) {
          listenerBinder(elem, coelem);
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
    (typeof classNames === 'string' ? classNames.split(/\s+/) : Object.keys(ccc)).forEach(function (className) {
      var conf = ccc[className];
      assert(conf, 'Class componet "' + className + '" is not defined.');

      $(conf.selector, elem).each(function () {
        conf.initElem($(this));
      });
    });
  }

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} at The selector
   */
  register.on = function (event) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var at = _ref.at;

    /**
     * The decorator for registering event listener info to the method.
     * @param {string} event The event name
     * @param {string} selector The selector for listening.
     */
    var atDecorator = function atDecorator(selector) {
      return function (target, key) {
        registerListenerInfo(target.constructor, key, event, selector);
      };
    };

    var onDecorator = atDecorator(at);
    onDecorator.at = atDecorator;

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
      register.emit.last(event)(target, key, descriptor);
    };

    return emitDecorator;
  };

  register.emit.first = register.emit;
  register.emit.last = function (event) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        var _this = this;

        var result = method.apply(this, arguments);

        if (result && result.then) {
          result.then(function (x) {
            return _this.elem.trigger(event, x);
          });
        } else {
          this.elem.trigger(event, result);
        }

        return result;
      };
    };
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
        return Cls;
      };
    }

    // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
    register(camelToKebab(name.name), name);
    return name;
  };

  /**
   * class-component.js v10.7.2
   * author: Yoshiya Hinosawa ( http://github.com/kt3k )
   * license: MIT
   */
  // Initializes the module object.
  if (!$.cc) {
    $.cc = register;

    register.init = init;

    // Expose __ccc__
    register.__ccc__ = ccc;

    // Defines the special property cc on the jquery prototype.
    Object.defineProperty($.fn, 'cc', {
      get: function get() {
        var elem = this;
        var dom = elem[0];

        assert(dom, 'cc (class-component context) is unavailable at empty dom selection');

        var cc = dom.cc;

        if (!cc) {
          /**
           * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
           * @param {string} classNames The class component names
           * @return {jQuery}
           */
          cc = function cc(classNames) {
            (typeof classNames === 'string' ? classNames : dom.className).split(/\s+/).forEach(function (className) {
              if (ccc[className]) {
                ccc[className].initElem(elem.addClass(className));
              }
            });

            return elem;
          };
          dom.cc = cc;

          /**
           * Gets the coelement of the given name.
           * @param {String} coelementName The name of the coelement
           * @return {Object}
           */
          cc.get = function (coelementName) {
            var coelement = elem.data(COELEMENT_DATA_KEY_PREFIX + coelementName);

            assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + dom.tagName);

            return coelement;
          };

          cc.init = function (className) {
            return cc(className).cc.get(className);
          };
        }

        return cc;
      }
    });
  }
})();

