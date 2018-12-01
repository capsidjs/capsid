import get from './get'
import { COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS } from './util/const'

export default (name: string, el: HTMLElement): void => {
  const coel = get(name, el)

  if (typeof coel.__unmount__ === 'function') {
    coel.__unmount__()
  }

  el.classList.remove(name, `${name}-💊`)
  ;((el as any)[KEY_EVENT_LISTENERS + name] || []).forEach((listener: any) => {
    listener.remove()
  })

  delete (el as any)[COELEMENT_DATA_KEY_PREFIX + name]
  delete coel.el
}
