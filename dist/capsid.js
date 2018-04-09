var capsid = function (exports) {
  'use strict';

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
  var COELEMENT_DATA_KEY_PREFIX = '$D';
  var KEY_EVENT_LISTENERS = '$K';
  var INITIALIZED_KEY = '$I';
  var COMPONENT_NAME_KEY = '$N';

  //      

  var initConstructor = function initConstructor(constructor, name) {
    constructor[INITIALIZED_KEY] = true;
    constructor[COMPONENT_NAME_KEY] = name;

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
   * @param name The coelement name
   * @return The created coelement instance
   */
  var mount = function mount(Constructor, el, name) {
    if (!Constructor[INITIALIZED_KEY]) {
      initConstructor(Constructor, name);
    }

    var coelem = new Constructor();

    // Assigns element to coelement's .el property
    coelem.el = el;

    if (name) {
      // Assigns coelement to element's "hidden" property
      el[COELEMENT_DATA_KEY_PREFIX + name] = coelem;
    }

    // Initialize event listeners defined by @emit decorator
    (Constructor[KEY_EVENT_LISTENERS] || []).map(function (listenerBinder) {
      listenerBinder(el, coelem);
    });

    // Executes plugin hooks
    pluginHooks.forEach(function (pluginHook) {
      pluginHook(el, coelem);
    });

    // Backward compat
    if (typeof coelem.__init__ === 'function') {
      coelem.__init__();
    }

    if (typeof coelem.__mount__ === 'function') {
      coelem.__mount__();
    }

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

    var initClass = name + '-\uD83D\uDC8A';

    /**
     * Initializes the html element by the configuration.
     * @param el The html element
     * @param coelem The dummy parameter, don't use
     */
    var initializer = function initializer(el, coelem) {
      var classList = el.classList;

      if (!classList.contains(initClass)) {
        classList.add(name, initClass);

        mount(Constructor, el, name);
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

  //      

  var unmount = function unmount(name, el) {
    var coel = get(name, el);

    if (typeof coel.__unmount__ === 'function') {
      coel.__unmount__();
    }

    el.classList.remove(name, name + '-\uD83D\uDC8A');(el[KEY_EVENT_LISTENERS] || []).forEach(function (listener) {
      listener.remove();
    });

    delete el[COELEMENT_DATA_KEY_PREFIX + name];
    delete coel.el;
  };

  //      

  /**
   * Installs the capsid module or plugin.
   *
   * @param {CapsidModule} capsidModule
   * @param {object} options
   */
  var install$$1 = function install$$1(capsidModule, options) {
    if (typeof capsidModule.install !== 'function') {
      throw new Error('The given capsid module does not have `install` method. Please check the install call.');
    }

    capsidModule.install(capsid, options || {});
  };

  //

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
        var listener = function listener(e) {
          if (!at || [].some.call(el.querySelectorAll(at), function (node) {
            return node === e.target || node.contains(e.target);
          })) {
            coelem[key](e);
          }
        };

        /**
         * Removes the event listener.
         */
        listener.remove = function () {
          el.removeEventListener(event, listener);
        }

        /**
         * Store event listeners to remove it later.
         */
        ;el[KEY_EVENT_LISTENERS] = (el[KEY_EVENT_LISTENERS] || []).concat(listener);

        el.addEventListener(event, listener);
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
   * `@emits(event)` decorator
   *
   * This decorator adds the event emission at the end of the method.
   * If the method returns the promise, then the event is emitted when it is resolved.
   * @param event The event name
   */
  var emits = function emits(event) {
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
  emits.first = function (event) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        trigger(this.el, event, true, arguments[0]);

        return method.apply(this, arguments);
      };
    };
  };

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
        if (!this.el) {
          throw new Error('Component\'s element is not ready. Probably wired getter called at constructor.(class=[' + this.constructor.name + ']');
        }

        if (matches.call(this.el, sel)) {
          return get(name, this.el);
        }

        var nodes = this.el.querySelectorAll(sel);

        if (nodes.length) {
          return get(name, nodes[0]);
        }

        throw new Error('wired component "' + name + '" is not available at ' + this.el.tagName + '(class=[' + this.constructor.name + ']');
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

  var wired = wireElement;
  wired.all = wireElementAll;
  wired.component = wireComponent;

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
  var notifies = function notifies(event, selector) {
    return function (target, key, descriptor) {
      var method = descriptor.value;

      descriptor.value = function () {
        var _this2 = this;

        var result = method.apply(this, arguments);
        var forEach = [].forEach;

        var emit = function emit(x) {
          forEach.call(_this2.el.querySelectorAll(selector), function (el) {
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

  var emit = emits; // alias
  var pub = notifies; // alias


  var capsid = Object.freeze({
    def: def,
    prep: prep,
    make: make,
    mount: mount,
    unmount: unmount,
    get: get,
    install: install$$1,
    on: on,
    emit: emit,
    emits: emits,
    wire: wireComponent,
    wired: wired,
    component: component,
    pub: pub,
    notifies: notifies,
    __ccc__: ccc,
    pluginHooks: pluginHooks
  });

  exports.def = def;
  exports.prep = prep;
  exports.make = make;
  exports.mount = mount;
  exports.unmount = unmount;
  exports.get = get;
  exports.install = install$$1;
  exports.on = on;
  exports.emit = emit;
  exports.emits = emits;
  exports.wire = wireComponent;
  exports.wired = wired;
  exports.component = component;
  exports.pub = pub;
  exports.notifies = notifies;
  exports.__ccc__ = ccc;
  exports.pluginHooks = pluginHooks;

  return exports;
}({});