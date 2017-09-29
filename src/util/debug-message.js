// @flow

export default (message: Object) => {
  if (typeof capsidDebugMessage !== 'undefined') {
    capsidDebugMessage(message)
  }
}
