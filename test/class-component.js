const $ = jQuery
const assert = require('power-assert')
const { div } = require('dom-gen')

describe('$.cc', () => {
  'use strict'

  before(() => {
    class Foo {
      __init__ () {
        this.$el.attr('is_foo', 'true')
      }
    }
    $.cc('foo', Foo)

    class Bar {
      __init__ () {
        this.$el.attr('is_bar', 'true')
      }
    }
    $.cc('bar', Bar)
  })

  it('throws an error when the first param is not a string', () => {
    assert.throws(() => {
      $.cc(null, class A {})
    }, Error)
  })

  it('throws an error when the second param is not a function', () => {
    assert.throws(() => {
      $.cc('register-test2', null)
    }, Error)
  })

  it('registers a class component of the given name', () => {
    $.cc('assign-test0', class Class0 {})

    assert($.cc.__ccc__['assign-test0'] != null)
  })

  it('sets __coelement:class-name property when the class component is initialized', () => {
    class Class1 {}

    $.cc('assign-test2', Class1)

    const elem = $('<div class="assign-test2" />').appendTo('body')

    $.cc.init('assign-test2')

    assert(elem[0]['__coelement:assign-test2'] instanceof Class1)
  })

  it('sets coelement.$el as the base jquery element', () => {
    class Class2 {}

    $.cc('elem-test', Class2)

    const $el = $('<div class="elem-test" />').appendTo('body')

    $.cc.init('elem-test')

    const coelem = $el.cc.get('elem-test')

    assert(coelem.$el.length === 1)
    assert(coelem.$el[0] === $el[0])
  })

  it('sets coelement.el as the corresponding dom', () => {
    class Class3 {}

    $.cc('elem-test-3', Class3)

    const $dom = div().cc('elem-test-3')

    assert($dom.cc.get('elem-test-3').el === $dom[0])
  })

  describe('init', () => {
    beforeEach(() => {
      $('body').empty()
    })

    it('initializes the class component of the given name', () => {
      const foo = $('<div class="foo" />').appendTo(document.body)

      $.cc.init('foo')

      assert(foo.attr('is_foo') === 'true')
    })

    it('initializes multiple class componet by class names separated by whitespaces', () => {
      const foo = $('<div class="foo" />').appendTo('body')
      const bar = $('<div class="bar" />').appendTo('body')

      $.cc.init('foo bar')

      assert(foo.attr('is_foo') === 'true')
      assert(bar.attr('is_bar') === 'true')
    })

    it('throws an error when the given name of class-component is not registered', () => {
      assert.throws(() => {
        $.cc.init('does-not-exist')
      }, Error)
    })
  })
})

describe('$.fn.cc', () => {
  class Spam {
    __init__ (elem) {
      this.$el.attr('is_spam', 'true')
      this.$el.toggleClass('spam-toggle-test')
    }
  }

  before(() => {
    $.cc('spam', Spam)
  })

  it('is a function', () => {
    const elem = $('<div />')

    assert(typeof elem.cc === 'function')
  })

  it('initializes the class compenents of the given names', () => {
    const elem = $('<div/>').cc('foo bar')

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('adds the given class names to the element', () => {
    const elem = $('<div/>').cc('foo bar')

    assert(elem.hasClass('foo'))
    assert(elem.hasClass('bar'))
  })

  it('does not initialize twice', () => {
    const elem = $('<div/>').cc('spam')

    assert(elem.hasClass('spam-toggle-test'))

    elem.cc('spam')

    assert(elem.hasClass('spam-toggle-test'))
  })

  it('initializes the class components which the element has the name of', () => {
    const elem = $('<div class="foo bar" />').cc()

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('does nothing if it does not have the class component names', () => {
    const elem = $('<div class="foo-x bar-x" />').cc()

    assert(elem.attr('is_foo') === undefined)
    assert(elem.attr('is_bar') === undefined)

    const elem0 = $('<div class="" />').cc()

    assert(elem0.attr('is_foo') === undefined)
    assert(elem0.attr('is_bar') === undefined)
  })

  describe('init', () => {
    it('inserts the given class name into the element', () => {
      const elem = $('<div />')

      elem.cc.init('spam')

      assert(elem.hasClass('spam'))
    })

    it('sets the coelement if it has a coelemental', () => {
      const elem = $('<div />')

      elem.cc.init('spam')

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('returns the coelement if it has a coelement', () => {
      const elem = $('<div />')

      assert(elem.cc.init('spam') instanceof Spam)
    })
  })

  describe('get', () => {
    it('gets the coelement of the given name', () => {
      const elem = $('<div class="spam" />').appendTo('body')

      $.cc.init()

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('throws an error when the corresponding coelement is unavailable', () => {
      const elem = $('<div class="does-not-exist" />').appendTo('body')

      $.cc.init()

      assert.throws(() => {
        elem.cc.get('does-not-exist')
      })
    })

    it('throws an error when the elem is empty dom selectioin', () => {
      assert.throws(() => {
        $('#nothing').cc.get('something')
      })
    })
  })
})
