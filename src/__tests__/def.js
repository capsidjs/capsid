import assert from 'assert'
import { def, make } from '../index.js'

describe('def', () => {
  it('throws an error when the first param is not a string', () => {
    assert.throws(() => {
      def(null, class A {})
    }, Error)
  })

  it('throws an error when the second param is not a function', () => {
    assert.throws(() => {
      def('register-test2', null)
    }, Error)
  })

  it('registers the given class by the given name component', () => {
    class A {}

    def('assign-test2', A)

    const el = document.createElement('div')

    const coelem = make('assign-test2', el)

    assert(coelem instanceof A)
  })
})
