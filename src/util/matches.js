// @flow

import { documentElement } from './document.js'
export default documentElement.matches || (documentElement: any).webkitMatchesSelector || (documentElement: any).msMatchesSelector
