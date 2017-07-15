import assert from 'assert'
import { init, def } from '../index.js'
import { clearComponents } from './helper'
import { Foo } from './fixture'

describe('init', () => {
  before(() => {
    def('foo', Foo)
  })

  after(() => clearComponents())

  it('initializes the element as an class-component of the given name', () => {
    const el = document.createElement('div')

    init('foo', el)

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('returns nothing', () => {
    assert(init('foo', document.createElement('div')) === undefined)
  })
})
