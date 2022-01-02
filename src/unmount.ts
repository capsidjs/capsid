import get from './get.ts';
import {
  COELEMENT_DATA_KEY_PREFIX,
  KEY_EVENT_LISTENERS,
} from './util/const.ts';

export default <T>(name: string, el: HTMLElement): void => {
  const coel = get<T>(name, el);

  // @ts-ignore use coel.__unmount__
  if (typeof coel.__unmount__ === 'function') {
    // @ts-ignore use coel.__unmout__
    coel.__unmount__();
  }

  el.classList.remove(name, `${name}-💊`);
  // deno-lint-ignore no-explicit-any
  ((coel as any)[KEY_EVENT_LISTENERS] || []).forEach((listener: any) => {
    listener.remove();
  });

  // deno-lint-ignore no-explicit-any
  delete (el as any)[COELEMENT_DATA_KEY_PREFIX + name];
  // @ts-ignore use coel.el
  delete coel.el;
};
