'use strict';

(function () {
  'use strict';

  //      

  var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
  var KEY_EVENT_LISTENERS = '__cc_listeners__';

  //      
  /**
   * Binds the callback to the element at the event and the selector.
   * @param {HTMLElement} el The element
   * @param {string} event The event
   * @param {?string} selector The selector
   * @param {Function} callback The handler
   */
  var eventDelegate = function eventDelegate(el, event, selector, callback) {
    el.addEventListener(event, function (e) {
      if (!selector) {
        callback(e);
        return;
      }

      var nodes = el.querySelectorAll(selector);
      var target = e.target;

      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i] === target || nodes[i].contains(target)) {
          callback(e);
          return;
        }
      }
    });
  };

  //      
  /**
   * Registers the event listener to the class constructor.
   * @param {object} Constructor The constructor
   * @param {string} key The key of handler method
   * @param {string} event The event name
   * @param {string} selector The selector
   */
  var registerListenerInfo = function registerListenerInfo(Constructor, key, event, selector) {
    /**
     * @type <T> The coelement type
     * @param {HTMLElement} el The jquery selection of the element
     * @param {T} coelem The coelement
     */
    Constructor[KEY_EVENT_LISTENERS] = (Constructor[KEY_EVENT_LISTENERS] || []).concat(function (el, coelem) {
      eventDelegate(el, event, selector, function () {
        coelem[key].apply(coelem, arguments);
      });
    });
  };

  //      
  /**
   * Transform camelCase string to kebab-case string
   * @param camelString The string in camelCase
   * @return The string in kebab-case
   */
  var camelToKebab = function camelToKebab(camelString) {
    return camelString.replace(/[A-Z]/g, function (c) {
      return '-' + c.toLowerCase();
    }).replace(/^-/, '');
  };

  //      
  /**
   * Returns true iff the given thing is a function.
   * @param {any} func The thing to check
   */
  var isFunction = function isFunction(func) {
    return typeof func === 'function';
  };

  //      
  /**
   * ClassComponentConfiguration is the utility class for class component initialization.
   * @param {string} className The class name
   * @param {Function} Constructor The constructor of the coelement of the class component
   */
  function createComponentInitializer(className, Constructor) {
    var initClass = className + '-initialized';

    /**
     * Initialize the html element by the configuration.
     * @public
     * @param {HTMLElement} el The html element
     * @param {Object} coelem The dummy parameter, don't use
     */
    var initializer = function initializer(el /* HTMLElement */, coelem) {
      var classList = el.classList;

      if (!classList.contains(initClass)) {
        classList.add(initClass);
        el[COELEMENT_DATA_KEY_PREFIX + className] = coelem = new Constructor($(el));

        coelem.elem = coelem.$el = $(el);
        coelem.el = el;

        if (isFunction(coelem.init)) {
          coelem.init();
        }

        (Constructor[KEY_EVENT_LISTENERS] || []).forEach(function (listenerBinder) {
          listenerBinder(el, coelem);
        });
      }
    };

    initializer.selector = '.' + className + ':not(.' + initClass + ')';

    return initializer;
  }

  //      
  /**
   * Asserts the given condition holds, otherwise throws.
   * @param {boolean} assertion The assertion expression
   * @param {string} message The assertion message
   */
  function check(assertion, message) {
    if (!assertion) {
      throw new Error(message);
    }
  }

  /**
   * @param {any} classNames The class names
   */
  function checkClassNamesAreStringOrNull(classNames) {
    check(typeof classNames === 'string' || classNames == null, 'classNames must be a string or undefined/null.');
  }

  /**
   * Asserts the given name is a valid component name.
   * @param name The component name
   */
  function checkComponentNameIsValid(name) {
    check(typeof name === 'string', 'The name should not be a string');
    check(ccc[name] != null, 'The coelement of the given name is not registered: ' + name);
  }

  //      
  var documentReady = function documentReady(callback) {
    $(callback);
  };

  //      
  /**
   * @property {Object<Function>} ccc
   */
  var ccc = {};

  /**
   * Registers the class-component for the given name and constructor and returns the constructor.
   * @param {String} name The name
   * @param {Function} Constructor The constructor of the class component
   * @return {Function}
   */
  function register(name, Constructor) {
    check(typeof name === 'string', '`name` of a class component has to be a string.');
    check(isFunction(Constructor), '`Constructor` of a class component has to be a function');

    Constructor.__cc = name;

    ccc[name] = createComponentInitializer(name, Constructor);

    documentReady(function () {
      init(name);
    });

    return Constructor;
  }

  /**
   * Initializes the class components of the given name in the given element.
   * @param {string} classNames The class names
   * @param {?HTMLElement} el The dom where class componets are initialized
   * @return {Array<HTMLElement>} The elements which are initialized in this initialization
   * @throw {Error}
   */
  function init(classNames, el) {
    checkClassNamesAreStringOrNull(classNames);(classNames ? classNames.split(/\s+/) : Object.keys(ccc)).forEach(function (className) {
      var initializer = ccc[className];
      check(initializer != null, 'Class componet "' + className + '" is not defined.');[].forEach.call((el || document).querySelectorAll(initializer.selector), function (el) {
        initializer(el);
      });
    });
  }

  //      
  /**
   * Triggers the event.
   * @param el The element
   * @param type The event type
   * @param detail The optional detail object
   */
  var trigger = function trigger(el, type, detail) {
    el.dispatchEvent(new CustomEvent(type, { detail: detail }));
  };

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} at The selector
   */
  register.on = function (event) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        at = _ref.at;

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
        trigger(this.el, event, arguments[0]);

        return method.apply(this, arguments);
      };
    };

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

  register.emit.last = function (event) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        var _this = this;

        var result = method.apply(this, arguments);

        var emit = function emit(x) {
          return trigger(_this.el, event, x);
        };

        if (result && result.then) {
          result.then(emit);
        } else {
          emit(result);
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
   *
   * if `name` is function, then use it as class itself and the component name is kebabized version of its name.
   * @param {String|Function} name The class name or the implementation class itself
   * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
   */
  register.component = function (name) {
    return isFunction(name) ? register(camelToKebab(name.name), name) : function (Cls) {
      return register(name, Cls);
    };
  };

  //      
  /**
   * class-component.js v12.1.0
   * author: Yoshiya Hinosawa ( http://github.com/kt3k )
   * license: MIT
   */
  var cc = register;

  // Initializes the module object.
  if (!$.cc) {
    (function () {
      $.cc = cc;

      cc.init = init;

      // Expose __ccc__
      cc.__ccc__ = ccc;

      var descriptor = {
        get: function (_get) {
          function get() {
            return _get.apply(this, arguments);
          }

          get.toString = function () {
            return _get.toString();
          };

          return get;
        }(function () {
          var $el = this;
          var dom = $el[0];

          check(dom != null, 'cc (class-component context) is unavailable at empty dom selection');

          var cc = dom.cc;

          if (!cc) {
            /**
             * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
             * @param {?string} classNames The class component names
             * @return {jQuery}
             */
            cc = dom.cc = function (classNames) {
              checkClassNamesAreStringOrNull(classNames);(classNames || dom.className).split(/\s+/).forEach(function (className) {
                if (ccc[className]) {
                  ccc[className]($el.addClass(className)[0]);
                }
              });

              return $el;
            };

            /**
             * Gets the coelement of the given name.
             * @param {string} name The name of the coelement
             * @return {Object}
             */
            cc.get = function (name) {
              return get(name, dom);
            };

            cc.init = function (className) {
              return cc(className).cc.get(className);
            };
          }

          return cc;
        })
      };

      // Defines the special property cc on the jquery prototype.
      Object.defineProperty($.fn, 'cc', descriptor);

      cc.el = function (name, el) {
        checkComponentNameIsValid(name);

        ccc[name](el);
      };

      var get = cc.get = function (name, el) {
        checkComponentNameIsValid(name);

        var coelement = el[COELEMENT_DATA_KEY_PREFIX + name];

        check(coelement, 'no coelement named: ' + name + ', on the dom: ' + el.tagName);

        return coelement;
      };
    })();
  }
})();

