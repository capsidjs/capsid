// @flow

const READY_STATE_CHANGE = 'readystatechange'
const doc = document

const promise = new Promise(resolve => {
  const checkReady = () => {
    if (doc.readyState === 'complete') {
      resolve()
      doc.removeEventListener(READY_STATE_CHANGE, checkReady)
    }
  }

  doc.addEventListener(READY_STATE_CHANGE, checkReady)

  checkReady()
})

/**
 * Fires the callback when doms are ready.
 */
export const ready = (callback: Function) => {
  promise.then(callback)
}

export const body = doc.body
export default doc
