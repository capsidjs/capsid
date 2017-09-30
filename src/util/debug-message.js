// @flow

declare var capsidDebugMessage: any

export default (message: Object) => {
  if (typeof capsidDebugMessage === 'function') {
    capsidDebugMessage(message)
  }
}
