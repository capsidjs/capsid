import { triggerToElements } from "../util/event_trigger.ts";
import check from "../util/check.ts";

/**
 * `@emits(event)` decorator
 *
 * This decorator adds the event emission at the end of the method.
 * If the method returns the promise, then the event is emitted when it is resolved.
 * @param event The event name
 */
const emits = (event: string) =>
  (
    // deno-lint-ignore no-explicit-any
    target: any,
    key: string,
    // deno-lint-ignore no-explicit-any
    descriptor: any,
  ) => {
    const method = descriptor.value;
    const constructor = target.constructor;

    check(
      !!event,
      `Unable to emits an empty event: constructor=${constructor.name} key=${key}`,
    );

    descriptor.value = function () {
      const result = method.apply(this, arguments);
      triggerToElements([this.el], event, true, result);
      return result;
    };
  };

export default emits;
