// @flow

import * as capsid from '../index.js'
import initComponent from '../init-component.js'
import assert from 'assert'
import { clearComponents } from './helper.js'
import { callMethodDecorator } from '../decorators/__tests__/helper.js'

const { on } = capsid

describe('initComponent', () => {
  afterEach(() => {
    clearComponents()
  })

  it('initializes the element as a component by the given constructor', () => {
    class A {}

    const el = document.createElement('div')
    const coelem = initComponent(A, el)

    assert(coelem instanceof A)
    assert.strictEqual(coelem.el, el)
  })

  it('calls __mount__', done => {
    class A {
      el: HTMLElement

      __mount__ () {
        assert.strictEqual(this.el, el)

        done()
      }
    }

    const el = document.createElement('div')

    initComponent(A, el)
  })

  it('calls static __init__', done => {
    class A {
      static capsid: Object

      static __init__ () {
        assert.strictEqual(this.capsid, capsid)

        done()
      }
    }

    initComponent(A, document.createElement('div'))
  })

  describe('__mount__', () => {
    it('runs after @on handlers are set', done => {
      class A {
        el: HTMLElement

        __mount__ () {
          this.el.click()
        }

        onClick () {
          done()
        }
      }

      callMethodDecorator(on.click, A, 'onClick')

      initComponent(A, document.createElement('div'))
    })
  })
})
