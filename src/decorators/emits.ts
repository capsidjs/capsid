/* tslint:disable:no-invalid-this */
import {triggerToElements} from '../util/event-trigger'
import check from '../util/check'

/**
 * `@emits(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
const emits = (event: string) => (target: any, key: string, descriptor: any) => {
  const method = descriptor.value
  const constructor = target.constructor

  check(
    !!event,
    `Unable to emits an empty event: constructor=${
      constructor.name
    } key=${key}`
  )

  descriptor.value = function() {
    const result = method.apply(this, arguments)
    triggerToElements([this.el], event, true, result)
    return result
  }
}

export default emits
