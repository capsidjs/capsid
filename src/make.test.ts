import * as assert from 'assert'
import { make, def, get } from './index'
import { Foo } from './test-fixture'
import { clearComponents } from './test-helper'

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

  it("doesn't initialize element twice", () => {
    let a = 0
    class A {
      __mount__() {
        a++
      }
    }
    def('bar', A)

    const el = document.createElement('div')
    make('bar', el)
    make('bar', el)

    assert.strictEqual(a, 1)
  })

  describe('in __mount__', () => {
    it('can get coelement from el by the name', (done) => {
      class Component {
        el?: HTMLElement

        __mount__() {
          assert.strictEqual(get('bar', this.el!), this)

          done()
        }
      }

      def('bar', Component)

      make('bar', document.createElement('div'))
    })
  })
})
