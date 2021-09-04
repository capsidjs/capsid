import get from "./get";
import { COELEMENT_DATA_KEY_PREFIX, KEY_EVENT_LISTENERS } from "./util/const";

export default <T>(name: string, el: HTMLElement): void => {
  const coel = get<T>(name, el);

  // @ts-ignore
  if (typeof coel.__unmount__ === "function") {
    // @ts-ignore
    coel.__unmount__();
  }

  el.classList.remove(name, `${name}-💊`);
  ((coel as any)[KEY_EVENT_LISTENERS] || []).forEach((listener: any) => {
    listener.remove();
  });

  delete (el as any)[COELEMENT_DATA_KEY_PREFIX + name];
  // @ts-ignore
  delete coel.el;
};
