// @flow

import * as capsid from './index.js'
import { INITIALIZED_KEY } from './util/const'

export default (constructor: Function) => {
  constructor[INITIALIZED_KEY] = true
  constructor.capsid = capsid

  if (typeof constructor.__init__ === 'function') {
    constructor.__init__()
  }
}
