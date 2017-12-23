// @flow
import { KEY_EVENT_LISTENERS } from '../util/const.js'
import debugMessage from '../util/debug-message.js'

declare var __DEV__: boolean

/**
 * The decorator for registering event listener info to the method.
 * @param event The event name
 * @param at The selector
 * @param target The target prototype (decorator interface)
 * @param key The decorator target key (decorator interface)
 */
export default (event: string, { at }: { at?: string } = {}) => (
  target: Object,
  key: string
) => {
  const Constructor = target.constructor

  /**
   * @param el The element
   * @param coelem The coelement
   */
  Constructor[KEY_EVENT_LISTENERS] = (
    Constructor[KEY_EVENT_LISTENERS] || []
  ).concat((el: HTMLElement, coelem: any) => {
    el.addEventListener(event, (e: Event): void => {
      if (
        !at ||
        [].some.call(el.querySelectorAll(at), node => {
          return node === e.target || node.contains(e.target)
        })
      ) {
        if (__DEV__) {
          debugMessage({
            type: 'event',
            e,
            el,
            coelem
          })
        }

        coelem[key](e)
      }
    })
  })
}
