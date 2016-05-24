'use strict'

const ClassComponentContext = require('./class-component-context')

const CLASS_COMPONENT_DATA_KEY = '__class_component_data__'

// Defines the special property cc on a jquery property.
Object.defineProperty(jQuery.fn, 'cc', {

    get() {

        if (!this.data(CLASS_COMPONENT_DATA_KEY)) {

            const ctx = new ClassComponentContext(this)

            const cc = classNames => ctx.up(classNames)

            cc.get = className => ctx.get(className)
            cc.init = className => ctx.init(className)

            this.data(CLASS_COMPONENT_DATA_KEY, cc)

        }

        return this.data(CLASS_COMPONENT_DATA_KEY)

    },

    enumerable: false,
    configurable: false

})
