import { IS_KEY } from '../util/const'

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (...args: string[]) => (Cls: Function) => {
  (Cls as any)[IS_KEY] = args
}
