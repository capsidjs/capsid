declare var capsidDebugMessage: any

export default (message: object) => {
  if (typeof capsidDebugMessage === 'function') {
    capsidDebugMessage(message)
  }
}
