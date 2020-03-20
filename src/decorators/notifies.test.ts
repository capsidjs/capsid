import * as assert from 'assert'
import * as genel from 'genel'
import { def, make, notifies } from '../index'
import { clearComponents } from '../test-helper'

describe('@notifies(event, selector)', () => {
  afterEach(() => clearComponents())

  it('throws error when empty event is given', () => {
    assert.throws(() => {
      class Component {
        @notifies(undefined as any, '.elm')
        method() {
          console.log()
        }
      }

      def('component', Component)
    }, /Unable to notify empty event: constructor=Component key=method/)
  })

  it('throws error when empty selector is given', () => {
    assert.throws(() => {
      class Component {
        @notifies('foo', undefined as any)
        method() {
          console.log()
        }
      }

      def('component', Component)
    }, /Error: Empty selector for @notifies: constructor=Component key=method event=foo/)
  })

  it('adds function to publish the event to the element of the given selector', () => {
    const CUSTOM_EVENT = 'foo-bar-baz-quz'

    class Component {
      @notifies(CUSTOM_EVENT, '.elm')
      publish() {
        console.log()
      }
    }

    def('component', Component)

    const el = genel.div`
      <div class="elm child0"></div>
      <div>
        <div></div>
        <div class="elm child1"></div>
      </div>
      <div>
        <div>
        </div>
        <div>
          <div>
            <div class="elm child2"></div>
            <div></div>
          </div>
        </div>
      </div>
    `

    const child0 = el.querySelector('.child0')!
    const child1 = el.querySelector('.child1')!
    const child2 = el.querySelector('.child2')!
    const component = make('component', el)

    const promise0 = new Promise(resolve =>
      child0.addEventListener(CUSTOM_EVENT, resolve)
    )
    const promise1 = new Promise(resolve =>
      child1.addEventListener(CUSTOM_EVENT, resolve)
    )
    const promise2 = new Promise(resolve =>
      child2.addEventListener(CUSTOM_EVENT, resolve)
    )

    component.publish()

    return Promise.all([promise0, promise1, promise2])
  })

  describe('The decorated method', () => {
    it('publishes events with the return value as detail', done => {
      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      class Component {
        @notifies(CUSTOM_EVENT, '.elm')
        publish() {
          return { foo: 123, bar: 'baz' }
        }
      }

      def('component', Component)

      const el = genel.div`
        <div class="child elm">
      `

      const child = el.querySelector('.child')!

      const component = make('component', el)

      child.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })

    it('publishes events with the resolved value as detail if it is async function', done => {
      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      class Component {
        @notifies(CUSTOM_EVENT, '.elm')
        publish() {
          return Promise.resolve({ foo: 123, bar: 'baz' })
        }
      }

      def('component', Component)

      const el = genel.div`
        <div class="child elm"></div>
      `
      const child = el.querySelector('.child')!

      const component = make('component', el)

      child.addEventListener(CUSTOM_EVENT as any, (e: CustomEvent) => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })
  })
})
