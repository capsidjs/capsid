import * as assert from 'assert'
import * as genel from 'genel'
import { def, make, on } from '../index'
import { clearComponents } from '../test-helper'

describe('@on(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the event is empty', () => {
    assert.throws(() => {
      class Component {
        @on(undefined)
        handler() {
          console.log()
        }
      }

      def('component', Component)
    }, /Empty event handler is given: constructor=Component key=handler/)
  })

  it('registers the method as the event listener of the given event name', done => {
    class Component {
      @on('click')
      handler() {
        done()
      }
    }

    def('component', Component)

    const el = genel.div``

    make('component', el)

    el.click()
  })

  it('registers the method as the event listener for children classes', done => {
    class Foo {
      @on('click')
      handler() {
        done()
      }
    }
    class Bar extends Foo {}
    class Baz extends Bar {}

    def('baz', Baz)

    const el = genel.div``
    make('baz', el)
    el.click()
  })
})

describe('@on(event, {at: selector})', () => {
  afterEach(() => clearComponents())

  it('registers the method as the event listener of the given event name and selector', done => {
    class Foo {
      @on('foo-event', { at: '.inner' })
      foo() {
        done()
      }
      @on('bar-event', { at: '.inner' })
      bar() {
        done(new Error('bar should not be called'))
      }
    }
    def('foo', Foo)

    const el = genel.div`
      <div class="inner"></div>
    `

    make('foo', el)

    if (document.body) {
      document.body.appendChild(el)
    }

    el.dispatchEvent(new CustomEvent('bar-event', { bubbles: true }))
    el
      .querySelector('.inner')
      .dispatchEvent(new CustomEvent('foo-event', { bubbles: true }))

    if (document.body) {
      document.body.removeChild(el)
    }
  })
})

describe('@on.click', () => {
  afterEach(() => clearComponents())

  it('binds method to click event', done => {
    class Component {
      @on.click
      handler() {
        done()
      }
    }

    def('foo', Component)

    const el = genel.div``
    make('foo', el)
    el.click()
  })
})

describe('@on.click.at', () => {
  afterEach(() => clearComponents())

  it('binds method to click event at the given element', () => {
    let res = 0

    class Component {
      @on.click.at('.foo')
      foo() {
        res += 1
      }
      @on.click.at('.bar')
      bar() {
        res += 2
      }
    }

    def('component', Component)

    const el = genel.div`
      <p class="foo"></p>
      <p class="bar"></p>
    `

    make('component', el)
    const foo = el.querySelector('.foo')

    if (foo instanceof HTMLElement) {
      foo.click()
    }

    assert(res === 1)
  })
})
