const READY_STATE_CHANGE = 'readystatechange';

let p: Promise<void>;
export function ready() {
  return p = p || new Promise<void>((resolve) => {
    const doc = document;
    const checkReady = () => {
      if (doc.readyState === 'complete') {
        resolve();
        doc.removeEventListener(READY_STATE_CHANGE, checkReady);
      }
    };

    doc.addEventListener(READY_STATE_CHANGE, checkReady);

    checkReady();
  });
}
