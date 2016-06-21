const ListenerInfo = require('./listener-info')

const registerListenerInfo = (method, event, selector) => {
  method.__events__ = method.__events__ || []

  method.__events__.push(new ListenerInfo(event, selector, method))
}

/**
 * The decorator for registering event listener info to the method.
 * @param {string} event The event name
 */
const on = (event) => {
  const onDecorator = (target, key, descriptor) => {
    registerListenerInfo(descriptor.value, event)
  }

  /**
   * The decorator for registering event listener info to the method.
   * @param {string} event The event name
   * @param {string} selector The selector for listening.
   */
  onDecorator.at = (selector) => (target, key, descriptor) => {
    registerListenerInfo(descriptor.value, event, selector)
  }

  return onDecorator
}

/**
 * `@emit(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param {string} event The event name
 */
const emit = (event) => {
  const emitDecorator = (target, key, descriptor) => {
    const method = descriptor.value

    descriptor.value = function () {
      this.elem.trigger(event, arguments)

      method.apply(this, arguments)
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

      if (result != null && typeof result.then === 'function') {
        Promise.resolve(result).then(x => this.elem.trigger(event, x))
      } else {
        this.elem.trigger(event, result)
      }

      return result
    }
  }

  /**
   * `@emit(event).on.error` decorator.
   * This add the emission of the event when the method errored.
   * @param {string} event The event name
   */
  const error = (target, key, descriptor) => {
    const method = descriptor.value

    descriptor.value = function () {
      let result
      try {
        result = method.apply(this, arguments)
      } catch (e) {
        this.elem.trigger(event, e)

        throw e
      }

      Promise.resolve(result).catch(err => {
        this.elem.trigger(event, err)
      })

      return result
    }
  }

  emitDecorator.on = {error}

  return emitDecorator
}

exports.on = on
exports.emit = emit
