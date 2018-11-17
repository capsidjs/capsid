// @flow

import assert from 'assert'
import { div } from 'dom-gen'
import { def, make, on } from '../../'
import { clearComponents } from '../../__tests__/helper'
import { callMethodDecorator } from './helper'

describe('@on(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the event is empty', () => {
    class Component {
      handler () {}
    }

    def('component', Component)
    assert.throws(() => {
      callMethodDecorator(on(undefined), Component, 'handler') // This sometimes happens when the user use a variable for event names.
    }, /Empty event handler is given: constructor=Component key=handler/)
  })

  it('registers the method as the event listener of the given event name', done => {
    class Component {
      handler () {
        done()
      }
    }
    def('component', Component)
    callMethodDecorator(on('click'), Component, 'handler')

    div()
      .cc('component')
      .trigger('click')
  })

  it('registers the method as the event listener for children classes', done => {
    class Foo {
      handler () {
        done()
      }
    }
    class Bar extends Foo {}
    class Baz extends Bar {
      baz () {}
    }

    callMethodDecorator(on('click'), Foo, 'handler')
    callMethodDecorator(on('baz'), Baz, 'baz')

    def('baz', Baz)

    div()
      .cc('baz')
      .trigger('click')
  })
})

describe('@on(event, {at: selector})', () => {
  afterEach(() => clearComponents())

  it('registers the method as the event listener of the given event name and selector', done => {
    class Foo {
      foo () {
        done()
      }
      bar () {
        done(new Error('bar should not be called'))
      }
    }
    def('foo', Foo)

    callMethodDecorator(on('foo-event', { at: '.inner' }), Foo, 'foo')
    callMethodDecorator(on('bar-event', { at: '.inner' }), Foo, 'bar')

    const el = div(div({ addClass: 'inner' }))[0]

    make('foo', el)

    if (document.body) document.body.appendChild(el)

    el.dispatchEvent(new CustomEvent('bar-event', { bubbles: true }))
    el
      .querySelector('.inner')
      .dispatchEvent(new CustomEvent('foo-event', { bubbles: true }))

    if (document.body) document.body.removeChild(el)
  })
})

describe('@on.click', () => {
  afterEach(() => clearComponents())

  it('binds method to click event', done => {
    class Component {
      handler () {
        done()
      }
    }

    callMethodDecorator(on.click, Component, 'handler')

    def('foo', Component)

    div()
      .cc('foo')
      .trigger('click')
  })
})

describe('@on.click.at', () => {
  afterEach(() => clearComponents())

  it('binds method to click event at the given element', () => {
    let res = 0

    class Component {
      foo () {
        res += 1
      }
      bar () {
        res += 2
      }
    }

    callMethodDecorator(on.click.at('.foo'), Component, 'foo')
    callMethodDecorator(on.click.at('.bar'), Component, 'bar')

    def('foo', Component)

    const el = div().cc('foo')

    el.html(`
      <p class="foo"></p>
      <p class="bar"></p>
    `)

    el.find('.foo').trigger('click')

    assert(res === 1)
  })
})
