/* tslint:disable:no-invalid-this */
import trigger from '../util/event-trigger'
import check from '../util/check'

/**
 * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
 */
export default (event: string, selector: string) => (
  target: any,
  key: string,
  descriptor: any
) => {
  const method = descriptor.value
  const constructor = target.constructor

  check(
    !!event,
    `Unable to notify empty event: constructor=${constructor.name} key=${key}`
  )
  check(
    !!selector,
    `Error: Empty selector for @notifies: constructor=${
      constructor.name
    } key=${key} event=${event}`
  )

  descriptor.value = function() {
    const result = method.apply(this, arguments)
    const forEach = Array.prototype.forEach

    const emit = (x: unknown) => {
      forEach.call(this.el.querySelectorAll(selector), (el: HTMLElement) =>
        trigger(el, event, false, x)
      )
    }

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}
