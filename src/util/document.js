// @flow

const DOM_CONTENT_LOADED = 'DOMContentLoaded'
const doc = document

const promise = new Promise(resolve => {
  const completed = () => {
    resolve()
    doc.removeEventListener(DOM_CONTENT_LOADED, completed)
  }

  if (doc.readyState === 'complete') {
    setTimeout(resolve)
  } else {
    doc.addEventListener(DOM_CONTENT_LOADED, completed)
  }
})

/**
 * Fires the callback when doms are ready.
 */
export const ready = (callback: Function) => {
  promise.then(callback)
}

export const body = doc.body
export default doc
