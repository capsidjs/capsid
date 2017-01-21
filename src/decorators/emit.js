// @flow

import trigger from '../util/event-trigger.js'

/**
 * `@emit(event)` decorator.
 * This decorator adds the event emission at the beginning of the method.
 * @param event The event name
 */
const emit = (event: string) => (target: Object, key: string, descriptor: Object) => {
  const method = descriptor.value

  descriptor.value = function () {
    trigger(this.el, event, arguments[0])

    return method.apply(this, arguments)
  }
}

/**
 * `@emit.last(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
emit.last = (event: string) => (target: Object, key: string, descriptor: Object) => {
  const method = descriptor.value

  descriptor.value = function () {
    const result = method.apply(this, arguments)

    const emit = x => trigger(this.el, event, x)

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}

export default emit
