const {expect} = require('chai')
const $ = jQuery

describe('$.cc.event', () => {

  it('binds event handlers if the event decorators are present', done => {
    class Class3 {
      handler() {
        done()
      }
    }

    $.cc.event('click', '.inner')(Class3.prototype, 'handler', Object.getOwnPropertyDescriptor(Class3.prototype, 'handler'))

    $.cc('elem-test3', Class3)

    const elem = $('<div class="elem-test3"><span class="inner"></span></div>').appendTo('body')

    $.cc.init('elem-test3')

    elem.find('.inner').trigger('click')
  })

})

describe('component(className)', () => {
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

describe('$.cc.trigger(start, end, error)', () => {
  it('prepends the trigger of the start event to the method', done => {
    class Class4 {
      method() {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(Class4.prototype, 'method')
    $.cc.trigger('class4-start')(Class4.prototype, 'method', descriptor)
    Object.defineProperty(Class4.prototype, 'method', descriptor)

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

    const descriptor = Object.getOwnPropertyDescriptor(Class5.prototype, 'method')
    $.cc.trigger(null, 'class5-ended')(Class5.prototype, 'method', descriptor)
    Object.defineProperty(Class5.prototype, 'method', descriptor)

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

    const descriptor = Object.getOwnPropertyDescriptor(Class6.prototype, 'method')
    $.cc.trigger(null, null, 'class6-error')(Class6.prototype, 'method', descriptor)
    Object.defineProperty(Class6.prototype, 'method', descriptor)

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
