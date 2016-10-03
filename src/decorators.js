import {registerListenerInfo} from './register-listener-info.js'
import camelToKebab from './camel-to-kebab.js'
import {register as cc} from './class-component-manager.js'
import isFunction from './is-function.js'

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 * @param {string} at The selector
 */
cc.on = (event, {at} = {}) => {
  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} selector The selector for listening.
   */
  const atDecorator = selector => (target, key) => {
    registerListenerInfo(target.constructor, key, event, selector)
  }

  const onDecorator = atDecorator(at)
  onDecorator.at = atDecorator

  return onDecorator
}

/**
 * `@emit(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param {string} event The event name
 */
cc.emit = event => {
  const emitDecorator = (target, key, descriptor) => {
    const method = descriptor.value

    descriptor.value = function () {
      this.elem.trigger(event, arguments)

      return method.apply(this, arguments)
    }
  }

  /**
   * `@emit(event).first` decorator. This is the same as emit()
   * @param {string} event The event name
   */
  emitDecorator.first = emitDecorator

  /**
   * `@emit(event).last` decorator.
   * This adds the emission of the event at the end of the method.
   * @param {string} event The event name
   */
  emitDecorator.last = (target, key, descriptor) => {
    cc.emit.last(event)(target, key, descriptor)
  }

  return emitDecorator
}

cc.emit.first = cc.emit
cc.emit.last = event => (target, key, descriptor) => {
  const method = descriptor.value

  descriptor.value = function () {
    const result = method.apply(this, arguments)

    if (result && result.then) {
      result.then(x => this.elem.trigger(event, x))
    } else {
      this.elem.trigger(event, result)
    }

    return result
  }
}

/**
 * Replaces the getter with the function which accesses the class-component of the given name.
 * @param {string} name The class component name
 * @param {string} [selector] The selector to access class component dom. Optional. Default is '.[name]'.
 * @param {object} target The prototype of the target class
 * @param {string} key The name of the property
 * @param {object} descriptor The property descriptor
 */
const wireByNameAndSelector = (name, selector) => (target, key, descriptor) => {
  selector = selector || '.' + name

  descriptor.get = function () {
    const matched = this.elem.filter(selector).add(selector, this.elem)

    if (matched[1]) { // meaning matched.length > 1
      console.warn(`There are ${matched.length} matches for the given wired getter selector: ${selector}`)
    }

    return matched.cc.get(name)
  }
}

/**
 * Wires the class component of the name of the key to the property of the same name.
 */
cc.wire = (target, key, descriptor) => {
  if (!descriptor) {
    // If the descriptor is not given, then suppose this is called as @wire(componentName, selector) and therefore
    // we need to return the following expression (it works as another decorator).
    return wireByNameAndSelector(target, key)
  }

  wireByNameAndSelector(camelToKebab(key))(target, key, descriptor)
}

/**
 * The decorator for class component registration.
 * @param {String|Function} name The class name or the implementation class itself
 * @return {Function|undefined} The decorator if the class name is given, undefined if the implementation class is given
 */
cc.component = name => {
  if (!isFunction(name)) {
    return Cls => {
      cc(name, Cls)
      return Cls
    }
  }

  // if `name` is function, then use it as class itself and the component name is kebabized version of its name.
  cc(camelToKebab(name.name), name)
  return name
}
