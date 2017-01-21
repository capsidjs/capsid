// @flow

import get from '../get.js'
import matches from '../util/matches.js'
import camelToKebab from '../util/camel-to-kebab.js'

/**
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param {string} name The class component name
 * @param {string} [selector] The selector to access class component dom. Optional. Default is '.[name]'.
 * @param {object} target The prototype of the target class
 * @param {string} key The name of the property
 * @param {object} descriptor The property descriptor
 */
const wireByNameAndSelector = (name: string, selector?: string) => (target: Object, key: string, descriptor: Object) => {
  const sel: string = selector || `.${name}`

  descriptor.get = function () {
    if (matches.call(this.el, sel)) {
      return get(name, this.el)
    }

    const nodes = this.el.querySelectorAll(sel)

    if (nodes.length) {
      return get(name, nodes[0])
    }

    throw new Error(`wired class-component "${name}" is not available at ${this.el.tagName}(class=[${this.constructor.name}]`)
  }
}

/**
 * Wires the class component of the name of the key to the property of the same name.
 */
export default (target: Object, key: string, descriptor: Object) => {
  if (typeof target === 'string') {
    // If target is a string, then we suppose this is called as @wire(componentName, selector) and therefore
    // we need to return the following expression (it works as another decorator).
    return wireByNameAndSelector(target, key)
  }

  wireByNameAndSelector(camelToKebab(key))(target, key, descriptor)
}
