import ListenerInfo from './listener-info'
import camelToKebab from './camel-to-kebab'

/**
 * @param {Function} constructor The constructor
 * @param {string} key The key of handler method
 * @param {string} event The event name
 * @param {string} selector The selector
 */
const registerListenerInfo = (constructor, key, event, selector) => {
  (constructor.__events__ = constructor.__events__ || []).push(new ListenerInfo(event, selector, key))
}

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 */
export const on = event => {
  const onDecorator = (target, key) => {
    registerListenerInfo(target.constructor, key, event)
  }

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} selector The selector for listening.
   */
  onDecorator.at = selector => (target, key) => {
    registerListenerInfo(target.constructor, key, event, selector)
  }

  return onDecorator
}

/**
 * `@emit(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param {string} event The event name
 */
export const emit = event => {
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
    const method = descriptor.value

    descriptor.value = function () {
      const result = method.apply(this, arguments)

      if (result && result.then) {
        Promise.resolve(result).then(x => this.elem.trigger(event, x))
      } else {
        this.elem.trigger(event, result)
      }

      return result
    }
  }

  return emitDecorator
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
export const wire = (target, key, descriptor) => {
  if (!descriptor) {
    // If the descriptor is not given, then suppose this is called as @wire(componentName, selector) and therefore
    // we need to return the following expression (it works as another decorator).
    return wireByNameAndSelector(target, key)
  }

  wireByNameAndSelector(camelToKebab(key))(target, key, descriptor)
}
