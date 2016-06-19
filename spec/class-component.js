const $ = jQuery
const assert = require('power-assert')

describe('$.cc', () => {
  'use strict'

  before(() => {
    $.cc('foo', elem => {
      elem.attr('is_foo', 'true')
    })

    $.cc('bar', elem => {
      elem.attr('is_bar', 'true')
    })
  })

  it('throws an error when the first param is not a string', () => {
    assert.throws(() => {
      $.cc(null, () => {})
    }, Error)
  })

  it('throws an error when the second param is not a function', () => {
    assert.throws(() => {
      $.cc('register-test2', null)
    }, Error)
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

    it('initializes multiple class components', () => {
      const foo = $('<div class="foo" />').appendTo('body')
      const bar = $('<div class="bar" />').appendTo('body')

      $.cc.init(['foo', 'bar'])

      assert(foo.attr('is_foo') === 'true')
      assert(bar.attr('is_bar') === 'true')
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

  it('registers a class component of the given name', () => {
    $.cc('assign-test0', class Class0 {})

    assert($.cc.__manager__.ccc['assign-test0'] != null)
  })

  it('sets coelementName property to the given construtor', () => {
    class Class0 {}

    $.cc('assgin-test1', Class0)

    assert(Class0.coelementName === 'assgin-test1')
  })

  it('sets __coelement:class-name data property when the class component is initialized', () => {
    class Class1 {}

    $.cc('assign-test2', Class1)

    const elem = $('<div class="assign-test2" />').appendTo('body')

    $.cc.init('assign-test2', 'body')

    assert(elem.data('__coelement:assign-test2') instanceof Class1)
  })

  it('sets coelement.elem as the base jquery element', () => {
    class Class2 {}

    $.cc('elem-test', Class2)

    const elem = $('<div class="elem-test" />').appendTo('body')

    $.cc.init('elem-test')

    const coelem = elem.cc.get('elem-test')

    assert(coelem.elem[0] === elem[0])
  })

  it('does not set coelement.elem if __cc_init__ is overriden', () => {
    class ClassCcInit {
      __cc_init__(elem) { // eslint-disable-line
        this.el = elem
      }
    }

    $.cc('cc-init-test', ClassCcInit)

    const elem = $('<div/>').cc('cc-init-test')
    const coelem = elem.cc.get('cc-init-test')

    assert(coelem.elem === undefined)
    assert(coelem.el[0] === elem[0])
  })
})

describe('$.fn.cc', () => {
  class Spam {
    constructor (elem) {
      elem.attr('is_spam', 'true')
      elem.toggleClass('spam-toggle-test')
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
