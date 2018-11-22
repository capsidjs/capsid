var capsid = (function(exports) {
  'use strict'

  /**
   * The mapping from class-component name to its initializer function.
   */
  var ccc = {}

  /**
   * Asserts the given condition holds, otherwise throws.
   * @param assertion The assertion expression
   * @param message The assertion message
   */

  function check(assertion, message) {
    if (!assertion) {
      throw new Error(message)
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
    check(typeof name === 'string', 'The name should be a string')
    check(
      !!ccc[name],
      'The coelement of the given name is not registered: '.concat(name)
    )
  }

  var READY_STATE_CHANGE = 'readystatechange'
  var doc = document
  var ready = new Promise(function(resolve) {
    var checkReady = function checkReady() {
      if (doc.readyState === 'complete') {
        resolve()
        doc.removeEventListener(READY_STATE_CHANGE, checkReady)
      }
    }

    doc.addEventListener(READY_STATE_CHANGE, checkReady)
    checkReady()
  })
  var documentElement = doc.documentElement

  /**
   * Initializes the class components of the given name in the range of the given element.
   * @param name The class name
   * @param el The dom where class componets are initialized
   * @throws when the class name is invalid type.
   */

  var prep = function(name, el) {
    var classNames

    if (!name) {
      classNames = Object.keys(ccc)
    } else {
      checkComponentNameIsValid(name)
      classNames = [name]
    }

    classNames.map(function(className) {
      ;[].map.call(
        (el || doc).querySelectorAll(ccc[className].sel),
        ccc[className]
      )
    })
  }

  var pluginHooks = []

  var COELEMENT_DATA_KEY_PREFIX = 'C$'
  var KEY_EVENT_LISTENERS = 'K$'
  var INITIALIZED_KEY = 'I$'
  var COMPONENT_NAME_KEY = 'N$'

  var initConstructor = function(constructor, name) {
    constructor[INITIALIZED_KEY] = true
    constructor[COMPONENT_NAME_KEY] = name // Expose capsid here

    constructor.capsid = capsid // If the constructor has the static __init__, then calls it.

    if (typeof constructor.__init__ === 'function') {
      constructor.__init__()
    }
  }

  /**
   * Initialize component.
   * @param Constructor The coelement class
   * @param el The element
   * @param name The coelement name
   * @return The created coelement instance
   */

  var mount = function(Constructor, el, name) {
    if (!Constructor[INITIALIZED_KEY]) {
      initConstructor(Constructor, name)
    }

    var coelem = new Constructor() // Assigns element to coelement's .el property

    coelem.el = el

    if (name) {
      // Assigns coelement to element's "hidden" property

      el[COELEMENT_DATA_KEY_PREFIX + name] = coelem
    } // Initialize event listeners defined by @emit decorator

    ;(Constructor[KEY_EVENT_LISTENERS] || []).map(function(listenerBinder) {
      listenerBinder(el, coelem, name)
    }) // Executes plugin hooks

    pluginHooks.forEach(function(pluginHook) {
      pluginHook(el, coelem)
    })

    if (typeof coelem.__mount__ === 'function') {
      coelem.__mount__()
    }

    return coelem
  }

  /**
   * Registers the class-component for the given name and constructor and returns the constructor.
   * @param name The component name
   * @param Constructor The constructor of the class component
   * @return The registered component class
   */

  var def = function def(name, Constructor) {
    check(
      typeof name === 'string',
      '`name` of a class component has to be a string.'
    )
    check(
      typeof Constructor === 'function',
      '`Constructor` of a class component has to be a function'
    )
    var initClass = ''.concat(name, '-\uD83D\uDC8A')
    /**
     * Initializes the html element by the configuration.
     * @param el The html element
     * @param coelem The dummy parameter, don't use
     */

    var initializer = function initializer(el, coelem) {
      var classList = el.classList

      if (!classList.contains(initClass)) {
        classList.add(name, initClass)
        mount(Constructor, el, name)
      }
    } // The selector

    initializer.sel = '.'.concat(name, ':not(.').concat(initClass, ')')
    ccc[name] = initializer
    ready.then(function() {
      prep(name)
    })
  }

  /**
   * Gets the eoelement instance of the class-component of the given name
   * @param name The class-component name
   * @param el The element
   */

  var _get = function(name, el) {
    checkComponentNameIsValid(name)
    var coelement = el[COELEMENT_DATA_KEY_PREFIX + name]
    check(
      coelement,
      'no coelement named: '.concat(name, ', on the dom: ').concat(el.tagName)
    )
    return coelement
  }

  /**
   * Initializes the given element as the class-component.
   * @param name The name of the class component
   * @param el The element to initialize
   */

  var init = function(name, el) {
    checkComponentNameIsValid(name)
    ccc[name](el)
  }

  /**
   * Initializes the given element as the class-component.
   * @param name The name of the class component
   * @param el The element to initialize
   * @return
   */

  var make = function(name, elm) {
    init(name, elm)
    return _get(name, elm)
  }

  var unmount = function(name, el) {
    var coel = _get(name, el)

    if (typeof coel.__unmount__ === 'function') {
      coel.__unmount__()
    }

    el.classList.remove(name, ''.concat(name, '-\uD83D\uDC8A'))
    ;(el[KEY_EVENT_LISTENERS + name] || []).forEach(function(listener) {
      listener.remove()
    })
    delete el[COELEMENT_DATA_KEY_PREFIX + name]
    delete coel.el
  }

  /**
   * Installs the capsid module or plugin.
   *
   * @param {CapsidModule} capsidModule
   * @param {object} options
   */
  var install$$1 = function(capsidModule, options) {
    check(
      typeof capsidModule.install === 'function',
      'The given capsid module does not have `install` method. Please check the install call.'
    )
    capsidModule.install(capsid, options || {})
  }

  /**
   * The decorator for registering event listener info to the method.
   * @param event The event name
   * @param at The selector
   * @param descriptor The method descriptor
   */
  var on = function(event) {
    var _ref =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      at = _ref.at

    return function(descriptor) {
      var key = descriptor.key

      descriptor.finisher = function(constructor) {
        check(
          !!event,
          'Empty event handler is given: constructor='
            .concat(constructor.name, ' key=')
            .concat(key)
        )
        /**
         * @param el The element
         * @param coelem The coelement
         * @param name The component name
         */

        constructor[KEY_EVENT_LISTENERS] = (
          constructor[KEY_EVENT_LISTENERS] || []
        ).concat(function(el, coelem, name) {
          var keyEventListeners = KEY_EVENT_LISTENERS + name

          var listener = function listener(e) {
            if (
              !at ||
              [].some.call(el.querySelectorAll(at), function(node) {
                return node === e.target || node.contains(e.target)
              })
            ) {
              coelem[key](e)
            }
          }
          /**
           * Removes the event listener.
           */

          listener.remove = function() {
            el.removeEventListener(event, listener)
          }
          /**
           * Store event listeners to remove it later.
           */

          el[keyEventListeners] = (el[keyEventListeners] || []).concat(listener)
          el.addEventListener(event, listener)
        })
      }
    }
  }

  /**
   * Registers the on[eventName] and on[eventName].at decorators.
   * @param {string} handlerName
   */

  var useHandler = function(handlerName) {
    on[handlerName] = on(handlerName)

    on[handlerName].at = function(selector) {
      return on(handlerName, {
        at: selector
      })
    }
  }

  /**
   * Triggers the event.
   * @param el The element
   * @param type The event type
   * @param detail The optional detail object
   */
  var trigger = function(el, type, bubbles, detail) {
    el.dispatchEvent(
      new CustomEvent(type, {
        detail: detail,
        bubbles: bubbles
      })
    )
  }

  /**
   * `@emits(event)` decorator
   *
   * This decorator adds the event emission at the end of the method.
   * If the method returns the promise, then the event is emitted when it is resolved.
   * @param event The event name
   */

  var emits = function emits(event) {
    return function(descriptor) {
      var method = descriptor.descriptor.value
      var key = descriptor.key

      descriptor.finisher = function(constructor) {
        check(
          !!event,
          'Unable to emits an empty event: constructor='
            .concat(constructor.name, ' key=')
            .concat(key)
        )
      }

      descriptor.descriptor.value = function() {
        var _this = this

        var result = method.apply(this, arguments)

        var emit = function emit(x) {
          return trigger(_this.el, event, true, x)
        }

        if (result && result.then) {
          result.then(emit)
        } else {
          emit(result)
        }

        return result
      }
    }
  }

  var matches =
    documentElement.matches ||
    documentElement.webkitMatchesSelector ||
    documentElement.msMatchesSelector

  /**
   * Wires the class component of the name of the key to the property of the same name.
   *
   * Replaces the getter with the function which accesses the class-component of the given name.
   * @param name The class component name
   * @param selector The selector to access class component dom. Optional. Default is '.[name]'.
   * @param descriptor The method element descriptor
   */

  var wiredComponent = function wiredComponent(name, selector) {
    return function(descriptor) {
      var sel = selector || '.'.concat(name)
      var key = descriptor.key
      descriptor.placement = 'prototype'

      descriptor.finisher = function(constructor) {
        Object.defineProperty(constructor.prototype, key, {
          get: function get() {
            check(
              !!this.el,
              "Component's element is not ready. Probably wired getter called at constructor.(class=[".concat(
                this.constructor.name,
                ']'
              )
            )

            if (matches.call(this.el, sel)) {
              return _get(name, this.el)
            }

            var nodes = this.el.querySelectorAll(sel)
            check(
              nodes.length > 0,
              'wired component "'
                .concat(name, '" is not available at ')
                .concat(this.el.tagName, '(class=[')
                .concat(this.constructor.name, ']')
            )
            return _get(name, nodes[0])
          }
        })
      }
    }
  }

  var wired = function wired(sel) {
    return function(descriptor) {
      var key = descriptor.key
      descriptor.placement = 'prototype'

      descriptor.finisher = function(constructor) {
        Object.defineProperty(constructor.prototype, key, {
          get: function get() {
            return this.el.querySelector(sel)
          }
        })
      }
    }
  }

  var wiredAll = function wiredAll(sel) {
    return function(descriptor) {
      var key = descriptor.key
      descriptor.placement = 'prototype'

      descriptor.finisher = function(constructor) {
        Object.defineProperty(constructor.prototype, key, {
          get: function get() {
            return this.el.querySelectorAll(sel)
          }
        })
      }
    }
  }

  wired.all = wiredAll
  wired.component = wiredComponent

  /**
   * The decorator for class component registration.
   *
   * if `name` is function, then use it as class itself and the component name is kebab-cased version of its name.
   * @param name The class name or the implementation class itself
   * @return The decorator if the class name is given, undefined if the implementation class is given
   */

  var component = function component(name) {
    check(!!name, 'Component name must be non-empty')
    return function(desc) {
      desc.finisher = function(Cls) {
        def(name, Cls)
      }
    }
  }

  /**
   * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
   */

  var notifies = function(event, selector) {
    return function(descriptor) {
      var key = descriptor.key
      var d = descriptor.descriptor
      var method = d.value

      descriptor.finisher = function(constructor) {
        check(
          !!event,
          'Unable to notify empty event: constructor='
            .concat(constructor.name, ' key=')
            .concat(key)
        )
      }

      d.value = function() {
        var _this = this

        var result = method.apply(this, arguments)
        var forEach = [].forEach

        var emit = function emit(x) {
          forEach.call(_this.el.querySelectorAll(selector), function(el) {
            return trigger(el, event, false, x)
          })
        }

        if (result && result.then) {
          result.then(emit)
        } else {
          emit(result)
        }

        return result
      }
    }
  }

  on.useHandler = useHandler
  on.useHandler('click')

  var capsid = Object.freeze({
    def: def,
    prep: prep,
    make: make,
    mount: mount,
    unmount: unmount,
    get: _get,
    install: install$$1,
    on: on,
    emits: emits,
    wired: wired,
    component: component,
    notifies: notifies,
    __ccc__: ccc,
    pluginHooks: pluginHooks
  })

  exports.def = def
  exports.prep = prep
  exports.make = make
  exports.mount = mount
  exports.unmount = unmount
  exports.get = _get
  exports.install = install$$1
  exports.on = on
  exports.emits = emits
  exports.wired = wired
  exports.component = component
  exports.notifies = notifies
  exports.__ccc__ = ccc
  exports.pluginHooks = pluginHooks

  return exports
})({})
