// @flow

const READY_STATE_CHANGE = "readystatechange";
const doc = document;

export const ready: Promise<void> = new Promise(resolve => {
  const checkReady = () => {
    if (doc.readyState === "complete") {
      resolve();
      doc.removeEventListener(READY_STATE_CHANGE, checkReady);
    }
  };

  doc.addEventListener(READY_STATE_CHANGE, checkReady);

  checkReady();
});

export const documentElement = doc.documentElement;
export default doc;
