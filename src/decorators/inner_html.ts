import prep from "../prep.ts";
import { addMountHook } from "../add_hidden_item.ts";

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (innerHTML: string) =>
// deno-lint-ignore ban-types
(Cls: Function) => {
  addMountHook(Cls, (el: HTMLElement) => {
    el.innerHTML = innerHTML;
    prep(null, el);
  });
};
