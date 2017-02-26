import assert from 'assert'
import { init } from '../index.js'

describe('init', () => {
  it('initializes the element as an class-component of the given name', () => {
    const el = document.createElement('div')

    init('foo', el)

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('returns nothing', () => {
    assert(init('foo', document.createElement('div')) === undefined)
  })
})
