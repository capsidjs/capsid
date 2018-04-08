// @flow

import get from './get.js'
import { COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS } from './util/const.js'

export default (name: string, el: HTMLElement): void => {
  const coel = get(name, el)

  if (typeof coel.__unmount__ === 'function') {
    coel.__unmount__()
  }

  el.classList.remove(name, `${name}-💊`)

  ;((el: any)[KEY_EVENT_LISTENERS] || []).forEach(listener => {
    listener.remove()
  })

  delete (el: any)[COELEMENT_DATA_KEY_PREFIX + name]
  delete coel.el
}
