var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.capsidDebugMessage = factory();
})(this, function () {
  'use strict';

  //      


  var COMPONENT_NAME_KEY = '$N';

  //      

  var debugPlugin = function debugPlugin(message) {
    switch (message.type) {
      case 'event':
        onEventMessage(message);
        break;
      default:
        console.log('Unknown message: ' + JSON.stringify(message));
    }
  };

  var onEventMessage = function onEventMessage(_ref) {
    var el = _ref.el,
        coelem = _ref.coelem,
        e = _ref.e;
    var constructor = coelem.constructor;

    var event = '' + e.type;
    var component = '' + (constructor[COMPONENT_NAME_KEY] || constructor.name);

    var eventStyle = 'color: magenta; font-weight: bold;';
    var componentStyle = 'color: green; font-weight: bold;';

    console.groupCollapsed('%c' + event + ' %con %c' + component, eventStyle, '', componentStyle);
    console.log(e);
    console.groupEnd();
  };

  return debugPlugin;
});