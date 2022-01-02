import registry from "../registry.ts";
/**
 * Asserts the given condition holds, otherwise throws.
 * @param assertion The assertion expression
 * @param message The assertion message
 */
export default function check(assertion: boolean, message: string): void {
  if (!assertion) {
    throw new Error(message);
  }
}

/**
 * Asserts the given name is a valid component name.
 * @param name The component name
 */
// deno-lint-ignore no-explicit-any
export function checkComponentNameIsValid(name: any): void {
  check(typeof name === "string", "The name should be a string");
  check(
    !!registry[name],
    `The coelement of the given name is not registered: ${name}`,
  );
}
