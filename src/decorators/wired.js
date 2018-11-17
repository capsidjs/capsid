// @flow

import get from '../get.js'
import matches from '../util/matches.js'
import check from '../util/check.js'

/**
 * Wires the class component of the name of the key to the property of the same name.
 *
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param name The class component name
 * @param selector The selector to access class component dom. Optional. Default is '.[name]'.
 * @param descriptor The method element descriptor
 */
const wiredComponent = (name: string, selector?: string) => (
  descriptor: Object
) => {
  const sel: string = selector || `.${name}`
  const key = descriptor.key
  descriptor.placement = 'prototype'
  descriptor.finisher = constructor => {
    Object.defineProperty(constructor.prototype, key, {
      get () {
        check(
          !!this.el,
          `Component's element is not ready. Probably wired getter called at constructor.(class=[${
            this.constructor.name
          }]`
        )

        if (matches.call(this.el, sel)) {
          return get(name, this.el)
        }

        const nodes = this.el.querySelectorAll(sel)

        check(
          nodes.length > 0,
          `wired component "${name}" is not available at ${
            this.el.tagName
          }(class=[${this.constructor.name}]`
        )

        return get(name, nodes[0])
      }
    })
  }
}

const wired = (sel: string) => (descriptor: Object) => {
  const key = descriptor.key
  descriptor.placement = 'prototype'
  descriptor.finisher = constructor => {
    Object.defineProperty(constructor.prototype, key, {
      get () {
        return this.el.querySelector(sel)
      }
    })
  }
}

const wiredAll = (sel: string) => (descriptor: Object) => {
  const key = descriptor.key
  descriptor.placement = 'prototype'
  descriptor.finisher = (constructor: Function) => {
    Object.defineProperty(constructor.prototype, key, {
      get () {
        return this.el.querySelectorAll(sel)
      }
    })
  }
}

wired.all = wiredAll
wired.component = wiredComponent

export default wired
