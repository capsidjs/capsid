// @flow

import ccc from "./ccc.js";
import { checkComponentNameIsValid } from "./util/check.js";

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 */
export default (name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name);

  ccc[name](el);
};
