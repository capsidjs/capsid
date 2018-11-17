// @flow

import assert from 'assert'
import genel from 'genel'
import { def, make, notifies } from '../../'
import { clearComponents } from '../../__tests__/helper'
import { callMethodDecorator } from './helper'

describe('@notifies(event, selector)', () => {
  afterEach(() => clearComponents())

  it('throws error when empty event is given', () => {
    class Component {
      method () {}
    }

    def('component', Component)

    assert.throws(() => {
      callMethodDecorator(notifies(undefined, '.elm'), Component, 'method')
    }, /Unable to notify empty event: constructor=Component key=method/)
  })

  it('adds function to publish the event to the element of the given selector', () => {
    class Component {
      publish () {}
    }

    const CUSTOM_EVENT = 'foo-bar-baz-quz'

    def('component', Component)

    callMethodDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

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

    const child0 = el.querySelector('.child0')
    const child1 = el.querySelector('.child1')
    const child2 = el.querySelector('.child2')
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
      class Component {
        publish () {
          return { foo: 123, bar: 'baz' }
        }
      }

      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      def('component', Component)

      callMethodDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

      const el = genel.div`
        <div class="child elm">
      `

      const child = el.querySelector('.child')

      const component = make('component', el)

      child.addEventListener(CUSTOM_EVENT, e => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })

    it('publishes events with the resolved value as detail if it is async function', done => {
      class Component {
        publish () {
          return Promise.resolve({ foo: 123, bar: 'baz' })
        }
      }

      const CUSTOM_EVENT = 'foo-bar-baz-quz'

      def('component', Component)

      callMethodDecorator(notifies(CUSTOM_EVENT, '.elm'), Component, 'publish')

      const el = genel.div`
        <div class="child elm"></div>
      `
      const child = el.querySelector('.child')

      const component = make('component', el)

      child.addEventListener(CUSTOM_EVENT, e => {
        assert.deepStrictEqual(e.detail, { foo: 123, bar: 'baz' })
        done()
      })

      component.publish()
    })
  })
})
