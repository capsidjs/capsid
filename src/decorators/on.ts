import { KEY_EVENT_LISTENERS } from '../util/const'
import debugMessage from '../util/debug-message'
import check from '../util/check'

declare var __DEV__: boolean

/**
 * The decorator for registering event listener info to the method.
 * @param event The event name
 * @param at The selector
 */
const on: any = (event: string, { at }: { at?: string } = {}) => (
  target: any,
  key: string,
  _: any
) => {
  const constructor = target.constructor
  check(
    !!event,
    `Empty event handler is given: constructor=${constructor.name} key=${key}`
  )
  /**
   * @param el The element
   * @param coelem The coelement
   * @param name The component name
   */
  constructor[KEY_EVENT_LISTENERS] = (
    constructor[KEY_EVENT_LISTENERS] || []
  ).concat((el: HTMLElement, coelem: any, name: string) => {
    const keyEventListeners = KEY_EVENT_LISTENERS + name

    const listener = (e: Event): void => {
      if (
        !at ||
        [].some.call(el.querySelectorAll(at), (node: Node) => {
          return node === e.target || node.contains(e.target as Node)
        })
      ) {
        if (__DEV__) {
          debugMessage({
            type: 'event',
            module: '💊',
            color: '#e0407b',
            e,
            el,
            coelem
          })
        }

        coelem[key](e)
      }
    }

    /**
     * Removes the event listener.
     */
    listener.remove = () => {
      el.removeEventListener(event, listener)
    }

    /**
     * Store event listeners to remove it later.
     */
    ;(el as any)[keyEventListeners] = (
      (el as any)[keyEventListeners] || []
    ).concat(listener)

    el.addEventListener(event, listener)
  })
}

export default on
