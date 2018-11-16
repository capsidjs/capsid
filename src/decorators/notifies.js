// @flow

import trigger from '../util/event-trigger.js'
import check from '../util/check.js'

/**
 * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
 */
export default (event: string, selector: string) => (descriptor: Object) => {
  const key = descriptor.key
  const d = descriptor.descriptor
  const method = d.value

  descriptor.finisher = constructor => {
    check(!!event, `Unable to notify empty event: constructor=${constructor.name} key=${key}`)
  }

  d.value = function () {
    const result = method.apply(this, arguments)
    const forEach = [].forEach

    const emit = x => {
      forEach.call(this.el.querySelectorAll(selector), el => trigger(el, event, false, x))
    }

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}
