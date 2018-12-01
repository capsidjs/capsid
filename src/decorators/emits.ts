import trigger from '../util/event-trigger'
import check from '../util/check'

/**
 * `@emits(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
const emits = (event: string) => (descriptor: any, _: string) => {
  const method = descriptor.descriptor.value
  const key = descriptor.key

  descriptor.finisher = (constructor: any) => {
    check(
      !!event,
      `Unable to emits an empty event: constructor=${
        constructor.name
      } key=${key}`
    )
  }

  descriptor.descriptor.value = function () {
    const result = method.apply(this, arguments)

    const emit = (x: unknown) => trigger(this.el, event, true, x)

    if (result && result.then) {
      result.then(emit)
    } else {
      emit(result)
    }

    return result
  }
}

export default emits
