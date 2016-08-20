/**
 * class-component.js v10.6.0
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */
import './decorators.js'
import {register as cc, init, ccc} from './class-component-manager.js'
import defineFnCc from './fn.cc.js'
import $ from './jquery.js'

// Initializes the module object.
if (!$.cc) {
  $.cc = cc

  defineFnCc($)

  cc.init = init

  // Expose __ccc__
  cc.__ccc__ = ccc
}
