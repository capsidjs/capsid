import * as assert from 'assert'
import { prep, def } from '../index'
import { Foo } from './fixture'
import { clearComponents } from './helper'

describe('prep', () => {
  before(() => {
    def('foo', Foo)
  })

  beforeEach(() => {
    if (document.body) {
      document.body.innerHTML = ''
    }
  })

  after(() => clearComponents())

  it('initializes the class component of the given name', () => {
    const el = document.createElement('div')
    el.setAttribute('class', 'foo')

    if (document.body) {
      document.body.appendChild(el)
    }

    prep('foo')

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('throws an error when the given name of class-component is not registered', () => {
    assert.throws(() => {
      prep('does-not-exist')
    }, Error)
  })
})
