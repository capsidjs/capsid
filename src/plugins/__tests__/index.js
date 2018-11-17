// @flow
import { def, prep } from '../../'
import assert from 'assert'
import { div } from 'dom-gen'
import { clearComponents } from '../../__tests__/helper'
import { Foo, Bar, Spam } from '../../__tests__/fixture'

describe('jquery plugin', () => {
  afterEach(() => clearComponents())

  it('sets coelement.$el as the base jquery element', () => {
    def('component', class {})

    const $el = div()
      .addClass('component')
      .appendTo('body')

    prep('component')

    const coelem = $el.cc.get('component')

    assert(coelem.$el.length === 1)
    assert(coelem.$el[0] === $el[0])
  })
})

describe('$dom.cc', () => {
  before(() => {
    def('foo', Foo)
    def('bar', Bar)
    def('spam', Spam)
  })

  after(() => clearComponents())

  it('is a function', () => {
    assert(typeof div().cc === 'function')
  })

  it('initializes the class compenents of the given names', () => {
    const elem = div()
      .cc('foo')
      .cc('bar')

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('adds the given class names to the element', () => {
    const elem = div()
      .cc('foo')
      .cc('bar')

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
    const elem = div()
      .addClass('foo bar')
      .cc()

    assert(elem.attr('is_foo') === 'true')
    assert(elem.attr('is_bar') === 'true')
  })

  it('does nothing if it does not have the class component names', () => {
    const elem = div()
      .addClass('foo-x bar-x')
      .cc()

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
      const elem = div()
        .addClass('spam')
        .appendTo('body')

      prep()

      assert(elem.cc.get('spam') != null)
      assert(elem.cc.get('spam') instanceof Spam)
    })

    it('throws an error when the corresponding coelement is unavailable', () => {
      const elem = div()
        .addClass('does-not-exist')
        .appendTo('body')

      prep()

      assert.throws(() => {
        elem.cc.get('does-not-exist')
      })
    })

    it('throws an error when the elem is empty dom selectioin', () => {
      assert.throws(() => {
        div()
          .find('.nothing')
          .cc.get('something')
      })
    })
  })

  /*
  describe('$wired', () => {
    it('makes the decorated getter the sub elements selected by jquery with the given selector', () => {
      class Component {
        get $subelems () {}
      }

      callDecorator(wire.$el('.abc'), Component, '$subelems')

      def('component', Component)

      const component = div(div().addClass('abc'), div().addClass('abc'))
        .appendTo('body')
        .cc.init('component')

      assert(component.$subelems instanceof $)
      assert(component.$subelems.length === 2)
    })
  })
  */
})
