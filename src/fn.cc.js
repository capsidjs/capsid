import {getConfiguration, ccc} from './class-component-manager.js'
import assert from './assert.js'
import {COELEMENT_DATA_KEY_PREFIX, CLASS_COMPONENT_DATA_KEY, OBJECT} from './const'

// Defines the special property cc on the jquery prototype.
export default $ => OBJECT.defineProperty($.fn, 'cc', {
  get () {
    const elem = this
    let cc = elem.data(CLASS_COMPONENT_DATA_KEY)

    if (!cc) {
      /**
       * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
       * @param {string} classNames The class component names
       * @return {jQuery}
       */
      cc = classNames => {
        (typeof classNames === 'string' ? classNames : elem[0].className).split(/\s+/).forEach(className => {
          if (ccc[className]) {
            getConfiguration(className).initElem(elem.addClass(className))
          }
        })

        return elem
      }
      elem.data(CLASS_COMPONENT_DATA_KEY, cc)

      /**
       * Gets the coelement of the given name.
       * @param {String} coelementName The name of the coelement
       * @return {Object}
       */
      cc.get = coelementName => {
        assert(elem[0], 'coelement "' + coelementName + '" unavailable at empty dom selection')

        const coelement = elem.data(COELEMENT_DATA_KEY_PREFIX + coelementName)

        assert(coelement, 'no coelement named: ' + coelementName + ', on the dom: ' + elem[0].tagName)

        return coelement
      }

      cc.init = className => cc(className).cc.get(className)
    }

    return cc
  }
})
