import { KEY_EVENT_LISTENERS } from '../util/const.ts';
import debugMessage from '../util/debug_message.ts';
import check from '../util/check.ts';
import addHiddenItem, { addMountHook } from '../add_hidden_item.ts';

/**
 * The decorator for registering event listener info to the method.
 * @param event The event name
 * @param at The selector
 */
// deno-lint-ignore no-explicit-any
const on: any = (event: string, { at }: { at?: string } = {}) =>
  (
    // deno-lint-ignore no-explicit-any
    target: any,
    key: string,
    // deno-lint-ignore no-explicit-any
    _: any,
  ) => {
    const constructor = target.constructor;
    check(
      !!event,
      `Empty event handler is given: constructor=${constructor.name} key=${key}`,
    );
    /**
     * @param el The element
     * @param coel The coelement
     * @param name The component name
     */
    // deno-lint-ignore no-explicit-any
    addMountHook(constructor, (el: HTMLElement, coel: any) => {
      const listener = (e: Event): void => {
        if (
          !at ||
          [].some.call(el.querySelectorAll(at), (node: Node) => {
            return node === e.target || node.contains(e.target as Node);
          })
        ) {
          // TODO(kt3k): selectively inject __DEV__ variable
          const __DEV__ = true;
          if (__DEV__) {
            debugMessage({
              type: 'event',
              module: '💊',
              color: '#e0407b',
              e,
              el,
              coel,
            });
          }

          coel[key](e);
        }
      };

      /**
       * Removes the event listener.
       */
      listener.remove = () => {
        el.removeEventListener(event, listener);
      };

      /**
       * Store event listeners to remove it later.
       */
      addHiddenItem(coel, KEY_EVENT_LISTENERS, listener);
      el.addEventListener(event, listener);
    });
  };

export default on;
