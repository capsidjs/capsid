import ccc from '../ccc'
/**
 * Asserts the given condition holds, otherwise throws.
 * @param assertion The assertion expression
 * @param message The assertion message
 */
export default function check(assertion: boolean, message: string): void {
  if (!assertion) {
    throw new Error(message)
  }
}

/**
 * @param classNames The class names
 */
export function checkClassNamesAreStringOrNull(classNames: any): void {
  check(
    typeof classNames === 'string' || classNames == null,
    'classNames must be a string or undefined/null.'
  )
}

/**
 * Asserts the given name is a valid component name.
 * @param name The component name
 */
export function checkComponentNameIsValid(name: any): void {
  check(typeof name === 'string', 'The name should be a string')
  check(
    !!ccc[name],
    `The coelement of the given name is not registered: ${name}`
  )
}
