var capsid = function (exports) {
  'use strict';

  //      

  var COELEMENT_DATA_KEY_PREFIX = '__coelement:';
  var KEY_EVENT_LISTENERS = '__cc_listeners__';
  var INITIALIZED_KEY = '__cc_initialized__';

  //      
  /**
   * The decorator for registering event listener info to the method.
   * @param event The event name
   * @param at The selector
   * @param target The target prototype (decorator interface)
   * @param key The decorator target key (decorator interface)
   */
  var on = function on(event) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        at = _ref.at;

    return function (target, key) {
      var Constructor = target.constructor;

      /**
       * @param el The element
       * @param coelem The coelement
       */
      Constructor[KEY_EVENT_LISTENERS] = (Constructor[KEY_EVENT_LISTENERS] || []).concat(function (el, coelem) {
        el.addEventListener(event, function (e) {
          if (!at || [].some.call(el.querySelectorAll(at), function (node) {
            return node === e.target || node.contains(e.target);
          })) {
            coelem[key](e);
          }
        });
      });
    };
  };

  var onClick = on('click');

  //      
  /**
   * Triggers the event.
   * @param el The element
   * @param type The event type
   * @param detail The optional detail object
   */
  var trigger = function trigger(el, type, bubbles, detail) {
    el.dispatchEvent(new CustomEvent(type, { detail: detail, bubbles: bubbles }));
  };

  //      

  /**
   * `@emit(event)` decorator
   *
   * This decorator adds the event emission at the end of the method.
   * If the method returns the promise, then the event is emitted when it is resolved.
   * @param event The event name
   */
  var emit = function emit(event) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        var _this = this;

        var result = method.apply(this, arguments);

        var emit = function emit(x) {
          return trigger(_this.el, event, true, x);
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
   * `@emit.first(event)` decorator.
   * This decorator adds the event emission at the beginning of the method.
   * @param event The event name
   */
  emit.first = function (event) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        trigger(this.el, event, true, arguments[0]);

        return method.apply(this, arguments);
      };
    };
  };

  //      


  /**
   * The mapping from class-component name to its initializer function.
   */
  var ccc = {};

  //      
  /**
   * Asserts the given condition holds, otherwise throws.
   * @param assertion The assertion expression
   * @param message The assertion message
   */
  function check(assertion, message) {
    if (!assertion) {
      throw new Error(message);
    }
  }

  /**
   * @param classNames The class names
   */

  /**
   * Asserts the given name is a valid component name.
   * @param name The component name
   */
  function checkComponentNameIsValid(name) {
    check(typeof name === 'string', 'The name should be a string');
    check(!!ccc[name], 'The coelement of the given name is not registered: ' + name);
  }

  //      

  /**
   * Gets the eoelement instance of the class-component of the given name
   * @param name The class-component name
   * @param el The element
   */
  var get = function get(name, el) {
    checkComponentNameIsValid(name);

    var coelement = el[COELEMENT_DATA_KEY_PREFIX + name];

    check(coelement, 'no coelement named: ' + name + ', on the dom: ' + el.tagName);

    return coelement;
  };

  //      

  var READY_STATE_CHANGE = 'readystatechange';
  var doc = document;

  var ready = new Promise(function (resolve) {
    var checkReady = function checkReady() {
      if (doc.readyState === 'complete') {
        resolve();
        doc.removeEventListener(READY_STATE_CHANGE, checkReady);
      }
    };

    doc.addEventListener(READY_STATE_CHANGE, checkReady);

    checkReady();
  });

  var documentElement = doc.documentElement;

  //      

  var matches = documentElement.matches || documentElement.webkitMatchesSelector || documentElement.msMatchesSelector;

  //      
  /**
   * Transform camelCase string to kebab-case string
   * @param camelString The string in camelCase
   * @return The string in kebab-case
   */
  var camelToKebab = function camelToKebab(camelString) {
    return camelString.replace(/(?!^)[A-Z]/g, '-$&').toLowerCase();
  };

  //      

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
      var sel = selector || '.' + name;

      descriptor.get = function () {
        if (matches.call(this.el, sel)) {
          return get(name, this.el);
        }

        var nodes = this.el.querySelectorAll(sel);

        if (nodes.length) {
          return get(name, nodes[0]);
        }

        throw new Error('wired class-component "' + name + '" is not available at ' + this.el.tagName + '(class=[' + this.constructor.name + ']');
      };
    };
  };

  /**
   * Wires the class component of the name of the key to the property of the same name.
   */
  var wireComponent = function wireComponent(target, key, descriptor) {
    if (typeof target === 'string') {
      // If target is a string, then we suppose this is called as @wire(componentName, selector) and therefore
      // we need to return the following expression (it works as another decorator).
      return wireByNameAndSelector(target, key);
    }

    wireByNameAndSelector(camelToKebab(key))(target, key, descriptor);
  };

  var wireElement = function wireElement(sel) {
    return function (target, key, descriptor) {
      descriptor.get = function () {
        return this.el.querySelector(sel);
      };
    };
  };

  var wireElementAll = function wireElementAll(sel) {
    return function (target, key, descriptor) {
      descriptor.get = function () {
        return this.el.querySelectorAll(sel);
      };
    };
  };

  wireComponent.el = wireElement;
  wireComponent.elAll = wireElementAll;

  //      
  /**
   * Initializes the class components of the given name in the range of the given element.
   * @param name The class name
   * @param el The dom where class componets are initialized
   * @throws when the class name is invalid type.
   */
  var prep = function prep(name, el) {
    var classNames = void 0;

    if (!name) {
      classNames = Object.keys(ccc);
    } else {
      checkComponentNameIsValid(name);

      classNames = [name];
    }

    classNames.map(function (className) {
      [].map.call((el || doc).querySelectorAll(ccc[className].sel), ccc[className]);
    });
  };

  //      


  var pluginHooks = [];

  //      

  var initConstructor = function initConstructor(constructor) {
    constructor[INITIALIZED_KEY] = true;

    // Expose capsid here
    constructor.capsid = capsid;

    // If the constructor has the static __init__, then calls it.
    if (typeof constructor.__init__ === 'function') {
      constructor.__init__();
    }
  };

  //      

  /**
   * Initialize component.
   * @param Constructor The coelement class
   * @param el The element
   * @return The created coelement instance
   */
  var initComponent = function initComponent(Constructor, el) {
    if (!Constructor[INITIALIZED_KEY]) {
      initConstructor(Constructor);
    }

    var coelem = new Constructor();

    pluginHooks.forEach(function (pluginHook) {
      pluginHook(el, coelem);
    });

    coelem.el = el;

    if (typeof coelem.__init__ === 'function') {
      coelem.__init__();
    }

    (Constructor[KEY_EVENT_LISTENERS] || []).map(function (listenerBinder) {
      listenerBinder(el, coelem);
    });

    return coelem;
  };

  //      

  /**
   * Registers the class-component for the given name and constructor and returns the constructor.
   * @param name The component name
   * @param Constructor The constructor of the class component
   * @return The registered component class
   */
  var def = function def(name, Constructor) {
    check(typeof name === 'string', '`name` of a class component has to be a string.');
    check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function');

    var initClass = name + '-initialized';

    /**
     * Initializes the html element by the configuration.
     * @param el The html element
     * @param coelem The dummy parameter, don't use
     */
    var initializer = function initializer(el, coelem) {
      var classList = el.classList;

      if (!classList.contains(initClass)) {
        classList.add(name, initClass);el[COELEMENT_DATA_KEY_PREFIX + name] = initComponent(Constructor, el);
      }
    };

    // The selector
    initializer.sel = '.' + name + ':not(.' + initClass + ')';

    ccc[name] = initializer;

    ready.then(function () {
      prep(name);
    });
  };

  //      

  /**
   * The decorator for class component registration.
   *
   * if `name` is function, then use it as class itself and the component name is kebabized version of its name.
   * @param name The class name or the implementation class itself
   * @return The decorator if the class name is given, undefined if the implementation class is given
   */
  var component = function component(name) {
    if (typeof name !== 'function') {
      return function (Cls) {
        def(name, Cls);
        return Cls;
      };
    }

    return component(camelToKebab(name.name))(name);
  };

  //      

  /**
   * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
   */
  var pub = function pub(event, selector) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        var _this2 = this;

        var result = method.apply(this, arguments);

        var emit = function emit(x) {
          _this2.el.querySelectorAll(selector).forEach(function (el) {
            return trigger(el, event, false, x);
          });
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

  on.click = onClick;

  //      

  /**
   * Initializes the given element as the class-component.
   * @param name The name of the class component
   * @param el The element to initialize
   */
  var init = function init(name, el) {
    checkComponentNameIsValid(name);

    ccc[name](el);
  };

  //      

  /**
   * Initializes the given element as the class-component.
   * @param name The name of the class component
   * @param el The element to initialize
   * @return
   */
  var make = function make(name, elm) {
    init(name, elm);

    return get(name, elm);
  };

  //      


  var capsid = Object.freeze({
    on: on,
    emit: emit,
    wire: wireComponent,
    component: component,
    pub: pub,
    def: def,
    prep: prep,
    init: init,
    initComponent: initComponent,
    __ccc__: ccc,
    make: make,
    pluginHooks: pluginHooks,
    get: get
  });

  exports.on = on;
  exports.emit = emit;
  exports.wire = wireComponent;
  exports.component = component;
  exports.pub = pub;
  exports.def = def;
  exports.prep = prep;
  exports.init = init;
  exports.initComponent = initComponent;
  exports.__ccc__ = ccc;
  exports.make = make;
  exports.pluginHooks = pluginHooks;
  exports.get = get;

  return exports;
}({});