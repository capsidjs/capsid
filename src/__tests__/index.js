import assert from 'assert'
import { div } from 'dom-gen'

import * as capsid from '../index.js'
const { def, prep, make, get, init, initComponent, __ccc__ } = capsid

describe('capsid', () => {
  class Foo {
    __init__ () {
      this.el.setAttribute('is_foo', 'true')
    }
  }

  class Bar {
    __init__ () {
      this.el.setAttribute('is_bar', 'true')
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

      prep('assign-test2')

      assert(elem[0]['__coelement:assign-test2'] instanceof Class1)
    })

    it('sets coelement.$el as the base jquery element', () => {
      class Class2 {}

      def('elem-test', Class2)

      const $el = div().addClass('elem-test').appendTo('body')

      prep('elem-test')

      const coelem = $el.cc.get('elem-test')

      assert(coelem.$el.length === 1)
      assert(coelem.$el[0] === $el[0])
    })

    it('sets the dom to coele.el', () => {
      class Class3 {}

      def('elem-test-3', Class3)

      const el = document.createElement('div')

      init('elem-test-3', el)

      assert(get('elem-test-3', el).el === el)
    })

    it('sets capsid to coelem.capsid', () => {
      const el = document.createElement('div')

      const coelem = initComponent(class A {}, el)

      assert(coelem.capsid, capsid)
    })
  })

  describe('prep', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    it('initializes the class component of the given name', () => {
      const el = div().addClass('foo').appendTo(document.body)[0]

      prep('foo')

      assert(el.getAttribute('is_foo') === 'true')
    })

    it('throws an error when the given name of class-component is not registered', () => {
      assert.throws(() => {
        prep('does-not-exist')
      }, Error)
    })
  })

  describe('init', () => {
    it('initializes the element as an class-component of the given name', () => {
      const el = div()[0]

      init('foo', el)

      assert(el.getAttribute('is_foo') === 'true')
    })

    it('returns nothing', () => {
      assert(init('foo', div()[0]) === undefined)
    })
  })

  describe('make', () => {
    it('initializes the element as an class-component of the given name', () => {
      const el = div()[0]

      make('foo', el)

      assert(el.getAttribute('is_foo') === 'true')
    })

    it('returns an instance of coelement', () => {
      assert(make('foo', div()[0]) instanceof Foo)
    })
  })

  describe('get', () => {
    it('gets the coelement instance from the element', () => {
      const elm = div()[0]

      init('foo', elm)

      const coel = get('foo', elm)

      assert(coel instanceof Foo)
      assert(coel.el === elm)
    })
  })
})
