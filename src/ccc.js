// @flow
type Initializer = { (el: HTMLElement, coelem: any): void; selector: string }
type cccType = { [key: string]: Initializer }

/**
 * The mapping from class-component name to its initializer function.
 */
const ccc: cccType = {}

export default ccc
