import * as assert from 'assert'
import innerHTML from './inner-html'
import component from './component'
import make from '../make'
import { clearComponents } from '../test-helper'

describe('@is', () => {
  afterEach(() => { clearComponents() })

  it('adds the class names to the element', () => {
    const html = `
      <p>hello</p>
    `
    @component('foo')
    @innerHTML(html)
    class Foo {
    }

    const el = document.createElement('div')
    const coel = make('foo', el)

    assert(coel instanceof Foo)
    assert(el.innerHTML, html)
  })
})
