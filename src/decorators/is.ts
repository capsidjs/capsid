import { addMountHook } from "../add-hidden-item";

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (...args: string[]) =>
  (Cls: Function) => {
    addMountHook(Cls, (el: HTMLElement) => {
      el.classList.add(...args);
    });
  };
