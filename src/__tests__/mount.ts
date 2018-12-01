import { mount } from '../index'
import * as assert from 'assert'

describe('mount', () => {
  it('initializes the element by the given component class', done => {
    class Component {
      el: HTMLElement

      __mount__() {
        assert.strictEqual(this.el, div)

        done()
      }
    }

    const div = document.createElement('div')

    mount(Component, div)
  })
})
