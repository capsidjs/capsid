import {componentGet, componentInit} from './class-component-util.js'

const CLASS_COMPONENT_DATA_KEY = '__class_component_data__'

// Defines the special property cc on the jquery prototype.
export default $ => Object.defineProperty($.fn, 'cc', {
  get () {
    let cc = this.data(CLASS_COMPONENT_DATA_KEY)

    if (!cc) {
      this.data(CLASS_COMPONENT_DATA_KEY, cc = classNames => {
        componentInit(this, classNames)
        return this
      })

      cc.get = className => componentGet(this, className)
      cc.init = className => cc(className).cc.get(className)
    }

    return cc
  }
})
