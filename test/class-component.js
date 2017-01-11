const $ = jQuery
const assert = require('assert')
const { div } = require('dom-gen')

const cc = require('../src')

describe('cc', () => {
  'use strict'
  class Foo {
    __init__ () {
      this.$el.attr('is_foo', 'true')
    }
  }

  class Bar {
    __init__ () {
      this.$el.attr('is_bar', 'true')
    }
  }

  before(() => {
    cc.def('foo', Foo)
    cc.def('bar', Bar)
  })

  describe('def', () => {
    it('throws an error when the first param is not a string', () => {
      assert.throws(() => {
        cc.def(null, class A {})
      }, Error)
    })

    it('throws an error when the second param is not a function', () => {
      assert.throws(() => {
        cc.def('register-test2', null)
      }, Error)
    })

    it('registers a class component of the given name', () => {
      cc.def('assign-test0', class Class0 {})

      assert(cc.__ccc__['assign-test0'] != null)
    })

    it('sets __coelement:class-name property when the class component is initialized', () => {
      class Class1 {}

      cc.def('assign-test2', Class1)

      const elem = div().addClass('assign-test2').appendTo('body')

      cc.init('assign-test2')

      assert(elem[0]['__coelement:assign-test2'] instanceof Class1)
    })

    it('sets coelement.$el as the base jquery element', () => {
      class Class2 {}

      cc.def('elem-test', Class2)

      const $el = div().addClass('elem-test').appendTo('body')

      cc.init('elem-test')

      const coelem = $el.cc.get('elem-test')

      assert(coelem.$el.length === 1)
      assert(coelem.$el[0] === $el[0])
    })

    it('sets coelement.el as the corresponding dom', () => {
      class Class3 {}

      cc.def('elem-test-3', Class3)

      const $dom = div().cc('elem-test-3')

      assert($dom.cc.get('elem-test-3').el === $dom[0])
    })
  })

  describe('init', () => {
    beforeEach(() => {
      $('body').empty()
    })

    it('initializes the class component of the given name', () => {
      const foo = div().addClass('foo').appendTo(document.body)

      cc.init('foo')

      assert(foo.attr('is_foo') === 'true')
    })

    it('initializes multiple class componet by class names separated by whitespaces', () => {
      const foo = div().addClass('foo').appendTo('body')
      const bar = div().addClass('bar').appendTo('body')

      cc.init('foo bar')

      assert(foo.attr('is_foo') === 'true')
      assert(bar.attr('is_bar') === 'true')
    })

    it('throws an error when the given name of class-component is not registered', () => {
      assert.throws(() => {
        cc.init('does-not-exist')
      }, Error)
    })
  })

  describe('el', () => {
    it('initializes the element as an class-component of the given name', () => {
      const el = div()[0]

      cc.el('foo', el)

      assert($(el).attr('is_foo') === 'true')
    })

    it('returns nothing', () => {
      assert(cc.el('foo', div()[0]) === undefined)
    })
  })

  describe('co', () => {
    it('initializes the element as an class-component of the given name', () => {
      const el = div()[0]

      cc.co('foo', el)

      assert($(el).attr('is_foo') === 'true')
    })

    it('returns an instance of coelement', () => {
      assert(cc.co('foo', div()[0]) instanceof Foo)
    })
  })

  describe('get', () => {
    it('gets the coelement instance from the element', () => {
      const el = div()[0]

      cc.el('foo', el)

      const coel = cc.get('foo', el)

      assert(coel instanceof Foo)
      assert(coel.el === el)
    })
  })
})

describe('$dom.cc', () => {
  class Spam {
    __init__ (elem) {
      this.$el.attr('is_spam', 'true')
      this.$el.toggleClass('spam-toggle-test')
    }
  }

  before(() => {
    cc.def('spam', Spam)
  })

  it('is a function', () => {
    assert(typeof div().cc === 'function')
  })

  it('initializes the class compenents of the given names', () => {
    const elem = div().cc('foo').cc('bar')

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('adds the given class names to the element', () => {
    const elem = div().cc('foo').cc('bar')

    assert(elem.hasClass('foo'))
    assert(elem.hasClass('bar'))
  })

  it('does not initialize twice', () => {
    const elem = div().cc('spam')

    assert(elem.hasClass('spam-toggle-test'))

    elem.cc('spam')

    assert(elem.hasClass('spam-toggle-test'))
  })

  it('initializes the class components which the element has the name of', () => {
    const elem = div().addClass('foo bar').cc()

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('does nothing if it does not have the class component names', () => {
    const elem = div().addClass('foo-x bar-x').cc()

    assert(elem.attr('is_foo') === undefined)
    assert(elem.attr('is_bar') === undefined)

    const elem0 = div().cc()

    assert(elem0.attr('is_foo') === undefined)
    assert(elem0.attr('is_bar') === undefined)
  })

  describe('init', () => {
    it('inserts the given class name into the element', () => {
      const elem = div()

      elem.cc.init('spam')

      assert(elem.hasClass('spam'))
    })

    it('sets the coelement if it has a coelemental', () => {
      const elem = div()

      elem.cc.init('spam')

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('returns the coelement if it has a coelement', () => {
      const elem = div()

      assert(elem.cc.init('spam') instanceof Spam)
    })
  })

  describe('get', () => {
    it('gets the coelement of the given name', () => {
      const elem = div().addClass('spam').appendTo('body')

      cc.init()

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('throws an error when the corresponding coelement is unavailable', () => {
      const elem = div().addClass('does-not-exist').appendTo('body')

      cc.init()

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
