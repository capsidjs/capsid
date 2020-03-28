import * as assert from 'assert'
import { def, make } from './index'
import { clearComponents } from './test-helper'

describe('def', () => {
  after(() => clearComponents())

  it('throws an error when the first param is not a string', () => {
    assert.throws(() => {
      def(null as any, class A {})
    }, Error)
  })

  it('throws an error when the second param is not a function', () => {
    assert.throws(() => {
      def('register-test2', null as any)
    }, Error)
  })

  it('registers the given class by the given name component', () => {
    class A {}
    def('assign-test2', A)

    const el = document.createElement('div')
    const coel = make('assign-test2', el)

    assert(coel instanceof A)
  })
})
