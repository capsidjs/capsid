import on from "./on.ts";

/**
 * Registers the on[eventName] and on[eventName].at decorators.
 * @param {string} handlerName
 */
export default (handlerName: string) => {
  on[handlerName] = on(handlerName);
  on[handlerName].at = (selector: string) => on(handlerName, { at: selector });
};
