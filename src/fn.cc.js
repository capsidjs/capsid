'use strict'

const ClassComponentContext = require('./class-component-context')

const CLASS_COMPONENT_DATA_KEY = '__class_component_data__'

// Defines the special property cc on the jquery prototype.
Object.defineProperty(jQuery.fn, 'cc', {

  get () {
    let cc = this.data(CLASS_COMPONENT_DATA_KEY)

    if (cc) {
      return cc
    }

    const ctx = new ClassComponentContext(this)

    cc = classNames => ctx.up(classNames)

    cc.get = className => ctx.get(className)
    cc.init = className => ctx.init(className)

    this.data(CLASS_COMPONENT_DATA_KEY, cc)

    return cc
  },

  enumerable: false,
  configurable: false

})
