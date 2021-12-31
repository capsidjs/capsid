import { checkComponentNameIsValid } from "./util/check.ts";
import registry from "./registry.ts";

/**
 * Initializes the class components of the given name in the range of the given element.
 * @param name The class name
 * @param el The dom where class componets are initialized
 * @throws when the class name is invalid type.
 */
export default (name?: string | null, el?: Element): void => {
  let classNames;

  if (!name) {
    classNames = Object.keys(registry);
  } else {
    checkComponentNameIsValid(name);

    classNames = [name];
  }

  classNames.map((className) => {
    [].map.call(
      (el || document).querySelectorAll(registry[className].sel),
      registry[className],
    );
  });
};
