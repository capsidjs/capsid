// @flow

import assert from 'assert'
import genel from 'genel'
import { make, component } from '../../'
import { clearComponents } from '../../__tests__/helper'

describe('@component(name)', () => {
  afterEach(() => clearComponents())

  it('works as a class decorator and registers the class as a class component of the given name', () => {
    @component('decorated-component')
    class Foo {
      el: HTMLElement

      __mount__ () {
        this.el.setAttribute('this-is', 'decorated-component')
      }
    }

    const el = genel.div``

    const foo = make('decorated-component', el)

    assert(foo instanceof Foo)
    assert(el.getAttribute('this-is') === 'decorated-component')
  })
})
