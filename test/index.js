import assert from 'assert'
import { div } from 'dom-gen'

import { def, init, co, get, el, __ccc__ } from '../src'

describe('capsid', () => {
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
    def('foo', Foo)
    def('bar', Bar)
  })

  describe('def', () => {
    it('throws an error when the first param is not a string', () => {
      assert.throws(() => {
        def(null, class A {})
      }, Error)
    })

    it('throws an error when the second param is not a function', () => {
      assert.throws(() => {
        def('register-test2', null)
      }, Error)
    })

    it('registers a class component of the given name', () => {
      def('assign-test0', class Class0 {})

      assert(__ccc__['assign-test0'] != null)
    })

    it('sets __coelement:class-name property when the class component is initialized', () => {
      class Class1 {}

      def('assign-test2', Class1)

      const elem = div().addClass('assign-test2').appendTo('body')

      init('assign-test2')

      assert(elem[0]['__coelement:assign-test2'] instanceof Class1)
    })

    it('sets coelement.$el as the base jquery element', () => {
      class Class2 {}

      def('elem-test', Class2)

      const $el = div().addClass('elem-test').appendTo('body')

      init('elem-test')

      const coelem = $el.cc.get('elem-test')

      assert(coelem.$el.length === 1)
      assert(coelem.$el[0] === $el[0])
    })

    it('sets coelement.el as the corresponding dom', () => {
      class Class3 {}

      def('elem-test-3', Class3)

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

      init('foo')

      assert(foo.attr('is_foo') === 'true')
    })

    it('initializes multiple class componet by class names separated by whitespaces', () => {
      const foo = div().addClass('foo').appendTo('body')
      const bar = div().addClass('bar').appendTo('body')

      init('foo bar')

      assert(foo.attr('is_foo') === 'true')
      assert(bar.attr('is_bar') === 'true')
    })

    it('throws an error when the given name of class-component is not registered', () => {
      assert.throws(() => {
        init('does-not-exist')
      }, Error)
    })
  })

  describe('el', () => {
    it('initializes the element as an class-component of the given name', () => {
      const elm = div()[0]

      el('foo', elm)

      assert($(elm).attr('is_foo') === 'true')
    })

    it('returns nothing', () => {
      assert(el('foo', div()[0]) === undefined)
    })
  })

  describe('co', () => {
    it('initializes the element as an class-component of the given name', () => {
      const el = div()[0]

      co('foo', el)

      assert($(el).attr('is_foo') === 'true')
    })

    it('returns an instance of coelement', () => {
      assert(co('foo', div()[0]) instanceof Foo)
    })
  })

  describe('get', () => {
    it('gets the coelement instance from the element', () => {
      const elm = div()[0]

      el('foo', elm)

      const coel = get('foo', elm)

      assert(coel instanceof Foo)
      assert(coel.el === elm)
    })
  })
})
