'use strict'

import ClassComponentContext from './class-component-context'

// Defines the special property cc on a jquery property.
Object.defineProperty(jQuery.fn, 'cc', {

    get: function () {

        let ctx = this.data('__class_component_context__')

        if (!ctx) {

            ctx = new ClassComponentContext(this)

            this.data('__class_component_context__', ctx)

        }

        return ctx

    },

    enumerable: false,
    configurable: false

})
