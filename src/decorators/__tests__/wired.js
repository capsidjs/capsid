// @flow

import assert from 'assert'
import { div } from 'dom-gen'
import { def, make, wired } from '../../'
import { clearComponents } from '../../__tests__/helper.js'

describe('@wired.component(name, selector)', () => {
  afterEach(() => clearComponents())

  it('replaces the getter of the decorated descriptor, and it returns the instance of class-component inside the element', () => {
    class Cls0 {
      @wired.component('wire-test1-1', '.foo')
      test = {}
    }
    class Cls1 {}
    def('wire-test1', Cls0)
    def('wire-test1-1', Cls1)

    const el = div().append(
      make('wire-test1-1', div().addClass('foo')[0]).el
    )[0]

    const wireTest1 = make('wire-test1', el)

    assert(wireTest1.test instanceof Cls1)
  })
})

describe('@wired(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the element in the component', () => {
    class Component {
      @wired('.elm') elm = {}
    }

    def('wire-el-test', Component)

    const el = div().append(div().addClass('elm'))[0]

    const component = make('wire-el-test', el)
    assert(component.elm instanceof HTMLElement)
    assert(component.elm === el.firstChild)
  })
})

describe('@wired.all(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the all elements in the component', () => {
    class Component {
      @wired.all('.elm') elms = []
    }

    def('comp', Component)

    const el = div().append(div().addClass('elm'), div().addClass('elm'))[0]

    const component = make('comp', el)
    assert(component.elms.length === 2)
    assert(component.elms[0] === el.firstChild)
    assert(component.elms[1] === el.lastChild)
  })
})
