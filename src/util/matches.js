// @flow

import { documentElement } from './document.js'
export default (documentElement: any).matches || (documentElement: any).webkitMatchesSelector || (documentElement: any).msMatchesSelector
