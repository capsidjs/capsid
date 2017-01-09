// @flow

import doc from './document.js'

const DOM_CONTENT_LOADED = 'DOMContentLoaded'
const LOAD = 'load'

const promise = new Promise(resolve => {
  const completed = () => {
    resolve()
    doc.removeEventListener(DOM_CONTENT_LOADED, completed)
    doc.removeEventListener(LOAD, completed)
  }

  if (doc.readyState === 'complete') {
    setTimeout(resolve)
  } else {
    doc.addEventListener(DOM_CONTENT_LOADED, completed)
    doc.addEventListener(LOAD, completed)
  }
})

/**
 * Fires the callback when doms are ready.
 */
export default (callback: Function) => {
  promise.then(callback)
}
