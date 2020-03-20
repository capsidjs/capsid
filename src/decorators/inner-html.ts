import { BEFORE_MOUNT_KEY } from '../util/const'

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (innerHTML: string) => (Cls: Function) => {
  const target = Cls as any
  const list = target[BEFORE_MOUNT_KEY] = target[BEFORE_MOUNT_KEY] || []
  list.push((el: HTMLElement) => {
    el.innerHTML = innerHTML
  })
}
