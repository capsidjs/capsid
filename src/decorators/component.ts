import def from "../def";
import check from "../util/check";

/**
 * The decorator for class component registration.
 *
 * @param name The html class name to mount
 */
const component = (name: string): ((desc: any) => void) => {
  check(
    typeof name === "string" && !!name,
    "Component name must be a non-empty string",
  );

  return (Cls: Function) => {
    def(name, Cls);
  };
};

export default component;
