import { def, get, unmount, make, on } from '../index.js'
import genel from 'genel'
import { clearComponents, callDecorator } from './helper.js'
import assert from 'assert'

describe('unmount', () => {
  afterEach(() => {
    clearComponents()
  })

  it('removes class name, reference and event handlers', done => {
    class Foo {
      method () {
        done(new Error('event handler called!'))
      }
    }

    callDecorator(on.click, Foo, 'method')

    def('foo', Foo)

    const el = genel.div``
    const coel = make('foo', el)

    assert(el.classList.contains('foo'))
    assert.strictEqual(coel.el, el)
    assert.strictEqual(get('foo', el), coel)

    unmount('foo', el)

    assert(!el.classList.contains('foo'))
    assert.strictEqual(coel.el, undefined)

    el.click()

    setTimeout(() => done(), 200)
  })

  it('calls __unmount__ if exists', done => {
    class Foo {
      __unmount__ () {
        done()
      }
    }

    def('foo', Foo)

    const el = genel.div``

    make('foo', el)

    unmount('foo', el)
  })

  it('does not unmount listeners of different component which mounted on the same element', done => {
    class Foo {}
    class Bar {
      method () {
        done()
      }
    }

    callDecorator(on.click, Bar, 'method')

    def('foo', Foo)
    def('bar', Bar)

    const el = genel.div``

    make('foo', el)
    make('bar', el)
    unmount('foo', el)

    el.click()
  })
})
