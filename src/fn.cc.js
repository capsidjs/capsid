import ClassComponentContext from './class-component-context'

const CLASS_COMPONENT_DATA_KEY = '__class_component_data__'

// Defines the special property cc on the jquery prototype.
export default $ => Object.defineProperty($.fn, 'cc', {
  get () {
    let cc = this.data(CLASS_COMPONENT_DATA_KEY)

    if (!cc) {
      const ctx = new ClassComponentContext(this)

      cc = classNames => ctx.up(classNames)

      cc.get = className => ctx.get(className)
      cc.init = className => {
        cc(className)
        return cc.get(className)
      }

      this.data(CLASS_COMPONENT_DATA_KEY, cc)
    }

    return cc
  }
})
