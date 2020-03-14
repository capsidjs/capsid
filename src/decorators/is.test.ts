import * as assert from 'assert'
import is from './is'
import component from './component'
import make from '../make'
import { clearComponents } from '../test-helper'

describe('@is', () => {
  afterEach(() => { clearComponents() })

  it('adds the class names to the element', () => {
    @component('foo')
    @is('bar-observer')
    class Foo {
    }

    const el = document.createElement('div')
    const coel = make('foo', el)

    assert(coel instanceof Foo)
    assert(el.classList.contains('bar-observer'))
  })
})
