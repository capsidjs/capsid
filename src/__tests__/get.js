import assert from 'assert'
import { get, init } from '../index.js'
import { Foo } from './fixture.js'

describe('get', () => {
  it('gets the coelement instance from the element', () => {
    const el = document.createElement('div')

    init('foo', el)

    const coel = get('foo', el)

    assert(coel instanceof Foo)
    assert(coel.el === el)
  })
})
