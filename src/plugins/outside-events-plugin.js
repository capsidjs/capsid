// @flow

import debugMessage from '../util/debug-message.js'

declare var __DEV__: boolean

const KEY_OUTSIDE_EVENT_LISTENERS = '#O'

const install = (capsid: any) => {
  const { on, pluginHooks } = capsid

  on.outside = (event: string) => (descriptor: Object) => {
    const key = descriptor.key
    descriptor.finisher = constructor => {
      constructor[KEY_OUTSIDE_EVENT_LISTENERS] = (
        constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []
      ).concat((el: HTMLElement, coelem: any) => {
        const listener = (e: Event): void => {
          if (el !== e.target && !el.contains((e.target: any))) {
            if (__DEV__) {
              debugMessage({
                type: 'event',
                module: 'outside-events',
                color: '#39cccc',
                el,
                e,
                coelem
              })
            }

            coelem[key](e)
          }
        }

        document.addEventListener(event, listener)
      })
    }
  }

  pluginHooks.push((el: HTMLElement, coelem: any) => {
    ;(coelem.constructor[KEY_OUTSIDE_EVENT_LISTENERS] || []).map(
      eventListenerBinder => {
        eventListenerBinder(el, coelem)
      }
    )
  })
}

export default { install }
