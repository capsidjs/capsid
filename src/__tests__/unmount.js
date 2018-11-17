import { def, get, unmount, make, on } from '../index.js'
import genel from 'genel'
import { clearComponents } from './helper.js'
import { callMethodDecorator } from '../decorators/__tests__/helper.js'
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

    callMethodDecorator(on.click, Foo, 'method')
    callMethodDecorator(on('foo'), Foo, 'method')

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
    el.dispatchEvent(new CustomEvent('foo'))

    setTimeout(() => done(), 100)
  })

  it("unmounts anscestor class's event handler correctly", done => {
    class Foo {
      method () {
        done(new Error('event handler called!'))
      }
    }

    class Bar extends Foo {}

    callMethodDecorator(on.click, Foo, 'method')
    callMethodDecorator(on('foo'), Foo, 'method')

    def('bar', Bar)

    const el = genel.div``
    make('bar', el)

    unmount('bar', el)

    el.click()
    el.dispatchEvent(new CustomEvent('foo'))

    setTimeout(() => done(), 100)
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

    callMethodDecorator(on.click, Bar, 'method')

    def('foo', Foo)
    def('bar', Bar)

    const el = genel.div``

    make('foo', el)
    make('bar', el)
    unmount('foo', el)

    el.click()
  })
})
