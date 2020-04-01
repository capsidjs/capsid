import * as assert from 'assert'
import { get, make, def } from './index'
import { Foo } from './test-fixture'
import { clearComponents } from './test-helper'

describe('get', () => {
  before(() => {
    def('foo', Foo)
  })

  after(() => clearComponents())

  it('gets the coelement instance from the element', () => {
    const el = document.createElement('div')

    make<Foo>('foo', el)

    const coel = get<Foo>('foo', el)

    assert(coel instanceof Foo)
    assert(coel.el === el)
  })
})
