const $ = require('jquery')
global.$ = global.jQuery = $
const cc = require('../src')
const ccj = require('../src/cc-jquery')

ccj(cc, $)
