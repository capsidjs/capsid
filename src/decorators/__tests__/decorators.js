import assert from 'assert'
import { div } from 'dom-gen'
import { def, init, get, make, on, emit, component, wire } from '../../'
import { clearComponents, callDecorator } from '../../__tests__/helper'

describe('@on(event)', () => {
  it('registers the method as the event listener of the given event name', done => {
    class OnTest0 {
      handler () { done() }
    }
    def('on-test0', OnTest0)
    callDecorator(on('click'), OnTest0, 'handler')

    div().cc('on-test0').trigger('click')
  })

  it('registers the method as the event listener for children classes', done => {
    class OnTest1 {
      handler () { done() }
    }
    class OnTest1Child extends OnTest1 {}
    class OnTest1ChildChild extends OnTest1Child {
      bar () {}
    }

    callDecorator(on('click'), OnTest1, 'handler')
    callDecorator(on('bar'), OnTest1ChildChild, 'bar')

    def('on-test1-child-child', OnTest1ChildChild)

    div().cc('on-test1-child-child').trigger('click')
  })
})

describe('@on(event, {at: selector})', () => {
  it('registers the method as the event listener of the given event name and selector', done => {
    class OnAtTest0 {
      foo () { done() }
      bar () { done(new Error('bar should not be called')) }
    }
    def('on-at-test0', OnAtTest0)

    callDecorator(on('foo-event', { at: '.inner' }), OnAtTest0, 'foo')
    callDecorator(on('bar-event', { at: '.inner' }), OnAtTest0, 'bar')

    const el = div(div({addClass: 'inner'}))[0]

    init('on-at-test0', el)

    document.body.appendChild(el)

    el.dispatchEvent(new CustomEvent('bar-event', { bubbles: true }))
    el.querySelector('.inner').dispatchEvent(new CustomEvent('foo-event', { bubbles: true }))

    document.body.removeChild(el)
  })
})

describe('@on.click', () => {
  it('binds method to click event', done => {
    class Component {
      handler () { done() }
    }

    callDecorator(on.click, Component, 'handler')

    def('on-click-test-component', Component)

    div().cc('on-click-test-component').trigger('click')
  })
})

describe('@emit.first(event)', () => {
  it('makes the method emit the event with the arguments of the method', done => {
    class EmitTest0 {
      foo () {
        return 42
      }
    }
    def('emit-test0', EmitTest0)
    callDecorator(emit.first('event-foo'), EmitTest0, 'foo')

    const coelem = make('emit-test0', div().on('event-foo', e => {
      assert(e.detail.a === 1)
      assert(e.detail.b === 2)
      assert(e.detail.c === 3)
    })[0])

    assert(coelem.foo({ a: 1, b: 2, c: 3 }) === 42)

    done()
  })

  it('makes the method emit the event, and it bubbles up the dom tree', done => {
    class EmitTest1 {
      foo () {
        return 42
      }
    }
    def('emit-test1', EmitTest1)
    callDecorator(emit.first('event-foo'), EmitTest1, 'foo')

    const parent = div().on('event-foo', () => done()).appendTo('body')

    const coel = make('emit-test1', div().appendTo(parent)[0])

    coel.foo()

    parent.remove()
  })
})

describe('@emit(event)', () => {
  it('makes the method emit the event with the returned value', done => {
    class EmitLastTest0 {
      foo () {
        return 321
      }
    }
    def('emit-last-test0', EmitLastTest0)
    callDecorator(emit('event-foo'), EmitLastTest0, 'foo')

    make('emit-last-test0', div().on('event-foo', (e) => {
      assert(e.detail === 321)

      done()
    })[0]).foo()
  })

  it('makes the method emit the event with the resolved value after the promise resolved', done => {
    let promiseResolved = false

    class EmitLastTest1 {
      foo () {
        return new Promise(resolve => {
          setTimeout(() => {
            promiseResolved = true
            resolve(123)
          }, 100)
        })
      }
    }
    def('emit-last-test1', EmitLastTest1)
    callDecorator(emit('event-foo'), EmitLastTest1, 'foo')

    make('emit-last-test1', div().on('event-foo', (e) => {
      assert(promiseResolved)
      assert(e.detail === 123)

      done()
    })[0]).foo()
  })
})

