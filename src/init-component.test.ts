import * as capsid from './index'
import initComponent from './init-component'
import * as assert from 'assert'
import { clearComponents } from './test-helper'

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
      el?: HTMLElement

      __mount__() {
        assert.strictEqual(this.el, el)

        done()
      }
    }

    const el = document.createElement('div')

    initComponent(A, el)
  })

  it('calls static __init__', done => {
    class A {
      static capsid: object

      static __init__() {
        assert.strictEqual(this.capsid, capsid)

        done()
      }
    }

    initComponent(A, document.createElement('div'))
  })

  describe('__mount__', () => {
    it('runs after @on handlers are set', done => {
      class A {
        el?: HTMLElement

        __mount__() {
          this.el!.click()
        }

        @on.click
        onClick() {
          done()
        }
      }

      initComponent(A, document.createElement('div'))
    })
  })
})
