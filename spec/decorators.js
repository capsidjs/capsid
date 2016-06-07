const {expect} = require('chai')
const {div} = require('dom-gen')
const $ = jQuery

/**
 * @param {Function} decorator The decorator
 * @param {Function} cls The class
 * @param {string} key The key of the method to decorate
 */
function callDecorator(decorator, cls, key) {
  const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key)
  const result = decorator(cls.prototype, key, descriptor)
  Object.defineProperty(cls.prototype, key, result || descriptor)
}

describe('@event(event, selector)', () => {

  it('binds event handlers if the event decorators are present', done => {
    class Class3 {
      handler() {
        done()
      }
    }

    callDecorator($.cc.event('click', '.inner'), Class3, 'handler')

    $.cc('elem-test3', Class3)

    const elem = $('<div class="elem-test3"><span class="inner"></span></div>').appendTo('body')

    $.cc.init('elem-test3')

    elem.find('.inner').trigger('click')
  })

})

describe('@on(event)', () => {
  it('registers the method as the event listener of the given event name', done => {
    class OnTest0 {
      handler() { done() }
    }
    $.cc('on-test0', OnTest0)
    callDecorator($.cc.on('click'), OnTest0, 'handler')

    div().cc('on-test0').trigger('click')
  })
})

describe('@on(event).at(selector)', () => {
  it('registers the method as the event listener of the given event name and selector', done => {
    class OnAtTest0 {
      foo() { done() }
      bar() { done(new Error('bar should not be called')) }
    }
    $.cc('on-at-test0', OnAtTest0)
    callDecorator($.cc.on('foo-event').at('.inner'), OnAtTest0, 'foo')
    callDecorator($.cc.on('bar-event').at('.inner'), OnAtTest0, 'bar')

    const elem = div(div({addClass: 'inner'})).cc('on-at-test0')

    elem.trigger('bar-event')
    elem.find('.inner').trigger('foo-event')
  })
})

describe('@emit(event)', () => {})

describe('@emit(event).first', () => {})

describe('@emit(event).last', () => {})

describe('@emit(event).on.error', () => {})

describe('@component(className)', () => {
  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Cls {
      constructor(elem) {
        elem.attr('this-is', 'decorated-component')
      }
    }

    $.cc.component('decorated-component')(Cls)

    const elem = $('<div />')

    elem.cc.init('decorated-component')

    expect(elem.attr('this-is')).to.equal('decorated-component')
  })
})

describe('@trigger(start, end, error)', () => {
  it('prepends the trigger of the start event to the method', done => {
    class Class4 {
      method() {}
    }

    callDecorator($.cc.trigger('class4-start'), Class4, 'method')

    $.cc('class4', Class4)

    const elem = $('<div />').cc('class4').appendTo('body')

    $('body').on('class4-start', () => done())

    elem.cc.get('class4').method()
  })

  it('appends the trigger of the end event to the method', done => {
    class Class5 {
      method() {
        return new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    callDecorator($.cc.trigger(null, 'class5-ended'), Class5, 'method')

    $.cc('class5', Class5)

    const elem = $('<div />').cc('class5').appendTo('body')

    let flag = false

    setTimeout(() => {
      flag = true
    }, 100)
    setTimeout(() => {
      flag = false
    }, 300)

    $('body').on('class5-ended', () => {
      expect(flag).to.be.true
      done()
    })

    elem.cc.get('class5').method()
  })

  it('appends the trigger of the error event to the method', done => {
    class Class6 {
      method() {
        return new Promise((resolve, reject) => setTimeout(() => reject(new Error()), 200))
      }
    }

    callDecorator($.cc.trigger(null, null, 'class6-error'), Class6, 'method')

    $.cc('class6', Class6)

    const elem = $('<div />').cc('class6').appendTo('body')

    let flag = false

    setTimeout(() => {
      flag = true
    }, 100)
    setTimeout(() => {
      flag = false
    }, 300)

    $('body').on('class6-error', () => {
      expect(flag).to.be.true
      done()
    })

    elem.cc.get('class6').method()
  })
})
