import { triggerToElements } from '../util/event-trigger'
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
    triggerToElements(
      [].concat.apply([], document.querySelectorAll(selector) as any),
      event,
      false,
      result
    )
    return result
  }
}
