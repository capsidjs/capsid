import { mount } from '../index.js'
import { expect } from 'chai'

describe('mount', () => {
  it('initializes the element by the given component class', () => {
    class Component {
      __init__ () {
        this.el.foo = 1
      }
    }

    const div = document.createElement('div')

    mount(Component, div)

    expect(div.foo).to.equal(1)
  })
})
