import registry from "./registry.ts";
import prep from "./prep.ts";
import initComponent from "./init_component.ts";

import check from "./util/check.ts";
import { ready } from "./util/document.ts";
import { COELEMENT_DATA_KEY_PREFIX, COMPONENT_NAME_KEY } from "./util/const.ts";
import { addMountHook } from "./add_hidden_item.ts";

/**
 * Registers the class-component for the given name and constructor and returns the constructor.
 * @param name The component name
 * @param Constructor The constructor of the class component
 * @return The registered component class
 */
// deno-lint-ignore ban-types
const def = (name: string, Constructor: Function) => {
  check(
    typeof name === "string",
    "`name` of a class component has to be a string.",
  );
  check(
    typeof Constructor === "function",
    "`Constructor` of a class component has to be a function",
  );
  // deno-lint-ignore no-explicit-any
  (Constructor as any)[COMPONENT_NAME_KEY] = name;
  const initClass = `${name}-💊`;

  // deno-lint-ignore no-explicit-any
  addMountHook(Constructor, (el: HTMLElement, coel: any) => {
    // deno-lint-ignore no-explicit-any
    (el as any)[COELEMENT_DATA_KEY_PREFIX + name] = coel;
    // FIXME(kt3k): the below can be written as .add(name, initClass)
    // when deno_dom fixes add class.
    el.classList.add(name);
    el.classList.add(initClass);
  });

  /**
   * Initializes the html element by the configuration.
   * @param el The html element
   */
  const initializer = (el: HTMLElement) => {
    if (!el.classList.contains(initClass)) {
      initComponent(Constructor, el);
    }
  };

  // The selector
  initializer.sel = `.${name}:not(.${initClass})`;

  registry[name] = initializer;

  ready().then(() => {
    prep(name);
  });
};

export default def;
