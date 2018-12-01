import * as capsid from './index'
import { INITIALIZED_KEY, COMPONENT_NAME_KEY } from './util/const'

export default (constructor: any, name?: string) => {
  constructor[INITIALIZED_KEY] = true
  constructor[COMPONENT_NAME_KEY] = name

  // Expose capsid here
  constructor.capsid = capsid

  // If the constructor has the static __init__, then calls it.
  if (typeof constructor.__init__ === 'function') {
    constructor.__init__()
  }
}
