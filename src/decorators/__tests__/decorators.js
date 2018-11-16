// @flow

import assert from 'assert'
import { div } from 'dom-gen'
import { def, make, on, emits, component, wired } from '../../'
import { clearComponents, callDecorator } from '../../__tests__/helper'
import { callClassDecorator, callMethodDecorator } from './helper'

describe('@on(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the event is empty', () => {
    class Component {
      handler () {
      }
    }

    def('component', Component)
    assert.throws(() => {
      callDecorator(on(undefined), Component, 'handler') // This sometimes happens when the user use a variable for event names.
    }, /Empty event handler is given: constructor=Component key=handler/
    )
  })

  it('registers the method as the event listener of the given event name', done => {
    class Component {
      handler () {
        done()
      }
    }
    def('component', Component)
    callDecorator(on('click'), Component, 'handler')

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

    callDecorator(on('click'), Foo, 'handler')
    callDecorator(on('baz'), Baz, 'baz')

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

    callDecorator(on('foo-event', { at: '.inner' }), Foo, 'foo')
    callDecorator(on('bar-event', { at: '.inner' }), Foo, 'bar')

    const el = div(div({ addClass: 'inner' }))[0]

    make('foo', el)

    if (document.body) document.body.appendChild(el)

    el.dispatchEvent(new CustomEvent('bar-event', { bubbles: true }))
    el.querySelector('.inner').dispatchEvent(new CustomEvent('foo-event', { bubbles: true }))

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

    callDecorator(on.click, Component, 'handler')

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

    callDecorator(on.click.at('.foo'), Component, 'foo')
    callDecorator(on.click.at('.bar'), Component, 'bar')

    def('foo', Component)

    const el = div().cc('foo')

    el.html(`
      <p class="foo"></p>
      <p class="bar"></p>
    `)

    el
      .find('.foo')
      .trigger('click')

    assert(res === 1)
  })
})

describe('@emits(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the empty event is given', () => {
    class Component {
      emitter () {}
    }

    def('component', Component)

    assert.throws(() => {
      callMethodDecorator(emits(undefined), Component, 'emitter')
    }, /Unable to emits an empty event: constructor=Component key=emitter/)
  })

  it('makes the method emit the event with the returned value', done => {
    class Component {
      foo () {
        return 321
      }
    }
    def('component', Component)
    callMethodDecorator(emits('event-foo'), Component, 'foo')

    make(
      'component',
      div().on('event-foo', e => {
        assert(e.detail === 321)

        done()
      })[0]
    ).foo()
  })

  it('makes the method emit the event with the resolved value after the promise resolved', done => {
    let promiseResolved = false

    class Component {
      foo () {
        return new Promise(resolve => {
          setTimeout(() => {
            promiseResolved = true
            resolve(123)
          }, 100)
        })
      }
    }
    def('component', Component)
    callMethodDecorator(emits('event-foo'), Component, 'foo')

    make(
      'component',
      div().on('event-foo', e => {
        assert(promiseResolved)
        assert(e.detail === 123)

        done()
      })[0]
    ).foo()
  })
})

describe('@component(name)', () => {
  afterEach(() => clearComponents())

  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Foo {
      el: HTMLElement

      __mount__ () {
        this.el.setAttribute('this-is', 'decorated-component')
      }
    }

    callClassDecorator(component('decorated-component'), Foo)

    const el = div()[0]

    make('decorated-component', el)

    assert(el.getAttribute('this-is') === 'decorated-component')
  })
})

describe('@wired.component(name, selector)', () => {
  afterEach(() => clearComponents())

  it('replaces the getter of the decorated descriptor, and it returns the instance of class-component inside the element', () => {
    class Cls0 {
      get test () {}
    }
    class Cls1 {}
    def('wire-test1', Cls0)
    def('wire-test1-1', Cls1)

    callDecorator(wired.component('wire-test1-1', '.foo'), Cls0, 'test')

    const el = div().append(make('wire-test1-1', div().addClass('foo')[0]).el)[0]

    const wireTest1 = make('wire-test1', el)

    assert(wireTest1.test instanceof Cls1)
  })
})

describe('@wired(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the element in the component', () => {
    class Component {
      get elm () {}
    }

    def('wire-el-test', Component)
    callDecorator(wired('.elm'), Component, 'elm')

    const el = div().append(div().addClass('elm'))[0]

    const component = make('wire-el-test', el)
    assert(component.elm instanceof HTMLElement)
    assert(component.elm === el.firstChild)
  })
})

describe('@wired.all(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the all elements in the component', () => {
    class Component {
      get elms () {}
    }

    def('comp', Component)
    callDecorator(wired.all('.elm'), Component, 'elms')

    const el = div().append(div().addClass('elm'), div().addClass('elm'))[0]

    const component = make('comp', el)
    assert(component.elms.length === 2)
    assert(component.elms[0] === el.firstChild)
    assert(component.elms[1] === el.lastChild)
  })
})
