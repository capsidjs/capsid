import { BEFORE_MOUNT_KEY } from "./util/const.ts";

/**
 * Initialize component by the class constructor.
 * @param Constructor The coelement class
 * @param el The element
 * @return The created coelement instance
 */
// deno-lint-ignore no-explicit-any
export default (Constructor: any, el: HTMLElement): any => {
  const coel = new Constructor();

  // Assigns element to coelement's .el property
  coel.el = el;

  // Initialize `before mount` hooks
  // This includes:
  // - initialization of event handlers
  // - initialization of innerHTML
  // - initialization of class names
  const list = Constructor[BEFORE_MOUNT_KEY];
  if (Array.isArray(list)) {
    list.forEach((cb) => {
      cb(el, coel);
    });
  }

  if (typeof coel.__mount__ === "function") {
    coel.__mount__();
  }

  return coel;
};
