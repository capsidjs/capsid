import * as assert from 'assert'
import * as genel from 'genel'
import { def, make, emits } from '../index'
import { clearComponents } from '../test-helper'

describe('@emits(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the empty event is given', () => {
    assert.throws(() => {
      class Component {
        @emits(undefined as any)
        emitter() {
          console.log()
        }
      }
      console.log(Component)
    }, /Unable to emits an empty event: constructor=Component key=emitter/)
  })

  it('makes the method emit the event with the returned value', (done) => {
    class Component {
      @emits('event-foo')
      foo() {
        return 321
      }
    }

    def('component', Component)

    const el = genel.div``

    el.addEventListener('event-foo' as any, (e: CustomEvent) => {
      assert(e.detail === 321)

      done()
    })

    make<Component>('component', el).foo()
  })

  it('makes the method emit the event with the resolved value after the promise resolved', (done) => {
    let promiseResolved = false

    class Component {
      @emits('event-foo')
      foo() {
        return new Promise((resolve) => {
          setTimeout(() => {
            promiseResolved = true
            resolve(123)
          }, 100)
        })
      }
    }
    def('component', Component)

    const el = genel.div``

    el.addEventListener('event-foo' as any, (e: CustomEvent) => {
      assert(promiseResolved)
      assert(e.detail === 123)

      done()
    })

    make<Component>('component', el).foo()
  })
})
