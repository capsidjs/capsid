import { triggerToElements } from "../util/event_trigger.ts";
import check from "../util/check.ts";

/**
 * Publishes the given event to the elements which has `sub:${event}` class.
 * For example `@pub('foo')` publishes the `foo` event to the elements
 * which have `sub:foo` class.
 * @param event The event name
 * @param targetSelector? The target selector. Default .sub\:{event}
 */
export default (event: string, targetSelector?: string) =>
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
      `Unable to publish empty event: constructor=${constructor.name} key=${key}`,
    );

    const selector = targetSelector || `.sub\\:${event}`;

    descriptor.value = function () {
      const result = method.apply(this, arguments);
      triggerToElements(
        // deno-lint-ignore no-explicit-any
        [].concat.apply([], document.querySelectorAll(selector) as any),
        event,
        false,
        result,
      );
      return result;
    };
  };
