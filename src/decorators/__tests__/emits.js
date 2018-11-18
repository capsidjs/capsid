// @flow

import assert from 'assert'
import genel from 'genel'
import { def, make, emits } from '../../'
import { clearComponents } from '../../__tests__/helper'

describe('@emits(event)', () => {
  afterEach(() => clearComponents())

  it('throws when the empty event is given', () => {
    assert.throws(() => {
      class Component {
        @emits(undefined)
        emitter () {}
      }
      console.log(Component)
    }, /Unable to emits an empty event: constructor=Component key=emitter/)
  })

  it('makes the method emit the event with the returned value', done => {
    class Component {
      @emits('event-foo')
      foo () {
        return 321
      }
    }

    def('component', Component)

    const el = genel.div``

    el.addEventListener('event-foo', e => {
      assert(e.detail === 321)

      done()
    })

    make('component', el).foo()
  })

  it('makes the method emit the event with the resolved value after the promise resolved', done => {
    let promiseResolved = false

    class Component {
      @emits('event-foo')
      foo () {
        return new Promise(resolve => {
          setTimeout(() => {
            promiseResolved = true
            resolve(123)
          }, 100)
        })
      }
    }
    def('component', Component)

    const el = genel.div``

    el.addEventListener('event-foo', e => {
      assert(promiseResolved)
      assert(e.detail === 123)

      done()
    })

    make('component', el).foo()
  })
})
