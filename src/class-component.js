/**
 * class-component.js v5.7.6
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
const $ = jQuery

const reSpaces = / +/

import Actor from './actor'
import Coelement from './coelement'

import ClassComponentManager from './class-component-manager'

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
    const cc = {}

    cc.__manager__ = new ClassComponentManager()

    /**
     Registers a class component of the given name using the given defining function.

     See README.md for details.

     @param {String} className The class name
     @param {Function} definingFunction The class definition
     */
    cc.register = (name, definingFunction) => {

        if (typeof name !== 'string') {

            throw new Error('`name` of a class component has to be a string')

        }

        if (typeof definingFunction !== 'function') {

            throw new Error('`definingFunction` of a class component has to be a function')

        }

        cc.__manager__.register(name, definingFunction)


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
     * Assign a class as the accompanying coelement of the class component
     *
     * @param {String} className
     * @param {Function} DefiningClass
     */
    cc.assign = (className, DefiningClass) => {

        DefiningClass.coelementName = className

        cc.register(className, elem => {

            const coelement = new DefiningClass(elem)

            elem.data('__coelement:' + DefiningClass.coelementName, coelement)

        })

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
    cc.component = className => Cls => cc.assign(className, Cls)

    // Exports Actor.
    cc.Actor = Actor

    // Exports Actor.
    cc.Coelement = Coelement

    return cc

}

// If the cc is not set, then create one.
if ($.cc == null) {

    $.cc = initializeModule()

}

module.exports = $.cc
