/**
 * class-component.js v5.0.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */


(function ($) {
    'use strict';

    var reSpaces = / +/;

    var ClassComponentManager = require('./lib/ClassComponentManager');
    var ClassComponentConfiguration = require('./lib/ClassComponentConfiguration');

    /**
     Registers a class component of the given name using the given defining function.

     See README.md for details.

     @param {String} className The class name
     @param {Function} definition The class definition
     */
    var registerClassComponent = function (name, definingFunction) {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string');

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a string');

        }

        ccm.register(name, new ClassComponentConfiguration(name, definingFunction));


        $(document).ready(function () {

            ccm.init(name);

        });

    };



    /**
     * The main namespace for class component modules.
     */
    $.cc = registerClassComponent;
    $.cc.register = registerClassComponent;

    var ccm = $.cc.__manager__ = new ClassComponentManager();


    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Promise}
     */
    $.cc.init = function (classNames, elem) {

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces);

        }

        var elemGroups = classNames.map(function (className) {

            return ccm.init(className, elem);

        });

        return Array.prototype.concat.apply([], elemGroups);

    };

    $.cc.subclass = require('subclassjs');

}(jQuery));
