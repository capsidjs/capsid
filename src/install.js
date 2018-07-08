// @flow

import * as capsid from './index.js'
import check from './util/check.js'

type CapsidModule = {
  install: Function
}

/**
 * Installs the capsid module or plugin.
 *
 * @param {CapsidModule} capsidModule
 * @param {object} options
 */
export default (capsidModule: CapsidModule, options?: Object) => {
  check(typeof capsidModule.install === 'function', 'The given capsid module does not have `install` method. Please check the install call.')

  capsidModule.install(capsid, options || {})
}
