import def from '../def.ts';
import check from '../util/check.ts';

/**
 * The decorator for class component registration.
 *
 * @param name The html class name to mount
 */
// deno-lint-ignore no-explicit-any
const component = (name: string): ((desc: any) => void) => {
  check(
    typeof name === 'string' && !!name,
    'Component name must be a non-empty string',
  );

  // deno-lint-ignore ban-types
  return (Cls: Function) => {
    def(name, Cls);
  };
};

export default component;
