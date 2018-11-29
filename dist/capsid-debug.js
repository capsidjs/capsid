(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.capsidDebugPlugin = factory());
}(this, (function () { 'use strict';

var COMPONENT_NAME_KEY = 'N$';

var install = function install() {
  global.capsidDebugMessage = function (message) {
    switch (message.type) {
      case 'event':
        onEventMessage(message);
        break;

      default:
        console.log("Unknown message: ".concat(JSON.stringify(message)));
    }
  };
};
/**
 * Gets the bold colored style.
 */


var boldColor = function boldColor(color) {
  return "color: ".concat(color, "; font-weight: bold;");
};
/**
 * Gets the displayable component name.
 */


var getComponentName = function getComponentName(coelem) {
  var constructor = coelem.constructor;
  return "".concat(constructor[COMPONENT_NAME_KEY] || constructor.name);
};

var onEventMessage = function onEventMessage(_ref) {
  var coelem = _ref.coelem,
      e = _ref.e,
      module = _ref.module,
      color = _ref.color;
  var event = e.type;
  var component = getComponentName(coelem);
  color = color || '#f012be';
  console.groupCollapsed("".concat(module, "> %c").concat(event, "%c on %c").concat(component), boldColor(color), '', boldColor('#1a80cc'));
  console.log(e);

  if (e.target) {
    console.log(e.target);
  }

  if (coelem.el) {
    console.log(coelem.el);
  }

  console.groupEnd();
};

var debugPlugin = {
  install: install
};

return debugPlugin;

})));
