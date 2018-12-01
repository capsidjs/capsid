var capsid = (function (exports) {
'use strict';

var ccc = {};

function check(assertion, message) {
    if (!assertion) {
        throw new Error(message);
    }
}

function checkComponentNameIsValid(name) {
    check(typeof name === 'string', 'The name should be a string');
    check(!!ccc[name], "The coelement of the given name is not registered: " + name);
}

var READY_STATE_CHANGE = 'readystatechange';
var doc = document;
var ready = new Promise(function (resolve) {
    var checkReady = function () {
        if (doc.readyState === 'complete') {
            resolve();
            doc.removeEventListener(READY_STATE_CHANGE, checkReady);
        }
    };
    doc.addEventListener(READY_STATE_CHANGE, checkReady);
    checkReady();
});
var documentElement = doc.documentElement;

var prep = (function (name, el) {
    var classNames;
    if (!name) {
        classNames = Object.keys(ccc);
    }
    else {
        checkComponentNameIsValid(name);
        classNames = [name];
    }
    classNames.map(function (className) {
        
        [].map.call((el || doc).querySelectorAll(ccc[className].sel), ccc[className]);
    });
});

var pluginHooks = [];

var COELEMENT_DATA_KEY_PREFIX = 'C$';
var KEY_EVENT_LISTENERS = 'K$';
var INITIALIZED_KEY = 'I$';
var COMPONENT_NAME_KEY = 'N$';

var initConstructor = (function (constructor, name) {
    constructor[INITIALIZED_KEY] = true;
    constructor[COMPONENT_NAME_KEY] = name;
    constructor.capsid = capsid;
    if (typeof constructor.__init__ === 'function') {
        constructor.__init__();
    }
});

var mount = (function (Constructor, el, name) {
    if (!Constructor[INITIALIZED_KEY]) {
        initConstructor(Constructor, name);
    }
    var coelem = new Constructor();
    coelem.el = el;
    if (name) {
        
        el[COELEMENT_DATA_KEY_PREFIX + name] = coelem;
    }
    
    (Constructor[KEY_EVENT_LISTENERS] || []).map(function (listenerBinder) {
        listenerBinder(el, coelem, name);
    });
    pluginHooks.forEach(function (pluginHook) {
        pluginHook(el, coelem);
    });
    if (typeof coelem.__mount__ === 'function') {
        coelem.__mount__();
    }
    return coelem;
});

var def = function (name, Constructor) {
    check(typeof name === 'string', '`name` of a class component has to be a string.');
    check(typeof Constructor === 'function', '`Constructor` of a class component has to be a function');
    var initClass = name + "-\uD83D\uDC8A";
    var initializer = function (el, coelem) {
        var classList = el.classList;
        if (!classList.contains(initClass)) {
            classList.add(name, initClass);
            mount(Constructor, el, name);
        }
    };
    initializer.sel = "." + name + ":not(." + initClass + ")";
    ccc[name] = initializer;
    ready.then(function () {
        prep(name);
    });
};

var get = (function (name, el) {
    checkComponentNameIsValid(name);
    var coelement = el[COELEMENT_DATA_KEY_PREFIX + name];
    check(coelement, "no coelement named: " + name + ", on the dom: " + el.tagName);
    return coelement;
});

var init = (function (name, el) {
    checkComponentNameIsValid(name);
    ccc[name](el);
});

var make = (function (name, elm) {
    init(name, elm);
    return get(name, elm);
});

var unmount = (function (name, el) {
    var coel = get(name, el);
    if (typeof coel.__unmount__ === 'function') {
        coel.__unmount__();
    }
    el.classList.remove(name, name + "-\uD83D\uDC8A");
    (el[KEY_EVENT_LISTENERS + name] || []).forEach(function (listener) {
        listener.remove();
    });
    delete el[COELEMENT_DATA_KEY_PREFIX + name];
    delete coel.el;
});

var install$$1 = (function (capsidModule, options) {
    check(typeof capsidModule.install === 'function', 'The given capsid module does not have `install` method. Please check the install call.');
    capsidModule.install(capsid, options || {});
});

var on = function (event, _a) {
    var at = (_a === void 0 ? {} : _a).at;
    return function (descriptor) {
        var key = descriptor.key;
        descriptor.finisher = function (constructor) {
            check(!!event, "Empty event handler is given: constructor=" + constructor.name + " key=" + key);
            constructor[KEY_EVENT_LISTENERS] = (constructor[KEY_EVENT_LISTENERS] || []).concat(function (el, coelem, name) {
                var keyEventListeners = KEY_EVENT_LISTENERS + name;
                var listener = function (e) {
                    if (!at ||
                        [].some.call(el.querySelectorAll(at), function (node) {
                            return node === e.target || node.contains(e.target);
                        })) {
                        coelem[key](e);
                    }
                };
                listener.remove = function () {
                    el.removeEventListener(event, listener);
                };
                el[keyEventListeners] = (el[keyEventListeners] || []).concat(listener);
                el.addEventListener(event, listener);
            });
        };
    };
};

var useHandler = (function (handlerName) {
    on[handlerName] = on(handlerName);
    on[handlerName].at = function (selector) { return on(handlerName, { at: selector }); };
});

var trigger = (function (el, type, bubbles, detail) {
    el.dispatchEvent(new CustomEvent(type, { detail: detail, bubbles: bubbles }));
});

var emits = function (event) { return function (descriptor, _) {
    var method = descriptor.descriptor.value;
    var key = descriptor.key;
    descriptor.finisher = function (constructor) {
        check(!!event, "Unable to emits an empty event: constructor=" + constructor.name + " key=" + key);
    };
    descriptor.descriptor.value = function () {
        var _this = this;
        var result = method.apply(this, arguments);
        var emit = function (x) { return trigger(_this.el, event, true, x); };
        if (result && result.then) {
            result.then(emit);
        }
        else {
            emit(result);
        }
        return result;
    };
}; };

var matches = documentElement.matches ||
    documentElement.webkitMatchesSelector ||
    documentElement.msMatchesSelector;

var wiredComponent = function (name, selector) { return function (descriptor, _) {
    var sel = selector || "." + name;
    var key = descriptor.key;
    descriptor.placement = 'prototype';
    descriptor.finisher = function (constructor) {
        Object.defineProperty(constructor.prototype, key, {
            get: function () {
                check(!!this.el, "Component's element is not ready. Probably wired getter called at constructor.(class=[" + this.constructor.name + "]");
                if (matches.call(this.el, sel)) {
                    return get(name, this.el);
                }
                var nodes = this.el.querySelectorAll(sel);
                check(nodes.length > 0, "wired component \"" + name + "\" is not available at " + this.el.tagName + "(class=[" + this.constructor.name + "]");
                return get(name, nodes[0]);
            }
        });
    };
}; };
var wired = function (sel) { return function (descriptor, _) {
    var key = descriptor.key;
    descriptor.placement = 'prototype';
    descriptor.finisher = function (constructor) {
        Object.defineProperty(constructor.prototype, key, {
            get: function () {
                return this.el.querySelector(sel);
            }
        });
    };
}; };
var wiredAll = function (sel) { return function (descriptor, _) {
    var key = descriptor.key;
    descriptor.placement = 'prototype';
    descriptor.finisher = function (constructor) {
        Object.defineProperty(constructor.prototype, key, {
            get: function () {
                return this.el.querySelectorAll(sel);
            }
        });
    };
}; };
wired.all = wiredAll;
wired.component = wiredComponent;

var component = function (name) {
    check(typeof name === 'string' && !!name, 'Component name must be a non-empty string');
    return function (desc) {
        desc.finisher = function (Cls) {
            def(name, Cls);
        };
    };
};

var notifies = (function (event, selector) { return function (descriptor, _) {
    var key = descriptor.key;
    var d = descriptor.descriptor;
    var method = d.value;
    descriptor.finisher = function (constructor) {
        check(!!event, "Unable to notify empty event: constructor=" + constructor.name + " key=" + key);
    };
    d.value = function () {
        var _this = this;
        var result = method.apply(this, arguments);
        var forEach = [].forEach;
        var emit = function (x) {
            forEach.call(_this.el.querySelectorAll(selector), function (el) {
                return trigger(el, event, false, x);
            });
        };
        if (result && result.then) {
            result.then(emit);
        }
        else {
            emit(result);
        }
        return result;
    };
}; });

on.useHandler = useHandler;
on.useHandler('click');



var capsid = Object.freeze({
	def: def,
	prep: prep,
	make: make,
	mount: mount,
	unmount: unmount,
	get: get,
	install: install$$1,
	on: on,
	emits: emits,
	wired: wired,
	component: component,
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
exports.emits = emits;
exports.wired = wired;
exports.component = component;
exports.notifies = notifies;
exports.__ccc__ = ccc;
exports.pluginHooks = pluginHooks;

return exports;

}({}));
