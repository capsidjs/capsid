// @flow

import check, { checkClassNamesAreStringOrNull } from '../util/check.js'

/**
 * Applies the jquery plugin to cc and $
 * @param cc The class-component function
 * @param $ The jQuery function
 */
const init = (capsid: any, $: Function): void => {
  const ccc = capsid.__ccc__
  const get = capsid.get
  const make = capsid.make
  const wire = capsid.wire

  const descriptor: any = { get: function () {
    const dom: HTMLElement = this[0]

    check(dom != null, 'cc (capsid context) is unavailable at empty dom selection')

    let cc = (dom: any).cc

    if (!cc) {
      /**
       * Initializes the element as class-component of the given names. If the names not given, then initializes it by the class-component of the class names it already has.
       * @param {?string} classNames The class component names
       * @return {jQuery}
       */
      cc = (dom: any).cc = (classNames: ?string) => {
        checkClassNamesAreStringOrNull(classNames)

        ;(classNames || dom.className).split(/\s+/).map(className => {
          if (ccc[className]) {
            make(className, dom)
          }
        })

        return this
      }

      /**
       * Gets the coelement of the given name.
       * @param {string} name The name of the coelement
       * @return {Object}
       */
      cc.get = (name: string) => get(name, dom)

      cc.init = (className: string) => cc(className).cc.get(className)
    }

    return cc
  } }

  // Defines the special property cc on the jquery prototype.
  Object.defineProperty($.fn, 'cc', descriptor)

  // Applies jQuery initializer plugin
  capsid.pluginHooks.push((el: HTMLElement, coel: any) => {
    coel.$el = $(el)
    coel.elem = coel.$el // backward compat, will be removed
  })

  // Define wire.$el decorator
  wire.$el = (sel: string) => (target: Object, key: string, descriptor: Object) => {
    descriptor.get = function () {
      return this.$el.find(sel)
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  // If the env is common js, then exports init.
  module.exports = init
} else if (typeof self !== 'undefined' && self.capsid && self.$) {
  // If the env is browser and cc and $ is already defined and this plugin isn't applied yet
  // Then applies the plugin here.
  init(self.capsid, self.$)
}
