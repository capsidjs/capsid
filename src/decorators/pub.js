// @flow

import trigger from '../util/event-trigger.js'

/**
 * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
 */
export default (event: string, selector: string) => (target: Object, key: string, descriptor: Object) => {
  const method = descriptor.value

  descriptor.value = function () {
    const result = method.apply(this, arguments)

    const emit = x => {
      this.el.querySelectorAll(selector).forEach(el => trigger(el, event, false, x))
    }

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}
