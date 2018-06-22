import on from './on.js'

/**
 * Registers the on[eventName] and on[eventName].at decorators.
 * @param {string} handlerName
 */
export default (handlerName) => {
  on[handlerName] = on(handlerName)
  on[handlerName].at = selector => on(handlerName, { at: selector })
}
