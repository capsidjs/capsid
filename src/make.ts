import get from './get.ts';
import { checkComponentNameIsValid } from './util/check.ts';
import registry from './registry.ts';

/**
 * Initializes the given element as the class-component.
 * @param name The name of the class component
 * @param el The element to initialize
 * @return
 */
export default <T>(name: string, el: HTMLElement) => {
  checkComponentNameIsValid(name);

  registry[name](el);

  return get<T>(name, el);
};
