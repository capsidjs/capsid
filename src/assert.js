// @flow
import {ccc} from './register-and-init'
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

/**
 * Asserts the given name is a valid component name.
 * @param name The component name
 */
export function assertComponentNameIsValid (name: any) {
  assert(typeof name === 'string', 'The name should not be a string')
  assert(ccc[name] != null, 'The coelement of the given name is not registered: ' + name)
}
