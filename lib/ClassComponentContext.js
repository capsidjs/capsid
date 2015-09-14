

var $ = global.jQuery;
var subclass = require('subclassjs');


/**
 * This is class component contenxt manager. This help to initialize or get colements.
 */
var ClassComponentContext = subclass(function (pt) {

    pt.constructor = function (jqObj) {

        this.jqObj = jqObj;

    };

    /**
     * Inserts the class name, initializes as the class component and returns the coelement if exists.
     *
     * @param {String} className The class name
     * @return {Object}
     */
    pt.init = function (className) {

        this.jqObj.addClass(className);

        $.cc.__manager__.initAt(className, this.jqObj);

        return this.jqObj.data('__coelement:' + className); // Could be undefined
    };

    /**
     * Gets the coelement of the given name.
     *
     * @param {String} coelementName The name of the coelement
     * @return {Object}
     */
    pt.get = function (coelementName) {

        var coelement = this.jqObj.data('__coelement:' + coelementName);

        if (!coelement) {

            throw new Error('no coelement named: ' + coelementName + ', on the dom: ' + this.jqObj.get(0).tagName);

        }

        return coelement;

    };

    pt.getActor = function () {

        var actor = this.jqObj.data('__primary_coelement');

        if (!actor) {

            throw new Error('no actor on the dom: ' + this.jqObj.get(0).tagName);

        }

        return actor;

    };

});

module.exports = ClassComponentContext;
