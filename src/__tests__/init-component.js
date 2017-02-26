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
    assert.strictEqual(coelem.capsid, capsid)
  })
})
