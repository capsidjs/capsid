import * as assert from 'assert'
import * as genel from 'genel'
import { def, make, wired } from '../index'
import { clearComponents } from '../test-helper'

describe('@wired(selector)', () => {
  afterEach(() => clearComponents())

  it('wires the element in the component', () => {
    class Component {
      @wired('.elm') elm: HTMLDivElement
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
