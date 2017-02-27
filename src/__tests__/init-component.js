import * as capsid from '../index.js'
import initComponent from '../init-component'
import assert from 'power-assert'

describe('initComponent', () => {
  it('initializes the element as a component by the given constructor', () => {
    class A {}

    const el = document.createElement('div')
    const coelem = initComponent(A, el)

    assert(coelem instanceof A)
    assert.strictEqual(coelem.el, el)
  })

  it('calls __init__', done => {
    class A {
      __init__ () {
        assert.strictEqual(this.el, el)

        done()
      }
    }

    const el = document.createElement('div')

    initComponent(A, el)
  })

  it('calls static __init__', done => {
    class A {
      static __init__ () {
        assert.strictEqual(this.capsid, capsid)

        done()
      }
    }

    initComponent(A, document.createElement('div'))
  })
})
