import {componentGet, componentInit} from './class-component-util.js'

const CLASS_COMPONENT_DATA_KEY = '__class_component_data__'

// Defines the special property cc on the jquery prototype.
export default $ => Object.defineProperty($.fn, 'cc', {
  get () {
    const self = this
    let cc = self.data(CLASS_COMPONENT_DATA_KEY)

    if (!cc) {
      self.data(CLASS_COMPONENT_DATA_KEY, cc = classNames => {
        componentInit(self, classNames)
        return self
      })

      cc.get = className => componentGet(self, className)
      cc.init = className => cc(className).cc.get(className)
    }

    return cc
  }
})
