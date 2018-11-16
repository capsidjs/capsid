// @flow

import trigger from '../util/event-trigger.js'
import check from '../util/check.js'

/**
 * `@emits(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
const emits = (event: string) => (descriptor: Object) => {
  const method = descriptor.descriptor.value
  const key = descriptor.key

  descriptor.finisher = constructor => {
    check(!!event, `Unable to emits an empty event: constructor=${constructor.name} key=${key}`)
  }

  descriptor.descriptor.value = function () {
    const result = method.apply(this, arguments)

    const emit = x => trigger(this.el, event, true, x)

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}

export default emits
