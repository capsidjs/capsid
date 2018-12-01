import * as assert from 'assert'
import { get, make, def } from '../index'
import { Foo } from './fixture'
import { clearComponents } from './helper'

describe('get', () => {
  before(() => {
    def('foo', Foo)
  })

  after(() => clearComponents())

  it('gets the coelement instance from the element', () => {
    const el = document.createElement('div')

    make('foo', el)

    const coel = get('foo', el)

    assert(coel instanceof Foo)
    assert(coel.el === el)
  })
})
