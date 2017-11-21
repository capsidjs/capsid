import $ from 'jquery'
import * as capsid from '../index.js'
import cj from '../plugins/jquery-plugin.js'
import { Foo, Bar } from './fixture.js'

global.$ = $
global.__DEV__ = true
global.capsidDebugMessage = () => {}

cj(capsid, $)

before(() => {
  capsid.def('foo', Foo)
  capsid.def('bar', Bar)
})

export const clearComponents = () =>
  Object.keys(capsid.__ccc__).forEach(key => {
    delete capsid.__ccc__[key]
  })

/**
 * @param {Function} decorator The decorator
 * @param {Function} cls The class
 * @param {string} key The key of the method to decorate
 */
export const callDecorator = (decorator, cls, key) => {
  const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key)
  const result = decorator(cls.prototype, key, descriptor)
  Object.defineProperty(cls.prototype, key, result || descriptor)
}
