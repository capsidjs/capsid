import * as assert from 'assert'
import * as genel from 'genel'
import pub from './pub'
import on from './on'
import { prep, def } from '../index'
import { clearComponents } from '../test-helper'

describe('@pub(event)', () => {
  afterEach(() => clearComponents())

  it('throws error when empty event is given', () => {
    assert.throws(() => {
      class Component {
        @pub(undefined as any)
        method() {
          console.log()
        }
      }

      def('component', Component)
    }, /Unable to publish empty event: constructor=Component key=method/)
  })

  it('publishes the event to the elements of the sub:event class', async () => {
    const CUSTOM_EVENT = 'foo-bar'

    class Component {
      @pub(CUSTOM_EVENT)
      @on('foo')
      publish() {
        console.log()
      }
    }

    def('component', Component)

    const el = genel.div`
      <div class="component"></div>
      <div class="elm child0 sub:foo-bar"></div>
      <div>
        <div></div>
        <div class="elm child1 sub:foo-bar"></div>
      </div>
      <div>
        <div>
        </div>
        <div>
          <div>
            <div class="elm child2 sub:foo-bar"></div>
            <div></div>
          </div>
        </div>
      </div>
    `

    const child0 = el.querySelector('.child0')!
    const child1 = el.querySelector('.child1')!
    const child2 = el.querySelector('.child2')!
    const comp = el.querySelector('.component')!

    document.body.appendChild(el)

    prep()

    const promise0 = new Promise(resolve =>
      child0.addEventListener(CUSTOM_EVENT, resolve)
    )
    const promise1 = new Promise(resolve =>
      child1.addEventListener(CUSTOM_EVENT, resolve)
    )
    const promise2 = new Promise(resolve =>
      child2.addEventListener(CUSTOM_EVENT, resolve)
    )

    comp.dispatchEvent(new CustomEvent('foo'))

    await Promise.all([promise0, promise1, promise2])

    document.body.removeChild(el)
  })

  it('publishes events with the return value as detail', done => {
    const CUSTOM_EVENT = 'foo-bar'

    class Component {
      @pub(CUSTOM_EVENT)
      @on('foo')
      publish() {
        return { foo: 123, bar: 'baz' }
      }
    }

    def('component', Component)

    const el = genel.div`
      <div class="component">
      <div class="sub:foo-bar target">
    `
    document.body.appendChild(el)
    const target = el.querySelector('.target')
    const comp = el.querySelector('.component')

    prep()

    target!.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
      assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
      document.body.removeChild(el)
      done()
    })

    comp!.dispatchEvent(new CustomEvent('foo'))
  })

  it('publishes events with the resolved value as detail if it is async function', done => {
    const CUSTOM_EVENT = 'foo-bar'

    class Component {
      @pub(CUSTOM_EVENT)
      @on('foo')
      publish() {
        return Promise.resolve({ foo: 123, bar: 'baz' })
      }
    }

    def('component', Component)

    const el = genel.div`
      <div class="sub:foo-bar target"></div>
      <div class="component"></div>
    `
    document.body.appendChild(el)
    const target = el.querySelector('.target')!
    const comp = el.querySelector('.component')!

    prep()

    target.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
      assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
      document.body.removeChild(el)
      done()
    })

    comp.dispatchEvent(new CustomEvent('foo'))
  })
})

describe('@pub(event, selector)', () => {
  it('publishes events to the given selector', done => {
    const CUSTOM_EVENT = 'foo-bar'

    @component('component')
    class Component {
      @pub(CUSTOM_EVENT, '#foo-bar-receiver')
      @on('foo')
      publish() {
        return { foo: 123, bar: 'baz' }
      }
    }

    const el = genel.div`
      <div class="component">
      <div class="target" id="foo-bar-receiver">
    `
    document.body.appendChild(el)
    const target = el.querySelector('.target')
    const comp = el.querySelector('.component')

    prep()

    target!.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
      assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
      document.body.removeChild(el)
      done()
    })

    comp!.dispatchEvent(new CustomEvent('foo'))
  })
})
