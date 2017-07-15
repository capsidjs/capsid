import assert from 'assert'
import { make, def } from '../index.js'
import { Foo } from './fixture.js'
import { clearComponents } from './helper.js'

describe('make', () => {
  before(() => {
    def('foo', Foo)
  })

  after(() => clearComponents())

  it('initializes the element as an class-component of the given name', () => {
    const el = document.createElement('div')

    make('foo', el)

    assert(el.getAttribute('is_foo') === 'true')
  })

  it('returns an instance of coelement', () => {
    assert(make('foo', document.createElement('div')) instanceof Foo)
  })
})
