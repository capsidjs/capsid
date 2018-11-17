// @flow

import assert from 'assert'
import { div } from 'dom-gen'
import { make, component } from '../../'
import { clearComponents } from '../../__tests__/helper'
import { callClassDecorator } from './helper'

describe('@component(name)', () => {
  afterEach(() => clearComponents())

  it('works as a class decorator and registers the class as a class component of the given name', () => {
    class Foo {
      el: HTMLElement

      __mount__ () {
        this.el.setAttribute('this-is', 'decorated-component')
      }
    }

    callClassDecorator(component('decorated-component'), Foo)

    const el = div()[0]

    make('decorated-component', el)

    assert(el.getAttribute('this-is') === 'decorated-component')
  })
})
