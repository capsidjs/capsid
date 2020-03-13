import * as assert from 'assert'
import { prep, def } from './index'
import { Foo } from './test-fixture'
import { clearComponents } from './test-helper'

describe('prep', () => {
  before(() => {
    def('foo', Foo)
    def('foo-2', Foo)
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

  it('initializes all when call with empty args', () => {
    const el = document.createElement('div')
    el.setAttribute('class', 'foo')

    const el2 = document.createElement('div')
    el2.setAttribute('class', 'foo-2')

    if (document.body) {
      document.body.appendChild(el)
      document.body.appendChild(el2)
    }

    prep()

    assert(el.getAttribute('is_foo') === 'true')
    assert(el2.getAttribute('is_foo') === 'true')
  })

  it('throws an error when the given name of class-component is not registered', () => {
    assert.throws(() => {
      prep('does-not-exist')
    }, Error)
  })
})
