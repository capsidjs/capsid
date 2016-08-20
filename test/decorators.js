const {div} = require('dom-gen')
const assert = require('power-assert')
const $ = jQuery
const {on, emit, component, wire} = $.cc

/**
 * @param {Function} decorator The decorator
 * @param {Function} cls The class
 * @param {string} key The key of the method to decorate
 */
function callDecorator (decorator, cls, key) {
  const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key)
  const result = decorator(cls.prototype, key, descriptor)
  Object.defineProperty(cls.prototype, key, result || descriptor)
}

describe('@on(event)', () => {
  it('registers the method as the event listener of the given event name', done => {
    class OnTest0 {
      handler () { done() }
    }
    $.cc('on-test0', OnTest0)
    callDecorator(on('click'), OnTest0, 'handler')

    div().cc('on-test0').trigger('click')
  })

  it('registers the method as the event listener for children classes', done => {
    class OnTest1 {
      handler () { done() }
    }
    function OnTest1Child () {}
    OnTest1Child.prototype = new OnTest1()
    OnTest1Child.prototype.constructor = OnTest1Child
    function OnTest1ChildChild () {
    }
    OnTest1ChildChild.prototype = new OnTest1Child()
    OnTest1ChildChild.prototype.constructor = OnTest1ChildChild
    OnTest1ChildChild.prototype.bar = function () {}

    callDecorator(on('click'), OnTest1, 'handler')
    callDecorator(on('bar'), OnTest1ChildChild, 'bar')

    $.cc('on-test1-child-child', OnTest1ChildChild)

    div().cc('on-test1-child-child').trigger('click')
  })
})

describe('@on(event).at(selector)', () => {
  it('registers the method as the event listener of the given event name and selector', done => {
    class OnAtTest0 {
      foo () { done() }
      bar () { done(new Error('bar should not be called')) }
    }
    $.cc('on-at-test0', OnAtTest0)
    callDecorator(on('foo-event').at('.inner'), OnAtTest0, 'foo')
    callDecorator(on('bar-event').at('.inner'), OnAtTest0, 'bar')

    const elem = div(div({addClass: 'inner'})).cc('on-at-test0')

    elem.trigger('bar-event')
    elem.find('.inner').trigger('foo-event')
  })
})

describe('@emit(event)', () => {
  it('makes the method emits the event with the arguments of the method', done => {
    class EmitTest0 {
      foo () {
        return 42
      }
    }
    $.cc('emit-test0', EmitTest0)
    callDecorator(emit('event-foo'), EmitTest0, 'foo')

    const coelem = div().on('event-foo', (e, a, b, c) => {
      assert(a === 1)
      assert(b === 2)
      assert(c === 3)
    }).cc.init('emit-test0')

    assert(coelem.foo(1, 2, 3) === 42)

    done()
  })
})

describe('@emit(event).first', () => {
  it('is the same as @emit(event)', () => {
    const deco = emit('event-foo')

    assert(deco.first === deco)
  })
})

describe('@emit(event).last', () => {
  it('makes the method emit the event with the returned value', done => {
    class EmitLastTest0 {
      foo () {
        return 321
      }
    }
    $.cc('emit-last-test0', EmitLastTest0)
    callDecorator(emit('event-foo').last, EmitLastTest0, 'foo')

    div().on('event-foo', (e, param) => {
      assert(param === 321)

      done()
    }).cc.init('emit-last-test0').foo()
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
    $.cc('emit-last-test1', EmitLastTest1)
    callDecorator(emit('event-foo').last, EmitLastTest1, 'foo')

    div().on('event-foo', (e, param) => {
      assert(promiseResolved)
      assert(param === 123)

      done()
    }).cc.init('emit-last-test1').foo()
  })
})

describe('@component', () => {
  it('registers the component with the kebab cased component name', () => {
    class FooBarBaz {}

    component(FooBarBaz)

    assert(div().cc.init('foo-bar-baz') instanceof FooBarBaz)
  })
})

describe('@component(className)', () => {
  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Cls {
      constructor (elem) {
        elem.attr('this-is', 'decorated-component')
      }
    }

    component('decorated-component')(Cls)

    const elem = div().cc('decorated-component')

    assert(elem.attr('this-is') === 'decorated-component')
  })
})

describe('@wire\'d getter', () => {
  it('replaces the decorated getter and returns the instance of class-component of the getter name', () => {
    class Cls0 {
      get ['wire-test0-1'] () {}
    }
    class Cls1 {
    }
    $.cc('wire-test0', Cls0)
    $.cc('wire-test0-1', Cls1)

    callDecorator(wire, Cls0, 'wire-test0-1')

    const elem = div().append(div().cc('wire-test0-1'))

    const wireTest0 = elem.cc.init('wire-test0')

    assert(wireTest0['wire-test0-1'] instanceof Cls1)
  })

  it('returns the instance of class-component of the kebab-cased name of the getter name when the getter is in camelCase', () => {
    class Cls0 {
      get wireTest3Child () {}
    }
    class Cls1 {
    }
    $.cc('wire-test3', Cls0)
    $.cc('wire-test3-child', Cls1)

    callDecorator(wire, Cls0, 'wireTest3Child')

    const elem = div().append(div().cc('wire-test3-child'))

    const wireTest3 = elem.cc.init('wire-test3')

    assert(wireTest3.wireTest3Child instanceof Cls1)
  })

  it('can get the class component in the same dom as decorated method\'s class', () => {
    class Cls0 {
      get ['wire-test2-1'] () {}
    }
    class Cls1 {
    }
    $.cc('wire-test2', Cls0)
    $.cc('wire-test2-1', Cls1)

    callDecorator(wire, Cls0, 'wire-test2-1')

    const wireTest0 = div().cc('wire-test2-1').cc.init('wire-test2')

    assert(wireTest0['wire-test2-1'] instanceof Cls1)
  })
})

describe('@wire(name, selector)\'d getter', () => {
  it('replaces the getter of the decorated descriptor, and it returns the instance of class-component inside the element', () => {
    class Cls0 {
      get test () {}
    }
    class Cls1 {
    }
    $.cc('wire-test1', Cls0)
    $.cc('wire-test1-1', Cls1)

    callDecorator(wire('wire-test1-1', '.foo'), Cls0, 'test')

    const elem = div().append(div().addClass('foo').cc('wire-test1-1'))

    const wireTest1 = elem.cc.init('wire-test1')

    assert(wireTest1.test instanceof Cls1)
  })
})
