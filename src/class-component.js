/**
 * class-component.js v6.0.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
const $ = jQuery

const reSpaces = / +/

const Coelement = require('./coelement')
const ClassComponentManager = require('./class-component-manager')
const event = require('./cc-event').event
const trigger = require('./cc-event').trigger

/**
 * Initializes the module object.
 *
 * @return {Object}
 */
function initializeModule() {

    require('./fn.cc')

    /**
     * The main namespace for class component module.
     */
    const cc = (className, Constructor) => {
        cc.__register(className, Constructor)
    }

    cc.__manager__ = new ClassComponentManager()

    /**
     * Registers a class component of the given name using the given defining function.
     *
     * @param {String} className The class name
     * @param {Function} Constructor The class definition
     */
    cc.__register = (name, Constructor) => {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string')

        }

        if (typeof Constructor !== 'function') {

            throw new Error('`Constructor` of a class component has to be a function')

        }

        cc.__manager__.register(name, Constructor)


        $(document).ready(() => {

            cc.__manager__.init(name)

        })

    }


    /**
     * Initialized the all class components of the given names and returns of the promise of all initialization.
     *
     * @param {String[]|String} arguments
     * @return {Object<HTMLElement[]>}
     */
    cc.init = (classNames, elem) => {

        if (classNames == null) {

            cc.__manager__.initAll(elem)

            return

        }

        if (typeof classNames === 'string') {

            classNames = classNames.split(reSpaces)

        }

        return classNames.map(className => cc.__manager__.init(className, elem))

    }

    /**
     * The decorator for class assignment.
     *
     * @example
     *   @$.cc.component('foo')
     *   class Foo extends Bar {
     *     ...
     *   }
     *
     * The above is the same as `$.cc.assign('foo', Foo)`
     *
     * @param {String} className The class name
     * @return {Function}
     */
    cc.component = className => Cls => cc.__register(className, Cls)

    // Exports Actor.
    cc.Coelement = Coelement

    // Exports event decorator
    cc.event = event

    // Exports trigger decorator
    cc.trigger = trigger

    return cc

}

// If the cc is not set, then create one.
if ($.cc == null) {

    $.cc = initializeModule()

}

module.exports = $.cc
