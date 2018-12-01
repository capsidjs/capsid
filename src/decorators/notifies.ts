/* tslint:disable:no-invalid-this */
import trigger from '../util/event-trigger'
import check from '../util/check'

/**
 * Adds the function to publish the given event to the descendent elements of the given selector to the decorated method.
 */
export default (event: string, selector: string) => (
  descriptor: any,
  _: string
) => {
  const key = descriptor.key
  const d = descriptor.descriptor
  const method = d.value

  descriptor.finisher = (constructor: any) => {
    check(
      !!event,
      `Unable to notify empty event: constructor=${constructor.name} key=${key}`
    )
  }

  d.value = function() {
    const result = method.apply(this, arguments)
    const forEach = [].forEach

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
