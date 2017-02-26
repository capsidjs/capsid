import $ from 'jquery'
import * as capsid from '../index.js'
import cj from '../plugins/jquery-plugin.js'
import { Foo, Bar } from './fixture.js'

global.$ = $

cj(capsid, $)

before(() => {
  capsid.def('foo', Foo)
  capsid.def('bar', Bar)
})
