import { def, prep } from '../../'
import assert from 'assert'
import { div } from 'dom-gen'

describe('jquery plugin', () => {
  it('sets coelement.$el as the base jquery element', () => {
    class Class2 {}

    def('elem-test', Class2)

    const $el = div().addClass('elem-test').appendTo('body')

    prep('elem-test')

    const coelem = $el.cc.get('elem-test')

    assert(coelem.$el.length === 1)
    assert(coelem.$el[0] === $el[0])
  })
})

describe('$dom.cc', () => {
  class Spam {
    __init__ () {
      this.$el.attr('is_spam', 'true')
      this.$el.toggleClass('spam-toggle-test')
    }
  }

  before(() => {
    def('spam', Spam)
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

      prep()

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('throws an error when the corresponding coelement is unavailable', () => {
      const elem = div().addClass('does-not-exist').appendTo('body')

      prep()

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
