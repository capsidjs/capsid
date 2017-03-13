// @flow

import * as capsid from './index.js'
import { INITIALIZED_KEY } from './util/const'

export default (constructor: Function) => {
  constructor[INITIALIZED_KEY] = true

  // Expose capsid here
  constructor.capsid = capsid

  // If the constructor has the static __init__, then calls it.
  if (typeof constructor.__init__ === 'function') {
    constructor.__init__()
  }
}
