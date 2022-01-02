import { addMountHook } from "../add_hidden_item.ts";

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (...args: string[]) =>
  // deno-lint-ignore ban-types
  (Cls: Function) => {
    addMountHook(Cls, (el: HTMLElement) => {
      el.classList.add(...args);
    });
  };
