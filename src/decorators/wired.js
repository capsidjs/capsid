// @flow

import get from '../get.js'
import matches from '../util/matches.js'
import check from '../util/check.js'

/**
 * Wires the class component of the name of the key to the property of the same name.
 *
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param {string} name The class component name
 * @param {string} [selector] The selector to access class component dom. Optional. Default is '.[name]'.
 * @param {object} target The prototype of the target class
 * @param {string} key The name of the property
 * @param {object} descriptor The property descriptor
 */
const wireComponent = (name: string, selector?: string) => (target: Object, key: string, descriptor: Object) => {
  const sel: string = selector || `.${name}`

  descriptor.get = function () {
    check(!!this.el, `Component's element is not ready. Probably wired getter called at constructor.(class=[${this.constructor.name}]`)

    if (matches.call(this.el, sel)) {
      return get(name, this.el)
    }

    const nodes = this.el.querySelectorAll(sel)

    check(nodes.length > 0, `wired component "${name}" is not available at ${this.el.tagName}(class=[${this.constructor.name}]`)

    return get(name, nodes[0])
  }
}

const wireElement = (sel: string) => (target: Object, key: string, descriptor: Object) => {
  descriptor.get = function () {
    return this.el.querySelector(sel)
  }
}

const wireElementAll = (sel: string) => (target: Object, key: string, descriptor: Object) => {
  descriptor.get = function () {
    return this.el.querySelectorAll(sel)
  }
}

const wired = wireElement
wired.all = wireElementAll
wired.component = wireComponent

export default wired
