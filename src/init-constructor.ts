import * as capsid from './index'
import { INITIALIZED_KEY, COMPONENT_NAME_KEY } from './util/const'

export default (constructor: any, name?: string) => {
  constructor[INITIALIZED_KEY] = true
  constructor[COMPONENT_NAME_KEY] = name

  // Expose capsid here
  constructor.capsid = capsid
}
