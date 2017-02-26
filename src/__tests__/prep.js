import assert from 'assert'
import { prep } from '../index.js'

describe('prep', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('initializes the class component of the given name', () => {
    const el = document.createElement('div')
    el.setAttribute('class', 'foo')
    document.body.appendChild(el)

    prep('foo')

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('throws an error when the given name of class-component is not registered', () => {
    assert.throws(() => {
      prep('does-not-exist')
    }, Error)
  })
})
