import $ from 'jquery'
import cc from '../src'
import ccj from '../src/cc-jquery'

global.$ = global.jQuery = $

ccj(cc, $)
