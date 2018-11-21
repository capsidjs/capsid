// @flow

import * as capsid from '../index.js'
import { Foo, Bar } from './fixture.js'

global.__DEV__ = true

before(() => {
  capsid.def('foo', Foo)
  capsid.def('bar', Bar)
})

export const clearComponents = () =>
  Object.keys(capsid.__ccc__).forEach(key => {
    delete capsid.__ccc__[key]
  })
