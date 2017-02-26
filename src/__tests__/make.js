import assert from 'assert'
import { make } from '../index.js'
import { Foo } from './fixture.js'

describe('make', () => {
  it('initializes the element as an class-component of the given name', () => {
    const el = document.createElement('div')

    make('foo', el)

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('returns an instance of coelement', () => {
    assert(make('foo', document.createElement('div')) instanceof Foo)
  })
})
