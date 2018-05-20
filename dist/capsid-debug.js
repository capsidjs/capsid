var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.capsidDebugMessage = factory();
})(this, function () {
  'use strict';

  //      


  var COMPONENT_NAME_KEY = 'N$';

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

  /**
   * Gets the bold colored style.
   */
  var boldColor = function boldColor(color) {
    return 'color: ' + color + '; font-weight: bold;';
  };

  /**
   * Gets the displayable component name.
   */
  var getComponentName = function getComponentName(coelem) {
    var constructor = coelem.constructor;

    return '' + (constructor[COMPONENT_NAME_KEY] || constructor.name);
  };

  var onEventMessage = function onEventMessage(_ref) {
    var coelem = _ref.coelem,
        e = _ref.e,
        module = _ref.module,
        color = _ref.color;

    var event = e.type;
    var component = getComponentName(coelem);
    color = color || '#f012be';

    console.groupCollapsed(module + '> %c' + event + '%c on %c' + component, boldColor(color), '', boldColor('#1a80cc'));
    console.log(e);
    console.groupEnd();
  };

  return debugPlugin;
});