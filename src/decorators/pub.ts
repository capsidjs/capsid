/* tslint:disable:no-invalid-this */
import trigger from '../util/event-trigger'
import check from '../util/check'

/**
 * Publishes the given event to the elements which has `sub:${event}` class.
 * For example `@pub('foo')` publishes the `foo` event to the elements
 * which have `sub:foo` class.
 * @param event The event name
 * @param targetSelector? The target selector. Default .sub\:{event}
 */
export default (event: string, targetSelector?: string) => (
  target: any,
  key: string,
  descriptor: any
) => {
  const method = descriptor.value
  const constructor = target.constructor

  check(
    !!event,
    `Unable to publish empty event: constructor=${constructor.name} key=${key}`
  )

  const selector = targetSelector || `.sub\\:${event}`

  descriptor.value = function() {
    const result = method.apply(this, arguments)
    const forEach = Array.prototype.forEach

    const emit = (x: unknown) => {
      forEach.call(document.querySelectorAll(selector), (el: HTMLElement) =>
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
