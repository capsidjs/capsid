import { addMountHook } from '../add-hidden-item'

/**
 * is decorator adds the class names to the given element when it's mounted.
 * @param args The list of class names
 */
export default (innerHTML: string) => (Cls: Function) => {
  addMountHook(Cls, (el: HTMLElement) => {
    el.innerHTML = innerHTML
  })
}
