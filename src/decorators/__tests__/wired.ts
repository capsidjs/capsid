import * as assert from 'assert'
import * as genel from 'genel'
import { def, make, wired } from '../../index'
import { clearComponents } from '../../__tests__/helper'

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

    const el0 = genel.div``
    const wireTest1 = make('wire-test1', el0)

    const el1 = genel.div`
    `
    const el2 = genel.div``
    make('wire-test1-1', el2)
    el2.classList.add('foo')

    el0.appendChild(el1)
    el1.appendChild(el2)

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

    const el = genel.div`
      <div class="elm"></div>
    `

    const component = make('wire-el-test', el)
    assert(component.elm instanceof HTMLElement)
    assert(component.elm === el.firstChild)
  })
})

describe('@wired.all(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the all elements in the component', () => {
    class Component {
      @wired.all('.elm') elms: HTMLElement[]
    }

    def('comp', Component)

    const el = genel.div`
      <div class="elm"></div>
      <div class="elm"></div>
    `

    const component = make('comp', el)
    assert(component.elms.length === 2)
    assert(component.elms[0] === el.firstChild)
    assert(component.elms[1] === el.lastChild)
  })
})
