// @flow

import * as capsid from '../index.js'

global.__DEV__ = true

export const clearComponents = () =>
  Object.keys(capsid.__ccc__).forEach(key => {
    delete capsid.__ccc__[key]
  })
