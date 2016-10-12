// @flow
/**
 * Asserts the given condition holds, otherwise throws.
 * @param {boolean} assertion The assertion expression
 * @param {string} message The assertion message
 */
export default function assert (assertion: boolean, message: string) {
  if (!assertion) {
    throw new Error(message)
  }
}

/**
 * @param {any} classNames The class names
 */
export function assertClassNamesAreStringOrNull (classNames: any) {
  assert(typeof classNames === 'string' || classNames == null, 'classNames must be a string or undefined/null.')
}
