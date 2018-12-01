(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.capsidDebugPlugin = factory());
}(this, (function () { 'use strict';

var COMPONENT_NAME_KEY = 'N$';

var install = function () {
    
    global.capsidDebugMessage = function (message) {
        switch (message.type) {
            case 'event':
                onEventMessage(message);
                break;
            default:
                console.log("Unknown message: " + JSON.stringify(message));
        }
    };
};
var boldColor = function (color) {
    return "color: " + color + "; font-weight: bold;";
};
var getComponentName = function (coelem) {
    var constructor = coelem.constructor;
    return "" + (constructor[COMPONENT_NAME_KEY] || constructor.name);
};
var defaultEventColor = '#f012be';
var onEventMessage = function (_a) {
    var coelem = _a.coelem, e = _a.e, module = _a.module, color = _a.color;
    var event = e.type;
    var component = getComponentName(coelem);
    console.groupCollapsed(module + "> %c" + event + "%c on %c" + component, boldColor(color || defaultEventColor), '', boldColor('#1a80cc'));
    console.log(e);
    if (e.target) {
        console.log(e.target);
    }
    if (coelem.el) {
        console.log(coelem.el);
    }
    console.groupEnd();
};
var debugPlugin = { install: install };

return debugPlugin;

})));
