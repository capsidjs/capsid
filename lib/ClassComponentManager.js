

var subclass = require('subclassjs');

/**
 * ClassComponentManger handles the registration and initialization of the class compoents.
 *
 * @class
 */
var ClassComponentManager = subclass(function (pt) {

    pt.constructor = function () {

        /**
         * @property {Object<ClassComponentConfiguration>} ccc
         */
        this.ccc = {};

    };

    /**
     * Registers the class component configuration for the given name.
     *
     * @param {String} name The name
     * @param {ClassComponentConfiguration} ccc The class component configuration
     */
    pt.register = function (name, ccc) {

        this.ccc[name] = ccc;

    };


    /**
     * Gets the class component of the given name.
     *
     * @param {String} name The name
     * @return {ClassComponentConfiguration}
     */
    pt.get = function (name) {

        return this.ccc[name];

    };

    /**
     * Initializes the class components of the given name on the given dom.
     *
     * @param {String} name The name
     * @param {HTMLElement|String} dom The dom where class componets are initialized
     * @return {Array<HTMLElement>} The elements which are initialized in this initialization
     * @throw {Error}
     */
    pt.init = function (name, dom) {

        var ccc = this.ccc[name];

        if (ccc == null) {

            throw new Error('Class componet "' + name + '" is not defined.');

        }

        var elements = $(ccc.selector(), dom).each(function () {

            ccc.markInitialized(this);

            ccc.applyCustomDefinition(this);

        });

        return elements.toArray();

    };

});

module.exports = ClassComponentManager;
