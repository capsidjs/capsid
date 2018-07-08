// @flow

import assert from 'assert'
import { div } from 'dom-gen'
import { def, get, make, on, emits, component, wired, notifies } from '../../'
import { clearComponents, callDecorator } from '../../__tests__/helper'

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

describe('@emits.first(event)', () => {
  afterEach(() => clearComponents())

  it('makes the method emit the event with the arguments of the method', done => {
    class Component {
      foo () {
        return 42
      }
    }
    def('component', Component)
    callDecorator(emits.first('event-foo'), Component, 'foo')

    const coelem = make(
      'component',
      div().on('event-foo', e => {
        assert(e.detail.a === 1)
        assert(e.detail.b === 2)
        assert(e.detail.c === 3)
      })[0]
    )

    assert(coelem.foo({ a: 1, b: 2, c: 3 }) === 42)

    done()
  })

  it('makes the method emit the event, and it bubbles up the dom tree', done => {
    class Component {
      foo () {
        return 42
      }
    }
    def('component', Component)
    callDecorator(emits.first('event-foo'), Component, 'foo')

    const parent = div()
      .on('event-foo', () => done())
      .appendTo('body')

    const coel = make('component', div().appendTo(parent)[0])

    coel.foo()

    parent.remove()
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
      callDecorator(emits(undefined), Component, 'emitter')
    }, /Unable to emits an empty event: constructor=Component key=emitter/)
  })

  it('makes the method emit the event with the returned value', done => {
    class Component {
      foo () {
        return 321
      }
    }
    def('component', Component)
    callDecorator(emits('event-foo'), Component, 'foo')

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
    callDecorator(emits('event-foo'), Component, 'foo')

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

describe('@component', () => {
  afterEach(() => clearComponents())

  it('registers the component with the kebab cased component name', () => {
    class FooBarBaz {}

    component(FooBarBaz)

    assert(make('foo-bar-baz', div()[0]) instanceof FooBarBaz)
  })

  it('returns the constructor', () => {
    class FooBarBaz1 {}

    assert(component(FooBarBaz1) === FooBarBaz1)
  })
})

describe('@component(className)', () => {
  afterEach(() => clearComponents())

  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Foo {
      el: HTMLElement

      __mount__ () {
        this.el.setAttribute('this-is', 'decorated-component')
      }
    }

    component('decorated-component')(Foo)

    const el = div()[0]

    make('decorated-component', el)

    assert(el.getAttribute('this-is') === 'decorated-component')
  })

  it('returns the constructor', () => {
    class Foo {}

    assert(component('foo')(Foo) === Foo)
  })
})

describe('@wired.component', () => {
  afterEach(() => clearComponents())

  it('replaces the decorated getter and returns the instance of class-component of the getter name', () => {
    class Foo {
      get bar () {}
    }

    class Bar {}

    def('foo', Foo)
    def('bar', Bar)

    callDecorator(wired.component, Foo, 'bar')

    const el = div().append(make('bar', div()[0]).el)[0]

    const wireTest0 = make('foo', el)

    assert(wireTest0.bar instanceof Bar)
  })

  it('returns the instance of component of the kebab-cased name of the getter name when the getter is in camelCase', () => {
    class Cls0 {
      get wireTest3Child () {}
    }
    class Cls1 {}
    def('wire-test3', Cls0)
    def('wire-test3-child', Cls1)

    callDecorator(wired.component, Cls0, 'wireTest3Child')

    const el = div().append(make('wire-test3-child', div()[0]).el)[0]

    const wireTest3 = make('wire-test3', el)

    assert(wireTest3.wireTest3Child instanceof Cls1)
  })

  it("can get the class component in the same dom as decorated method's class", () => {
    class Foo {
      get bar () {}
    }
    class Bar {}
    def('foo', Foo)
    def('bar', Bar)

    callDecorator(wired.component, Foo, 'bar')

    const el = div()[0]

    make('bar', el)
    const foo = make('foo', el)

    assert(foo.bar instanceof Bar)
    assert(foo.bar === get('bar', el))
  })

  it('throws when the element is not available', () => {
    class Foo {
      get doesNotExist () {}
    }

    def('foo', Foo)

    callDecorator(wired.component, Foo, 'doesNotExist')

    const foo = make('foo', div()[0])

    assert.throws(
      () => {
        console.log(foo.doesNotExist)
      },
      err => {
        return err.message === 'wired component "does-not-exist" is not available at DIV(class=[Foo]'
      }
    )
  })

  it("throws when the component's element is not available", () => {
    class Component {
      constructor () {
        console.log(this.subcomponent)
      }

      get subcomponent () {}
    }

    callDecorator(wired.component, Component, 'subcomponent')

    assert.throws(
      () => {
        console.log(new Component())
      },
      err => {
        return err.message === "Component's element is not ready. Probably wired getter called at constructor.(class=[Component]"
      }
    )
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

describe('@notifies(event, selector)', () => {
  afterEach(() => clearComponents())

  it('throws error when empty event is given', () => {
    class Component {
      method () {}
    }

    def('component', Component)

    assert.throws(() => {
      callDecorator(notifies(undefined, '.elm'), Component, 'method')
    }, /Unable to notify empty event: constructor=Component key=method/)
  })

  it('adds function to publish the event to the element of the given selector', () => {
    class Component {
      publish () {}
    }

    const CUSTOM_EVENT = 'foo-bar-baz-quz'

    def('component', Component)

    callDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

    const child0 = div({ addClass: 'elm' })
    const child1 = div({ addClass: 'elm' })
    const child2 = div({ addClass: 'elm' })

    const component = div(child0, div(div(), child1), div(div(), div(div(child2, div())))).cc.init('component')

    const promise0 = new Promise(resolve => child0.on(CUSTOM_EVENT, resolve))
    const promise1 = new Promise(resolve => child1.on(CUSTOM_EVENT, resolve))
    const promise2 = new Promise(resolve => child2.on(CUSTOM_EVENT, resolve))

    component.publish()

    return Promise.all([promise0, promise1, promise2])
  })

  describe('The decorated method', () => {
    it('publishes events with the return value as detail', done => {
      class Component {
        publish () {
          return { foo: 123, bar: 'baz' }
        }
      }

      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      def('component', Component)

      callDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

      const child = div({ addClass: 'elm' })

      const component = div(child).cc.init('component')

      child.on(CUSTOM_EVENT, e => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })

    it('publishes events with the resolved value as detail if it is async function', done => {
      class Component {
        publish () {
          return Promise.resolve({ foo: 123, bar: 'baz' })
        }
      }

      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      def('component', Component)

      callDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

      const child = div({ addClass: 'elm' })

      const component = div(child).cc.init('component')

      child.on(CUSTOM_EVENT, e => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })
  })
})
