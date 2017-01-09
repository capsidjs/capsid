// @flow

import { body } from './document.js'
export default body.matches || (body: any).webkitMatchesSelector || (body: any).msMatchesSelector