describe('@component', () => {
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
  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Cls {
      __init__ () {
        this.el.setAttribute('this-is', 'decorated-component')
      }
    }

    component('decorated-component')(Cls)

    const el = div()[0]

    init('decorated-component', el)

    assert(el.getAttribute('this-is') === 'decorated-component')
  })

  it('returns the constructor', () => {
    class Cls1 {
    }

    assert(component('decorated-component1')(Cls1) === Cls1)
  })
})

describe('@wire', () => {
  it('replaces the decorated getter and returns the instance of class-component of the getter name', () => {
    class Cls0 {
      get ['wire-test0-1'] () {}
    }
    class Cls1 {
    }
    def('wire-test0', Cls0)
    def('wire-test0-1', Cls1)

    callDecorator(wire, Cls0, 'wire-test0-1')

    const el = div().append(make('wire-test0-1', div()[0]).el)[0]

    const wireTest0 = make('wire-test0', el)

    assert(wireTest0['wire-test0-1'] instanceof Cls1)
  })

  it('returns the instance of class-component of the kebab-cased name of the getter name when the getter is in camelCase', () => {
    class Cls0 {
      get wireTest3Child () {}
    }
    class Cls1 {
    }
    def('wire-test3', Cls0)
    def('wire-test3-child', Cls1)

    callDecorator(wire, Cls0, 'wireTest3Child')

    const el = div().append(make('wire-test3-child', div()[0]).el)[0]

    const wireTest3 = make('wire-test3', el)

    assert(wireTest3.wireTest3Child instanceof Cls1)
  })

  it('can get the class component in the same dom as decorated method\'s class', () => {
    class Cls0 {
      get ['wire-test2-1'] () {}
    }
    class Cls1 {
    }
    def('wire-test2', Cls0)
    def('wire-test2-1', Cls1)

    callDecorator(wire, Cls0, 'wire-test2-1')

    const el = div()[0]

    init('wire-test2-1', el)
    const wireTest0 = make('wire-test2', el)

    assert(wireTest0['wire-test2-1'] instanceof Cls1)
    assert(wireTest0['wire-test2-1'] === get('wire-test2-1', el))
  })

  it('throws when the element is not available', () => {
    class Cls0 {
      get ['does-not-exist'] () {}
    }

    def('wire-test4', Cls0)

    callDecorator(wire, Cls0, 'does-not-exist')

    const instance = make('wire-test4', div()[0])

    assert.throws(() => {
      instance['does-not-exist']
    }, err => {
      return err.message === 'wired class-component "does-not-exist" is not available at DIV(class=[Cls0]'
    })
  })
})

describe('@wire(name, selector)', () => {
  it('replaces the getter of the decorated descriptor, and it returns the instance of class-component inside the element', () => {
    class Cls0 {
      get test () {}
    }
    class Cls1 {
    }
    def('wire-test1', Cls0)
    def('wire-test1-1', Cls1)

    callDecorator(wire('wire-test1-1', '.foo'), Cls0, 'test')

    const el = div().append(make('wire-test1-1', div().addClass('foo')[0]).el)[0]

    const wireTest1 = make('wire-test1', el)

    assert(wireTest1.test instanceof Cls1)
  })
})

describe('@wire.el(selector)', () => {
  it('wires the element in the component', () => {
    class Component {
      get elm () {}
    }

    def('wire-el-test', Component)
    callDecorator(wire.el('.elm'), Component, 'elm')

    const el = div().append(div().addClass('elm'))[0]

    const component = make('wire-el-test', el)
    assert(component.elm instanceof HTMLElement)
    assert(component.elm === el.firstChild)
  })
})

describe('@wire.elAll(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the all elements in the component', () => {
    class Component {
      get elms () {}
    }

    def('comp', Component)
    callDecorator(wire.elAll('.elm'), Component, 'elms')

    const el = div().append(div().addClass('elm'), div().addClass('elm'))[0]

    const component = make('comp', el)
    assert(component.elms.length === 2)
    assert(component.elms[0] === el.firstChild)
    assert(component.elms[1] === el.lastChild)
  })
})
