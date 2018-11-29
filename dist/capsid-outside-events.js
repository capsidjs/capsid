(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.capsidOutsideEventsPlugin = factory());
}(this, (function () { 'use strict';

var KEY_OUTSIDE_EVENT_LISTENERS = '#O';

var install = function install(capsid) {
  var on = capsid.on,
      pluginHooks = capsid.pluginHooks;

  on.outside = function (event) {
    return function (descriptor) {
      var key = descriptor.key;

      descriptor.finisher = function (constructor) {
        constructor[KEY_OUTSIDE_EVENT_LISTENERS] = (constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []).concat(function (el, coelem) {
          var listener = function listener(e) {
            if (el !== e.target && !el.contains(e.target)) {
              coelem[key](e);
            }
          };

          document.addEventListener(event, listener);
        });
      };
    };
  };

  pluginHooks.push(function (el, coelem) {
    
    (coelem.constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []).map(function (eventListenerBinder) {
      eventListenerBinder(el, coelem);
    });
  });
};

var outsideEventsPlugin = {
  install: install
};

return outsideEventsPlugin;

})));
